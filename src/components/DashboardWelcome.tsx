import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useStats';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, CheckCircle, Wallet } from 'lucide-react';
import { formatVND } from '@/lib/constants';

export function DashboardWelcome() {
  const { data: profile } = useProfile();
  const { data: stats } = useDashboardStats();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chao buoi sang';
    if (hour < 18) return 'Chao buoi chieu';
    return 'Chao buoi toi';
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold'>
          {greeting()}, {profile?.full_name || 'ban'} 👋
        </h1>
        <p className='text-muted-foreground mt-1'>Chuc ban co nhung chuyen du lich tuyet voi!</p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30'>
              <MapPin className='h-5 w-5 text-blue-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{stats?.totalTrips || 0}</p>
              <p className='text-xs text-muted-foreground'>Chuyen di</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
              <CheckCircle className='h-5 w-5 text-green-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{stats?.completedTrips || 0}</p>
              <p className='text-xs text-muted-foreground'>Hoan thanh</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
              <Calendar className='h-5 w-5 text-purple-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{stats?.totalDays || 0}</p>
              <p className='text-xs text-muted-foreground'>Ngay du lich</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30'>
              <Wallet className='h-5 w-5 text-orange-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{formatVND(stats?.totalBudget || 0)}</p>
              <p className='text-xs text-muted-foreground'>Tong ngan sach</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
