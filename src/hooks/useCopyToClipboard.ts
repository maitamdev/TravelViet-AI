import { useState, useCallback } from 'react';

interface CopyResult {
  copied: boolean;
  error: string | null;
  copyToClipboard: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Enhanced clipboard hook with fallback support
 */
export function useCopyToClipboard(resetDelay = 2000): CopyResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      }

      // Fallback for older browsers or non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (success) {
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      }
      throw new Error('execCommand copy failed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Copy failed';
      setError(message);
      setCopied(false);
      return false;
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copied, error, copyToClipboard, reset };
}