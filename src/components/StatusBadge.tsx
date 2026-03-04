import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: 'Ban nhap', className: '' },
  planned: { label: 'Da len ke hoach', className: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Dang dien ra', className: 'bg-green-100 text-green-700' },
  completed: { label: 'Hoan thanh', className: 'bg-purple-100 text-purple-700' },
  todo: { label: 'Chua lam', className: '' },
  doing: { label: 'Dang lam', className: 'bg-yellow-100 text-yellow-700' },
  done: { label: 'Xong', className: 'bg-green-100 text-green-700' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  return <Badge variant='outline' className={cn(config.className, className)}>{config.label}</Badge>;
}
