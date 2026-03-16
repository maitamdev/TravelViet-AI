import React from 'react';
import { cn } from '@/lib/utils';
import { X, Check } from 'lucide-react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const colorClasses = {
  default: 'bg-muted text-muted-foreground hover:bg-muted/80',
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  success: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400',
};

const sizeClasses = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-3 py-1 gap-1.5' };

export function Chip({ label, selected, onToggle, onRemove, icon, color = 'default', size = 'md', className }: ChipProps) {
  const isInteractive = onToggle || onRemove;
  const baseClasses = cn(
    'inline-flex items-center rounded-full font-medium transition-colors',
    sizeClasses[size],
    selected ? 'bg-primary text-primary-foreground' : colorClasses[color],
    isInteractive && 'cursor-pointer',
    className
  );

  return (
    <span className={baseClasses} onClick={onToggle} role={onToggle ? 'button' : undefined} tabIndex={onToggle ? 0 : undefined}>
      {selected && <Check className="h-3 w-3" />}
      {icon && !selected && icon}
      {label}
      {onRemove && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:bg-black/10 rounded-full p-0.5 ml-0.5" aria-label={`Xóa ${label}`}>
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}