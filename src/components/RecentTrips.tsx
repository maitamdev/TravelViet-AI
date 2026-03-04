import { useRecentActivity } from '@/hooks/useRecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/date-utils';

export function RecentTrips() {
  const { data: activities, isLoading } = useRecentActivity(5);

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Clock className='h-4 w-4' /> Hoat dong gan day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {activities?.map(trip => (
            <Link key={trip.id} to={'/trips/' + trip.id} className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{trip.title}</p>
                <p className='text-xs text-muted-foreground'>{formatRelativeTime(trip.updated_at)}</p>
              </div>
              <StatusBadge status={trip.status} />
            </Link>
          ))}
          {(!activities || activities.length === 0) && (
            <p className='text-sm text-muted-foreground text-center py-4'>Chua co hoat dong nao</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
