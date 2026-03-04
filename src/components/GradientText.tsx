import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'sunset' | 'ocean' | 'forest';
}

const GRADIENTS = {
  primary: 'from-primary via-secondary to-accent',
  sunset: 'from-orange-500 via-red-500 to-pink-500',
  ocean: 'from-blue-500 via-cyan-500 to-teal-500',
  forest: 'from-green-500 via-emerald-500 to-teal-500',
};

export function GradientText({ children, className, variant = 'primary' }: GradientTextProps) {
  return (
    <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', GRADIENTS[variant], className)}>
      {children}
    </span>
  );
}
