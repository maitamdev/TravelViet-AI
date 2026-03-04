import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ProgressRing';
import { formatVND } from '@/lib/constants';
import type { Trip, TripDay, TripItem } from '@/types/database';

interface TripStatsWidgetProps {
  trip: Trip;
  days: TripDay[];
  items: TripItem[];
}

export function TripStatsWidget({ trip, days, items }: TripStatsWidgetProps) {
  const totalItems = items.length;
  const totalCost = items.reduce((sum, item) => sum + (item.estimated_cost_vnd || 0), 0);
  const completionPct = days.length > 0 ? Math.round((days.filter(d => d.summary).length / days.length) * 100) : 0;
  const hiddenGems = items.filter(i => i.is_hidden_gem).length;

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <Card>
        <CardContent className='p-4 text-center'>
          <ProgressRing value={completionPct} size={50} strokeWidth={3} />
          <p className='text-xs text-muted-foreground mt-2'>Hoan thanh</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{days.length}</p>
          <p className='text-xs text-muted-foreground'>Ngay</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{totalItems}</p>
          <p className='text-xs text-muted-foreground'>Hoat dong</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{hiddenGems}</p>
          <p className='text-xs text-muted-foreground'>💎 Hidden Gems</p>
        </CardContent>
      </Card>
    </div>
  );
}
