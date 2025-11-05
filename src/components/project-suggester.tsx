'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState, startTransition } from 'react';
import { getProjectSuggestions } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

function SubmitButton({ uploading = false }: { uploading?: boolean }) {
  const { pending } = useFormStatus();
  const busy = pending || uploading;
  return (
    <Button type="submit" disabled={busy} className="w-full bg-accent hover:bg-accent/90">
      {busy ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {uploading ? 'Uploading...' : 'Generating...'}
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Generate Descriptions
        </>
      )}
    </Button>
  );
}

export function ProjectSuggester() {
  const initialState = { message: '', descriptions: [], error: undefined };
  const [state, dispatch] = useActionState(getProjectSuggestions, initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uploadTimeoutRef = useRef<NodeJS.Timeout>();
  
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const MAX_TOTAL_SIZE = 2 * 1024 * 1024; // 2MB total limit

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check individual file sizes
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        e.target.value = ''; // Reset input
        return;
      }

      // Check total size including existing files
      const totalNewSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      const existingSize = files.reduce((sum, file) => sum + file.size, 0);
      
      if (totalNewSize + existingSize > MAX_TOTAL_SIZE) {
        setError('Total file size would exceed 2MB limit');
        e.target.value = ''; // Reset input
        return;
      }

      setError(null); // Clear any previous errors
      setFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Compress an image file using an offscreen canvas until it's under maxBytes or quality floor
  const compressImageFile = async (file: File, maxBytes: number): Promise<Blob> => {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      // Use createElement to avoid TypeScript issues with the Image constructor in some build environments
      const image = document.createElement('img') as HTMLImageElement;
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    const maxDim = 1024; // max width/height
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.max(width / maxDim, height / maxDim);
      width = Math.round(width / ratio);
      height = Math.round(height / ratio);
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(img, 0, 0, width, height);

    // Try decreasing quality until size under limit or quality floor reached
    let quality = 0.92;
    for (let i = 0; i < 6; i++) {
      // toBlob is async
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (!blob) throw new Error('Failed to compress image');
      if (blob.size <= maxBytes || quality <= 0.5) return blob;
      quality -= 0.12; // reduce quality and retry
    }

    // final attempt: return last blob at lower quality
    const finalBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.5));
    if (!finalBlob) throw new Error('Failed to compress image');
    return finalBlob;
  };

  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (state.message === 'Success') {
      setFiles([]);
      setPreviews([]);
      formRef.current?.reset();
    }
    
    // Cleanup function
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, [state.message]);

  const action = async (formData: FormData) => {
    try {
      // Final size check before upload
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        setError('Total file size exceeds 2MB limit');
        return;
      }

      setIsUploading(true);
      setError(null);
      
      // Set up upload timeout (30 seconds)
      uploadTimeoutRef.current = setTimeout(() => {
        setIsUploading(false);
        setError('Upload timeout - please try again');
        window.location.reload();
      }, 30000);

      let dataUrls = await Promise.all(files.map(fileToDataUrl));

      // Check encoded data URLs size
      let totalDataSize = dataUrls.reduce((sum, url) => sum + url.length, 0);
      const overheadFactor = 1.37; // base64 overhead estimate

      if (totalDataSize > MAX_TOTAL_SIZE * overheadFactor) {
        // Attempt client-side compression to reduce payload
        const compressedBlobs: Blob[] = [];
        for (const f of files) {
          try {
            // compress each file to be under MAX_FILE_SIZE if possible
            // allow slightly smaller target for encoded data
            // we target half of MAX_TOTAL_SIZE divided by number of files to be safe
            const target = Math.max(100000, Math.floor(MAX_TOTAL_SIZE / Math.max(1, files.length)));
            // eslint-disable-next-line no-await-in-loop
            const compressed = await compressImageFile(f, target);
            compressedBlobs.push(compressed);
          } catch (err) {
            console.warn('Compression failed for file', f.name, err);
            compressedBlobs.push(f); // fallback to original file
          }
        }

        // Convert compressed blobs to data URLs
        dataUrls = await Promise.all(compressedBlobs.map((b) => blobToDataUrl(b as Blob)));
        totalDataSize = dataUrls.reduce((sum, url) => sum + url.length, 0);
      }

      // If still too large, try direct client-side Cloudinary unsigned upload (requires NEXT_PUBLIC env vars)
      if (totalDataSize > MAX_TOTAL_SIZE * overheadFactor) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        if (cloudName && uploadPreset) {
          // Upload each file/blob directly to Cloudinary unsigned
          const uploadedUrls: string[] = [];
          for (const file of files) {
            try {
              const form = new FormData();
              form.append('file', file);
              form.append('upload_preset', uploadPreset);
              // eslint-disable-next-line no-await-in-loop
              const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: form,
              });
              if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Cloudinary unsigned upload failed: ${txt}`);
              }
              const json = await res.json();
              uploadedUrls.push(json.secure_url);
            } catch (err) {
              console.error('Direct Cloudinary upload failed', err);
            }
          }

          if (uploadedUrls.length > 0) {
            uploadedUrls.forEach((url) => formData.append('images', url));
            startTransition(() => {
              dispatch(formData);
            });
            return;
          }
        }

        // If we get here, compression and direct uploads failed
        throw new Error('Payload still too large after compression and fallback upload attempts. Try smaller images or enable Cloudinary unsigned uploads.');
      }

      dataUrls.forEach((url) => formData.append('images', url));
      
      startTransition(() => {
        dispatch(formData);
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed - please try again');
      setTimeout(() => window.location.reload(), 3000); // Reload after 3 seconds on error
    } finally {
      // Clear the timeout if the upload completes (success or failure)
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
      setIsUploading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Re-submit the form programmatically
    if (formRef.current) {
      if (typeof (formRef.current as any).requestSubmit === 'function') {
        (formRef.current as any).requestSubmit();
      } else {
        formRef.current.submit();
      }
    }
  };

  return (
    <Card>
      <form ref={formRef} action={action}>
        <CardHeader>
          <CardTitle>Upload Project Images</CardTitle>
          <CardDescription>Select one or more images that represent your project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="images">Project Images</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (Max 2MB per file, 2MB total)</p>
                  {error && (
                    <p className="mt-2 text-sm text-destructive font-medium">{error}</p>
                  )}
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          {previews.length > 0 && (
            <div>
              <Label>Selected Images</Label>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={src}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="rounded-md object-cover w-full aspect-square"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-75 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton uploading={isUploading} />
        </CardFooter>
      </form>

      {isUploading && (
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <div>
              <p className="font-medium">Uploading images...</p>
              <p className="text-sm text-muted-foreground">Uploading to server — this may take a moment.</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-muted rounded overflow-hidden">
            <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      <div className="p-6 pt-0">
        {(state.error || error) && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error ?? error}</AlertDescription>
            </Alert>
            <div className="mt-3 flex items-center space-x-2">
              <Button onClick={handleRetry} disabled={isUploading} className="inline-flex">
                Retry
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  // allow user to clear files and start over
                  setFiles([]);
                  setPreviews([]);
                  setError(null);
                  formRef.current?.reset();
                }}
                disabled={isUploading}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
        {state.descriptions && state.descriptions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-bold font-headline">Generated Descriptions</h3>
            {state.descriptions.map((desc, index) => (
              <Card key={index} className="bg-secondary">
                <CardContent className="p-4">
                  <p className="text-foreground/90">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

