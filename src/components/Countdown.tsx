import { useState, useEffect } from 'react';
import { getDaysUntil } from '@/lib/date-utils';

interface CountdownProps {
  targetDate: string;
  label?: string;
}

export function Countdown({ targetDate, label = 'Con lai' }: CountdownProps) {
  const [days, setDays] = useState(getDaysUntil(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setDays(getDaysUntil(targetDate)), 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (days <= 0) return <span className='text-green-500 font-medium'>Dang dien ra!</span>;

  return (
    <span className='text-primary font-medium'>
      {label} {days} ngay
    </span>
  );
}
