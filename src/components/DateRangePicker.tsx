import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
}

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange, placeholder = 'Chọn ngày', className, minDate }: DateRangePickerProps) {
  const formatDate = (date: Date | undefined) => date ? format(date, 'dd/MM/yyyy') : '';
  const displayText = startDate && endDate ? `${formatDate(startDate)} — ${formatDate(endDate)}` : startDate ? `Từ ${formatDate(startDate)}` : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('justify-start text-left font-normal min-w-[240px]', !startDate && 'text-muted-foreground', className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3">
          <div>
            <p className="text-xs font-medium mb-2 text-center text-muted-foreground">Ngày đi</p>
            <Calendar mode="single" selected={startDate} onSelect={(date) => { onStartDateChange(date); if (endDate && date && date > endDate) onEndDateChange(undefined); }} disabled={(date) => (minDate ? date < minDate : date < new Date())} initialFocus />
          </div>
          <div>
            <p className="text-xs font-medium mb-2 text-center text-muted-foreground">Ngày về</p>
            <Calendar mode="single" selected={endDate} onSelect={onEndDateChange} disabled={(date) => startDate ? date < startDate : date < new Date()} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}