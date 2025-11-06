'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

// Add NodeJS types for Timeout
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}

type UseRecaptchaProps = {
  action: string;
  onVerify: (token: string) => void;
  onError?: (message: string) => void;
};

type RecaptchaState = {
  loaded: boolean;
  error: string | null;
};

export function useRecaptcha({ action, onVerify, onError }: UseRecaptchaProps) {
  const [state, setState] = useState<RecaptchaState>({ loaded: false, error: null });
  const recaptchaCheckRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();
    const MAX_WAIT = 8000; // ms to wait for grecaptcha to appear

    const executeRecaptcha = async () => {
      try {
        const token = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action }
        );
        if (mounted) {
          setState({ loaded: true, error: null });
          onVerify(token);
        }
      } catch (error) {
        console.error('reCAPTCHA execution error:', error);
        if (mounted) {
          setState({ loaded: true, error: 'Failed to verify - please try again' });
          onError?.('Failed to verify - please try again');
        }
      }
    };

    const checkRecaptchaLoaded = () => {
      // stop if we've waited too long
      if (Date.now() - start > MAX_WAIT) {
        if (mounted) {
          setState({ loaded: false, error: 'reCAPTCHA did not load in time' });
          onError?.('Security check failed to load, please try again later.');
        }
        return;
      }

      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.ready(() => {
          if (mounted) {
            executeRecaptcha();
            // start token refresh interval
            tokenRefreshRef.current = setInterval(executeRecaptcha, 120000) as unknown as NodeJS.Timeout;
          }
        });
      } else if (mounted) {
        // Check again in 150ms if not loaded
        recaptchaCheckRef.current = setTimeout(checkRecaptchaLoaded, 150) as unknown as NodeJS.Timeout;
      }
    };

    checkRecaptchaLoaded();

    return () => {
      mounted = false;
      if (recaptchaCheckRef.current) {
        clearTimeout(recaptchaCheckRef.current as unknown as number);
      }
      if (tokenRefreshRef.current) {
        clearInterval(tokenRefreshRef.current as unknown as number);
      }
    };
  }, [action, onVerify, onError]);
}

export function RecaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured');
    return null;
  }

  return (
    <>
      <Script 
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('reCAPTCHA script loaded');
          // Initialize reCAPTCHA after script loads
          (window as any).grecaptcha?.ready(() => {
            console.log('reCAPTCHA ready');
          });
        }}
        onError={(e) => {
          console.error('reCAPTCHA script failed to load:', e);
        }}
      />
      <div id="recaptcha-badge" className="g-recaptcha" data-sitekey={siteKey} data-size="invisible" />
    </>
  );
}