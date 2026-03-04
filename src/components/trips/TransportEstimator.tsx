import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navigation } from 'lucide-react';
import { TRANSPORT_OPTIONS, estimateTransportCost } from '@/lib/transport-data';
import { formatVND } from '@/lib/constants';

export function TransportEstimator() {
  const [distance, setDistance] = useState('');

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Navigation className='h-4 w-4' />
          Uoc tinh chi phi di chuyen
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label className='text-xs'>Khoang cach (km)</Label>
          <Input
            type='number'
            value={distance}
            onChange={e => setDistance(e.target.value)}
            placeholder='Vi du: 300'
          />
        </div>
        {Number(distance) > 0 && (
          <div className='space-y-2'>
            {TRANSPORT_OPTIONS.map(opt => (
              <div key={opt.type} className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                <div className='flex items-center gap-2'>
                  <span>{opt.icon}</span>
                  <div>
                    <p className='text-sm font-medium'>{opt.note}</p>
                  </div>
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {formatVND(estimateTransportCost(opt.type, Number(distance)))}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
