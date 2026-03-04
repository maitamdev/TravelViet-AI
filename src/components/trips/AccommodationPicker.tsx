import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hotel } from 'lucide-react';
import { ACCOMMODATION_TYPES, estimateStayCost } from '@/lib/accommodation-data';
import { formatVND } from '@/lib/constants';

interface AccommodationPickerProps {
  nights: number;
}

export function AccommodationPicker({ nights }: AccommodationPickerProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Hotel className='h-4 w-4' />
          Uoc tinh chi phi luu tru ({nights} dem)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {ACCOMMODATION_TYPES.map(accom => (
            <div key={accom.type} className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{accom.icon}</span>
                <div>
                  <p className='text-sm font-medium'>{accom.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className='text-xs text-muted-foreground'>{accom.priceRange}/dem</p>
                </div>
              </div>
              <Badge variant='outline' className='text-xs font-mono'>
                {formatVND(estimateStayCost(accom.type, nights))}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
