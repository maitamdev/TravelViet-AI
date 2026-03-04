import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed } from 'lucide-react';
import { getFoodsByCity } from '@/lib/food-data';

interface FoodRecommendationProps {
  destination: string;
}

export function FoodRecommendation({ destination }: FoodRecommendationProps) {
  const foods = getFoodsByCity(destination);
  if (foods.length === 0) return null;

  return (
    <Card className='bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <UtensilsCrossed className='h-4 w-4 text-orange-500' />
          Mon an dac san
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {foods.map(food => (
            <Badge key={food} variant='secondary' className='text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
              🍜 {food}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
