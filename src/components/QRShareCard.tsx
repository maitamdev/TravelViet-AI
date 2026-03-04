import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import { generateShareUrl } from '@/lib/share-utils';

interface QRShareCardProps { slug: string; title: string; }

export function QRShareCard({ slug, title }: QRShareCardProps) {
  const shareUrl = generateShareUrl(slug);
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(shareUrl);
  const { copied, copy } = useClipboard();
  return (
    <Card className='w-fit'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <QrCode className='h-4 w-4' /> Chia se lich trinh
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <img src={qrUrl} alt={'QR ' + title} className='rounded-lg mx-auto' width={200} height={200} />
        <Button variant='outline' size='sm' className='w-full' onClick={() => copy(shareUrl)}>
          {copied ? <Check className='h-4 w-4 mr-1' /> : <Copy className='h-4 w-4 mr-1' />}
          {copied ? 'Da copy!' : 'Copy link'}
        </Button>
      </CardContent>
    </Card>
  );
}
