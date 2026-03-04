import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='flex items-center gap-1 text-sm text-muted-foreground'>
      <Link to='/' className='hover:text-foreground transition-colors'>
        <Home className='h-4 w-4' />
      </Link>
      {items.map((item, i) => (
        <span key={i} className='flex items-center gap-1'>
          <ChevronRight className='h-3 w-3' />
          {item.href ? (
            <Link to={item.href} className='hover:text-foreground transition-colors'>{item.label}</Link>
          ) : (
            <span className='text-foreground font-medium'>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
