import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' };

export function RatingStars({ rating, maxRating = 5, size = 'md', interactive = false, onChange, showValue = false, className }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className={cn('flex items-center gap-0.5', className)} role="group" aria-label={`Đánh giá: ${rating} trên ${maxRating} sao`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayRating;
        const halfFilled = !filled && starValue - 0.5 <= displayRating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn('transition-colors', interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default')}
            aria-label={`${starValue} sao`}
          >
            <Star className={cn(sizeMap[size], filled ? 'fill-yellow-400 text-yellow-400' : halfFilled ? 'fill-yellow-200 text-yellow-400' : 'text-gray-300')} />
          </button>
        );
      })}
      {showValue && <span className="ml-1 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
}