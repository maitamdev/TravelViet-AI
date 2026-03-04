import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleLike, useUserLikedIds } from '@/hooks/useLikes';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  itineraryId: string;
  likesCount?: number;
}

export function LikeButton({ itineraryId, likesCount = 0 }: LikeButtonProps) {
  const { data: likedIds = [] } = useUserLikedIds();
  const toggleLike = useToggleLike();
  const isLiked = likedIds.includes(itineraryId);

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => toggleLike.mutate({ itineraryId, isLiked })}
      disabled={toggleLike.isPending}
      className={cn('gap-1', isLiked && 'text-red-500')}
    >
      <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
      {likesCount > 0 && <span className='text-xs'>{likesCount}</span>}
    </Button>
  );
}
