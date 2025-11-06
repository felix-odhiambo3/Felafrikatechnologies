'use server';

import { z } from 'zod';
import {
  generateProjectDescriptions,
  type GenerateProjectDescriptionsInput,
  type GenerateProjectDescriptionsOutput,
} from '@/ai/flows/generate-project-descriptions';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes.'),
  email: z.string()
    .email('Invalid email address.')
    .max(255, 'Email must not exceed 255 characters.')
    .regex(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address.'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters.')
    .max(200, 'Subject must not exceed 200 characters.')
    .regex(/^[^<>{}]*$/, 'Subject contains invalid characters.'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters.')
    .max(5000, 'Message must not exceed 5000 characters.')
    .regex(/^[^<>{}]*$/, 'Message contains invalid characters.'),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // Require minimum score of 0.5
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Verify reCAPTCHA token first
  const recaptchaToken = formData.get('recaptchaToken') as string;
  if (!recaptchaToken) {
    return {
      message: 'Error! Please verify you are human.',
      errors: { email: ['CAPTCHA verification required'] },
    };
  }

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return {
      message: 'Error! CAPTCHA verification failed.',
      errors: { email: ['CAPTCHA verification failed - please try again'] },
    };
  }

  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { message: 'Error! Email service is not configured properly.' };
    }

    // Use configured email or fall back to default onboarding address
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.RESEND_TO_EMAIL || 'felafrikasoftware.engineer@yahoo.com';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <p>You have a new message from your portfolio contact form:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Handle common Resend errors with user-friendly messages
      if (error.statusCode === 429) {
        return { message: 'Too many messages sent. Please wait a few minutes before trying again.' };
      }
      
      if (error.statusCode === 422) {
        return { message: 'Invalid email configuration. Please check your email address.' };
      }

      if (error.message?.includes('domain not verified')) {
        return { message: 'Sender domain is not verified. Please contact the administrator.' };
      }

      return { 
        message: 'Could not send message. Please try again later.',
        errors: {
          email: ['Email service temporarily unavailable']
        }
      };
    }

    return { 
      message: 'Success! Your message has been sent. We will get back to you shortly.',
      // Clear any previous errors
      errors: undefined
    };
  } catch (error) {
    console.error('Email sending error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Handle different types of errors
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return { 
        message: 'Network error. Please check your connection and try again.',
        errors: {
          email: ['Connection failed - please try again']
        }
      };
    }
    
    return { 
      message: 'Could not send message. Please try again later.',
      errors: {
        email: ['Service temporarily unavailable']
      }
    };
  }
}

// AI Project Suggester Action
export type ProjectSuggesterState = {
  message: string;
  descriptions?: string[];
  error?: string;
};

export async function getProjectSuggestions(
  prevState: ProjectSuggesterState,
  formData: FormData,
): Promise<ProjectSuggesterState> {
  const images = formData.getAll('images') as string[];
  const numDescriptions = parseInt((formData.get('numDescriptions') as string) || '3', 10);

  if (!images || images.length === 0) {
    return { message: 'Error', error: 'Please upload at least one image.' };
  }

  try {
    // If images are data URLs (base64) upload them to Cloudinary from the server
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    let uploadedImageUris: string[] = images;

    if (images.length > 0 && images[0].startsWith('data:')) {
      if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in environment variables.');
      }

      // Upload each data URL to Cloudinary
      const crypto = await import('crypto');

      const uploads = await Promise.all(
        images.map(async (dataUrl, idx) => {
          const timestamp = Math.floor(Date.now() / 1000);
          // Minimal params: timestamp required for signature
          const signatureString = `timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

          const uploadForm = new FormData();
          uploadForm.append('file', dataUrl);
          uploadForm.append('api_key', apiKey);
          uploadForm.append('timestamp', String(timestamp));
          uploadForm.append('signature', signature);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: uploadForm,
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
          }

          const json = await res.json();
          return json.secure_url as string;
        })
      );

      uploadedImageUris = uploads;
    }

    const input: GenerateProjectDescriptionsInput = {
      imageUris: uploadedImageUris,
      numDescriptions: numDescriptions,
    };

    // Run the generation with a configurable timeout so the server action doesn't hang forever.
    const timeoutMs = parseInt(process.env.SUGGESTION_TIMEOUT_MS || '30000', 10);

    const result = (await Promise.race([
      generateProjectDescriptions(input),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Generation timed out')), timeoutMs)
      ),
    ])) as GenerateProjectDescriptionsOutput;

    if (result.descriptions && result.descriptions.length > 0) {
      return { message: 'Success', descriptions: result.descriptions };
    } else {
      return {
        message: 'Error',
        error: 'The AI could not generate descriptions. Please try again.',
      };
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: 'Error', error: `An error occurred: ${errorMessage}` };
  }
}
