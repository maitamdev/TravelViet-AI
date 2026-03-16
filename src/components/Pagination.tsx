import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, showFirstLast = true, maxVisible = 5 }: PaginationProps) {
  if (totalPages <= 1) return null;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center gap-1" aria-label="Phân trang">
      {showFirstLast && (
        <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="Trang đầu">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Trang trước">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {start > 1 && <span className="px-2 text-muted-foreground">...</span>}
      {pages.map(page => (
        <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="icon" onClick={() => onPageChange(page)} aria-current={page === currentPage ? 'page' : undefined} className="w-9 h-9">
          {page}
        </Button>
      ))}
      {end < totalPages && <span className="px-2 text-muted-foreground">...</span>}
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Trang tiếp">
        <ChevronRight className="h-4 w-4" />
      </Button>
      {showFirstLast && (
        <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Trang cuối">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}