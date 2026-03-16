import React from 'react';
import { cn } from '@/lib/utils';

interface TextAreaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  label?: string;
  error?: string;
  showCount?: boolean;
}

export const TextAreaWithCounter = React.forwardRef<HTMLTextAreaElement, TextAreaWithCounterProps>(
  ({ maxLength, label, error, showCount = true, className, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;
    const isNearLimit = currentLength >= maxLength * 0.9;
    const isOverLimit = currentLength > maxLength;

    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error && <p className="text-xs text-destructive">{error}</p>}
          {showCount && (
            <p className={cn('text-xs ml-auto', isOverLimit ? 'text-destructive font-medium' : isNearLimit ? 'text-yellow-600' : 'text-muted-foreground')}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
TextAreaWithCounter.displayName = 'TextAreaWithCounter';