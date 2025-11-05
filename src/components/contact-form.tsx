'use client';

import { useState, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
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
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await submitContactForm(state, formData);
      setState(result);

      if (result.message.startsWith('Success')) {
        toast({
          title: 'Success',
          description: result.message,
        });
        formRef.current?.reset();
      } else if (result.message.startsWith('Error') || result.errors) {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
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
      <SubmitButton />
    </form>
  );
}
