import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/string-utils';
import { stringToColor } from '@/lib/string-utils';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const statusSizes = { xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-4 h-4' };

export function UserAvatar({ src, name, size = 'md', className, showOnlineStatus = false, isOnline = false }: UserAvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const showFallback = !src || imgError;

  return (
    <div className={cn('relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0', sizeClasses[size], className)}>
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center font-semibold text-white" style={{ backgroundColor: bgColor }}>
          {initials}
        </div>
      ) : (
        <img src={src!} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} loading="lazy" />
      )}
      {showOnlineStatus && (
        <span className={cn('absolute bottom-0 right-0 rounded-full border-2 border-background', statusSizes[size], isOnline ? 'bg-green-500' : 'bg-gray-400')} />
      )}
    </div>
  );
}