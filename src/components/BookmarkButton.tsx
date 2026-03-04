import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useToggleBookmark, useUserBookmarkIds } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  itineraryId: string;
}

export function BookmarkButton({ itineraryId }: BookmarkButtonProps) {
  const { data: bookmarkIds = [] } = useUserBookmarkIds();
  const toggleBookmark = useToggleBookmark();
  const isBookmarked = bookmarkIds.includes(itineraryId);

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => toggleBookmark.mutate({ itineraryId, isBookmarked })}
      disabled={toggleBookmark.isPending}
      className={cn(isBookmarked && 'text-yellow-500')}
    >
      <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
    </Button>
  );
}
