import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Check } from 'lucide-react';
import { generateShareUrl } from '@/lib/share-utils';

interface ShareButtonProps {
  slug: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export function ShareButton({ slug, variant = 'outline', size = 'sm' }: ShareButtonProps) {
  const { copied, copy } = useClipboard();
  const { toast } = useToast();

  const handleShare = async () => {
    const url = generateShareUrl(slug);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TravelViet Trip', url });
      } catch { }
    } else {
      await copy(url);
      toast({ title: 'Da sao chep link!' });
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleShare}>
      {copied ? <Check className='h-4 w-4 mr-1' /> : <Share2 className='h-4 w-4 mr-1' />}
      {copied ? 'Da copy' : 'Chia se'}
    </Button>
  );
}
