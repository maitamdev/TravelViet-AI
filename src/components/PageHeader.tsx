interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold'>{title}</h1>
        {description && <p className='text-muted-foreground mt-1'>{description}</p>}
      </div>
      {children}
    </div>
  );
}
