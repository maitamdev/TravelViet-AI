import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Camera, UtensilsCrossed, Bus } from 'lucide-react';
import type { TripItem } from '@/types/database';
import { ITEM_TYPES, formatVND } from '@/lib/constants';

interface TripTimelineProps {
  items: TripItem[];
  dayIndex: number;
}

export function TripTimeline({ items, dayIndex }: TripTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'attraction': return <Camera className='h-4 w-4 text-blue-500' />;
      case 'food': return <UtensilsCrossed className='h-4 w-4 text-orange-500' />;
      case 'transport': return <Bus className='h-4 w-4 text-green-500' />;
      default: return <MapPin className='h-4 w-4 text-primary' />;
    }
  };

  return (
    <div className='relative'>
      <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-border' />
      {items.map((item, i) => {
        const itemType = ITEM_TYPES.find(t => t.value === item.item_type);
        return (
          <div key={item.id} className='relative pl-10 pb-6 last:pb-0'>
            <div className='absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background' />
            <div className='bg-card rounded-lg border p-3 hover:shadow-sm transition-shadow'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    {getIcon(item.item_type)}
                    <h4 className='text-sm font-medium'>{item.title}</h4>
                    {item.is_hidden_gem && <Badge variant='secondary' className='text-xs'>💎</Badge>}
                  </div>
                  {item.description && <p className='text-xs text-muted-foreground mt-1'>{item.description}</p>}
                  <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                    {item.start_time && (
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' /> {item.start_time}{item.end_time ? ' - ' + item.end_time : ''}
                      </span>
                    )}
                    {item.location_name && (
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3' /> {item.location_name}
                      </span>
                    )}
                  </div>
                </div>
                {item.estimated_cost_vnd > 0 && (
                  <Badge variant='outline' className='text-xs whitespace-nowrap'>{formatVND(item.estimated_cost_vnd)}</Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
