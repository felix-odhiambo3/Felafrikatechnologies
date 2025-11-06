'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>({ message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [recaptchaLoading, setRecaptchaLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [submitCount, setSubmitCount] = useState(0);
  const lastSubmitTime = useRef<number>(0);
  
  // Initialize reCAPTCHA
  useRecaptcha({
    action: 'contact_form',
    onVerify: (token) => {
      setRecaptchaToken(token);
      setRecaptchaLoading(false);
    },
    onError: (msg) => {
      setRecaptchaLoading(false);
      setRecaptchaToken('');
      toast({ title: 'Security check', description: msg, variant: 'destructive' });
    },
  });

  const manualRecaptchaAttempt = async () => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      toast({ title: 'reCAPTCHA', description: 'Site key not configured.', variant: 'destructive' });
      return;
    }

    const loadScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).grecaptcha) return resolve();
        // check if script already exists in DOM
        const existing = document.querySelector('script[src*="recaptcha/api.js"]');
        if (existing) {
          // wait briefly for grecaptcha to appear
          const waitStart = Date.now();
          const wait = () => {
            if ((window as any).grecaptcha) return resolve();
            if (Date.now() - waitStart > 8000) return reject(new Error('reCAPTCHA did not load in time'));
            setTimeout(wait, 150);
          };
          wait();
          return;
        }

        const s = document.createElement('script');
        s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(new Error('Failed to load reCAPTCHA script'));
        document.head.appendChild(s);
      });
    };

    try {
      setRecaptchaLoading(true);
      await loadScript();
      // ensure grecaptcha is ready
      await new Promise<void>((resolve, reject) => {
        const readyStart = Date.now();
        const checkReady = () => {
          if ((window as any).grecaptcha && (window as any).grecaptcha.ready) return resolve();
          if (Date.now() - readyStart > 8000) return reject(new Error('reCAPTCHA did not initialize'));
          setTimeout(checkReady, 150);
        };
        checkReady();
      });

      const token = await (window as any).grecaptcha.execute(siteKey, { action: 'contact_form' });
      setRecaptchaToken(token);
      setRecaptchaLoading(false);
      toast({ title: 'Security', description: 'Security check passed.', variant: 'default' });
    } catch (e) {
      console.error('Manual reCAPTCHA attempt failed', e);
      setRecaptchaLoading(false);
      toast({ title: 'Security', description: 'Security check failed. Try again later.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    // Ensure we have a reCAPTCHA token
    if (!recaptchaToken) {
      toast({
        title: 'Please wait',
        description: 'Security check is still loading. Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }
    formData.append('recaptchaToken', recaptchaToken);

    // Client-side rate limiting
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime.current;
    const RATE_LIMIT_WINDOW = 60000; // 1 minute
    const MAX_SUBMISSIONS = 3; // Max 3 submissions per minute

    if (timeSinceLastSubmit < 2000) { // Minimum 2 seconds between submissions
      toast({
        title: 'Please wait',
        description: 'Please wait a moment before sending another message.',
        variant: 'destructive',
      });
      return;
    }

    if (submitCount >= MAX_SUBMISSIONS && timeSinceLastSubmit < RATE_LIMIT_WINDOW) {
      toast({
        title: 'Too many attempts',
        description: 'Please wait a minute before sending more messages.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await submitContactForm(state, formData);
      setState(result);

      if (result.message.startsWith('Success')) {
        toast({
          title: 'Success',
          description: result.message,
        });
        formRef.current?.reset();
        // Reset submission counter after window expires
        setTimeout(() => setSubmitCount(0), RATE_LIMIT_WINDOW);
      } else if (result.message.startsWith('Error') || result.errors) {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }

      // Update rate limiting state
      lastSubmitTime.current = now;
      if (timeSinceLastSubmit >= RATE_LIMIT_WINDOW) {
        setSubmitCount(1); // Reset counter if window has passed
      } else {
        setSubmitCount(prev => prev + 1);
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" required disabled={isPending} />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          disabled={isPending}
        />
        {state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Inquiry Subject"
          required
          disabled={isPending}
        />
        {state.errors?.subject && (
          <p className="text-sm text-destructive">{state.errors.subject.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message..."
          rows={5}
          required
          disabled={isPending}
        />
        {state.errors?.message && (
          <p className="text-sm text-destructive">{state.errors.message.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        {recaptchaLoading && (
          <p className="text-sm text-muted-foreground">Loading security check...</p>
        )}
        {!recaptchaLoading && !recaptchaToken && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-destructive">Security check failed to initialize.</p>
            <button type="button" onClick={manualRecaptchaAttempt} className="text-sm underline text-accent">Retry security check</button>
          </div>
        )}
        <SubmitButton />
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" className="underline">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" className="underline">
          Terms of Service
        </a>{' '}
        apply.
      </div>
    </form>
  );
}
