import { useState } from 'react';
import { useTripComments, useAddTripComment, useDeleteTripComment } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TripCommentsSectionProps {
  tripId: string;
}

export function TripCommentsSection({ tripId }: TripCommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { data: comments, isLoading } = useTripComments(tripId);
  const addComment = useAddTripComment();
  const deleteComment = useDeleteTripComment();

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({ tripId, content: newComment.trim() });
    setNewComment('');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <MessageSquare className='h-5 w-5' />
          Binh luan ({comments?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Comment list */}
        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : comments && comments.length > 0 ? (
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {comments.map((comment: any) => (
              <div key={comment.id} className='flex gap-3 group'>
                <Avatar className='h-8 w-8 flex-shrink-0'>
                  <AvatarImage src={comment.user?.avatar_url || undefined} />
                  <AvatarFallback className='text-xs'>{getInitials(comment.user?.full_name)}</AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-sm font-medium'>{comment.user?.full_name || 'An danh'}</p>
                    <p className='text-sm mt-1'>{comment.content}</p>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>{formatTime(comment.created_at)}</p>
                </div>
                {user?.id === comment.user_id && (
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7 opacity-0 group-hover:opacity-100'
                    onClick={() => deleteComment.mutate({ commentId: comment.id, tripId })}
                  >
                    <Trash2 className='h-3 w-3 text-destructive' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-4'>Chua co binh luan nao</p>
        )}

        {/* Add comment */}
        <div className='flex gap-2'>
          <Input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder='Viet binh luan...'
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <Button size='icon' onClick={handleSubmit} disabled={!newComment.trim() || addComment.isPending}>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

