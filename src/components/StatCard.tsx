import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

export function StatCard({ icon: Icon, label, value, color = 'text-primary', bgColor = 'bg-primary/10' }: StatCardProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center gap-4'>
          <div className={'p-3 rounded-xl ' + bgColor}><Icon className={'h-6 w-6 ' + color} /></div>
          <div>
            <p className='text-sm text-muted-foreground'>{label}</p>
            <p className='text-2xl font-bold'>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
