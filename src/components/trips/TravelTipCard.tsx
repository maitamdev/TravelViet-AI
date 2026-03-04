import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { getTipForProvince } from '@/lib/travel-tips';

interface TravelTipCardProps {
  province: string;
}

export function TravelTipCard({ province }: TravelTipCardProps) {
  const tip = getTipForProvince(province);
  if (!tip) return null;

  return (
    <Card className='bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800'>
      <CardContent className='p-4'>
        <div className='flex gap-3'>
          <Lightbulb className='h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-medium text-emerald-700 dark:text-emerald-400'>Meo du lich</p>
            <p className='text-sm text-muted-foreground mt-1'>{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
