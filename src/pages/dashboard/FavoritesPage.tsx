import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Bookmark, MapPin, ExternalLink, BookmarkX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <FavoritesContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function FavoritesContent() {
  const { data: bookmarks, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold'>Yeu thich</h1>
        <p className='text-muted-foreground mt-1'>Cac lich trinh ban da luu</p>
      </div>

      {isLoading ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className='p-6 space-y-4'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
              <Skeleton className='h-20 w-full' />
            </CardContent></Card>
          ))}
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {bookmarks.map((bm: any) => {
            const itinerary = bm.public_itinerary;
            if (!itinerary) return null;
            return (
              <Card key={bm.id} className='card-hover overflow-hidden'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg line-clamp-2'>{itinerary.title}</CardTitle>
                  {itinerary.owner && (
                    <p className='text-sm text-muted-foreground'>boi {itinerary.owner.full_name || 'An danh'}</p>
                  )}
                </CardHeader>
                <CardContent className='pb-3'>
                  {itinerary.summary && <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>{itinerary.summary}</p>}
                  {itinerary.trip?.destination_provinces?.length > 0 && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
                      <MapPin className='h-4 w-4 text-primary' />
                      <span className='line-clamp-1'>{itinerary.trip.destination_provinces.join(', ')}</span>
                    </div>
                  )}
                  {itinerary.tags?.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {itinerary.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant='secondary' className='text-xs'>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className='pt-3 border-t'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'><Heart className='h-4 w-4' /> {itinerary.likes_count || 0}</span>
                    </div>
                    <div className='flex gap-2'>
                      <Button size='sm' variant='ghost' onClick={() => toggleBookmark.mutate({ itineraryId: itinerary.id, isBookmarked: true })}>
                        <BookmarkX className='h-4 w-4 text-destructive' />
                      </Button>
                      <Button asChild size='sm' variant='ghost'>
                        <Link to={'/share/' + itinerary.trip_id}><ExternalLink className='h-4 w-4' /></Link>
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className='border-dashed'>
          <CardContent className='py-12 text-center'>
            <Bookmark className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
            <h3 className='font-semibold mb-2'>Chua co lich trinh yeu thich</h3>
            <p className='text-sm text-muted-foreground mb-4'>Kham pha cong dong va luu cac lich trinh ban thich!</p>
            <Button asChild><Link to='/community'>Kham pha ngay</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

