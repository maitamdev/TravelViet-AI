import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  autoFocus?: boolean;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({ value, onChange, onSearch, placeholder = 'Tìm kiếm...', loading = false, suggestions = [], onSelectSuggestion, autoFocus = false, debounceMs = 300, className }: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedValue(value); onSearch?.(value); }, debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs]); // eslint-disable-line

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => { onChange(''); inputRef.current?.focus(); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { onSearch?.(value); setShowSuggestions(false); } if (e.key === 'Escape') { setShowSuggestions(false); } };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input ref={inputRef} value={value} onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onKeyDown={handleKeyDown} placeholder={placeholder} className="pl-10 pr-10" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {value && !loading && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClear}><X className="h-3.5 w-3.5" /></Button>
          )}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button key={i} className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg" onClick={() => { onSelectSuggestion?.(s); onChange(s); setShowSuggestions(false); }}>
              <Search className="h-3 w-3 inline mr-2 text-muted-foreground" />{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}