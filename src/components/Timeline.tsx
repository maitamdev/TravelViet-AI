import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Clock } from 'lucide-react';

interface TimelineItemProps {
  time: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  isLast?: boolean;
  children?: React.ReactNode;
}

export function TimelineItem({ time, title, description, icon: Icon = Clock, iconColor = 'text-primary', isLast = false, children }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0')}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
      </div>
      <div className={cn('pb-6 flex-1', isLast && 'pb-0')}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{time}</span>
        </div>
        <h4 className="font-medium text-sm">{title}</h4>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

interface TimelineProps { children: React.ReactNode; className?: string; }
export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn('space-y-0', className)}>{children}</div>;
}