import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='max-w-md w-full'>
            <CardContent className='pt-6 text-center space-y-4'>
              <AlertTriangle className='h-12 w-12 mx-auto text-destructive' />
              <h2 className='text-xl font-semibold'>Da xay ra loi</h2>
              <p className='text-sm text-muted-foreground'>{this.state.error?.message || 'Loi khong xac dinh'}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className='h-4 w-4 mr-2' /> Tai lai trang
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
