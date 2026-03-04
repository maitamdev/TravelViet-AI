import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className='bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm flex items-center justify-center gap-2'>
      <WifiOff className='h-4 w-4' />
      Mat ket noi mang. Vui long kiem tra lai.
    </div>
  );
}
