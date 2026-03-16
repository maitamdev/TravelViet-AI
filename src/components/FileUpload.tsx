import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileIcon, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/string-utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export function FileUpload({ onFileSelect, accept = 'image/*', maxSizeMB = 5, label = 'Tải ảnh lên', className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) { setError(`Kích thước file tối đa ${maxSizeMB}MB`); return; }
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
  const handleClear = () => { setPreview(null); setFileName(null); setError(null); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn('border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors', dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50')}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
            <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">Kéo thả hoặc click để chọn (max {maxSizeMB}MB)</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      </div>
      {fileName && !preview && <p className="text-xs text-muted-foreground flex items-center gap-1"><FileIcon className="h-3 w-3" />{fileName}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}