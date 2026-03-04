import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  size?: 'default' | 'sm' | 'icon';
}

export function CopyButton({ text, size = 'icon' }: CopyButtonProps) {
  const { copied, copy } = useClipboard();
  return (
    <Button variant='ghost' size={size} onClick={() => copy(text)} title='Sao chep'>
      {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
    </Button>
  );
}
