import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  onConfirm: () => void;
  confirmText?: string;
  confirmDelay?: number;
}

export function ConfirmButton({ onConfirm, confirmText = 'Xác nhận?', confirmDelay = 3000, children, variant = 'destructive', className, ...props }: ConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  React.useEffect(() => {
    if (!isConfirming) return;
    const timer = setTimeout(() => setIsConfirming(false), confirmDelay);
    return () => clearTimeout(timer);
  }, [isConfirming, confirmDelay]);

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-destructive font-medium flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5" />{confirmText}
        </span>
        <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => { setIsConfirming(false); onConfirm(); }}>
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setIsConfirming(false)}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant={variant} className={className} onClick={() => setIsConfirming(true)} {...props}>
      {children}
    </Button>
  );
}