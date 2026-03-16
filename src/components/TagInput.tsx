import React, { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
  className?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Thêm tag...', maxTags = 10, suggestions = [], className }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
    onChange([...tags, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => { onChange(tags.filter((_, i) => i !== index)); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(inputValue); }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) { removeTag(tags.length - 1); }
  };

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s.toLowerCase()));

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap gap-1.5 p-2 border rounded-lg bg-background min-h-[42px] cursor-text" onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(i); }} className="hover:bg-destructive/20 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {tags.length < maxTags && (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (inputValue) addTag(inputValue); setTimeout(() => setShowSuggestions(false), 200); }}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="border-0 shadow-none p-0 h-7 min-w-[80px] flex-1 focus-visible:ring-0"
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{tags.length}/{maxTags} tags</p>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
          {filteredSuggestions.map(s => (
            <button key={s} className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent" onClick={() => addTag(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}