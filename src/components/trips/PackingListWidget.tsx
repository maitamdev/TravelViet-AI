import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Backpack } from 'lucide-react';
import { PACKING_ESSENTIALS } from '@/lib/packing-list';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PackingListWidgetProps {
  tripId: string;
}

export function PackingListWidget({ tripId }: PackingListWidgetProps) {
  const [checked, setChecked] = useLocalStorage<string[]>('packing_' + tripId, []);

  const toggle = (item: string) => {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const progress = PACKING_ESSENTIALS.length > 0
    ? Math.round((checked.length / PACKING_ESSENTIALS.length) * 100)
    : 0;

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <Backpack className='h-4 w-4' />
            Danh sach chuan bi ({progress}%)
          </CardTitle>
          <span className='text-xs text-muted-foreground'>{checked.length}/{PACKING_ESSENTIALS.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2 max-h-64 overflow-y-auto'>
          {PACKING_ESSENTIALS.map(item => (
            <div key={item.item} className='flex items-center gap-3 group'>
              <Checkbox
                checked={checked.includes(item.item)}
                onCheckedChange={() => toggle(item.item)}
              />
              <span className={'text-sm flex-1 ' + (checked.includes(item.item) ? 'line-through text-muted-foreground' : '')}>
                {item.item}
              </span>
              <Badge variant='outline' className={'text-xs ' + priorityColor(item.priority)}>
                {item.priority === 'high' ? 'Quan trong' : item.priority === 'medium' ? 'Nen co' : 'Tuy chon'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
