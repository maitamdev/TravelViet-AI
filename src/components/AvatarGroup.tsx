import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarGroupProps {
  users: Array<{ avatar_url?: string | null; full_name?: string | null }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const remaining = users.length - max;
  const sizeClasses = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };
  return (
    <div className='flex -space-x-2'>
      {shown.map((user, i) => (
        <Avatar key={i} className={cn(sizeClasses[size], 'border-2 border-background')}>
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className='bg-primary text-primary-foreground'>
            {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className={cn(sizeClasses[size], 'border-2 border-background')}>
          <AvatarFallback className='bg-muted text-muted-foreground'>+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
