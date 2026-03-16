import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step { title: string; description?: string; }
interface StepperProps { steps: Step[]; currentStep: number; className?: string; }

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border-2',
                isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                isCurrent ? 'border-primary text-primary bg-primary/10' :
                'border-muted-foreground/30 text-muted-foreground'
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className={cn('text-xs font-medium', (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground')}>{step.title}</p>
                {step.description && <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[80px]">{step.description}</p>}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2 mt-[-16px]', isCompleted ? 'bg-primary' : 'bg-muted-foreground/20')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}