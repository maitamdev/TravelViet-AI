import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className='border-dashed'>
      <CardContent className='py-12 text-center'>
        <Icon className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
        <h3 className='font-semibold mb-2'>{title}</h3>
        <p className='text-sm text-muted-foreground mb-4'>{description}</p>
        {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </CardContent>
    </Card>
  );
}
