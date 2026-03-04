import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = 'Quay lai' }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <Button variant='ghost' size='sm' onClick={() => to ? navigate(to) : navigate(-1)}>
      <ArrowLeft className='h-4 w-4 mr-2' /> {label}
    </Button>
  );
}
