import { LoadingSpinner } from './LoadingSpinner';

export function LoadingPage({ text = 'Dang tai...' }: { text?: string }) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoadingSpinner size='lg' text={text} />
    </div>
  );
}
