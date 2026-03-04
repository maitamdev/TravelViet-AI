import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Sparkles, MapPin, Check } from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: 'calendar' | 'sparkles' | 'mappin';
  read: boolean;
  time: string;
}

export function NotificationDropdown() {
  const { data: trips } = useTrips();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo((): Notification[] => {
    const notifs: Notification[] = [];

    if (trips) {
      // Upcoming trips
      trips.forEach(trip => {
        if (trip.start_date) {
          const start = new Date(trip.start_date);
          const now = new Date();
          const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 7) {
            notifs.push({
              id: 'upcoming-' + trip.id,
              title: 'Chuyen di sap toi!',
              message: trip.title + ' bat dau trong ' + diffDays + ' ngay',
              icon: 'calendar',
              read: readIds.has('upcoming-' + trip.id),
              time: diffDays + ' ngay nua',
            });
          }
        }
        // Draft trips reminder
        if (trip.status === 'draft') {
          notifs.push({
            id: 'draft-' + trip.id,
            title: 'Hoan thanh ke hoach',
            message: trip.title + ' van con la ban nhap',
            icon: 'sparkles',
            read: readIds.has('draft-' + trip.id),
            time: 'Ban nhap',
          });
        }
      });

      // Welcome notification
      notifs.push({
        id: 'welcome',
        title: 'Chao mung den TravelViet!',
        message: 'Bat dau len ke hoach chuyen di dau tien cua ban',
        icon: 'mappin',
        read: readIds.has('welcome'),
        time: 'Moi',
      });
    }

    return notifs;
  }, [trips, readIds]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'calendar': return <Calendar className='h-4 w-4 text-blue-500' />;
      case 'sparkles': return <Sparkles className='h-4 w-4 text-yellow-500' />;
      case 'mappin': return <MapPin className='h-4 w-4 text-green-500' />;
      default: return <Bell className='h-4 w-4' />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>Thong bao</span>
          {unreadCount > 0 && (
            <Button variant='ghost' size='sm' className='text-xs h-6' onClick={markAllRead}>
              <Check className='h-3 w-3 mr-1' /> Doc tat ca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.slice(0, 8).map(notif => (
            <DropdownMenuItem
              key={notif.id}
              className={'flex gap-3 p-3 cursor-pointer ' + (!notif.read ? 'bg-primary/5' : '')}
              onClick={() => markAsRead(notif.id)}
            >
              <div className='flex-shrink-0 mt-0.5'>{getIcon(notif.icon)}</div>
              <div className='flex-1 min-w-0'>
                <p className={'text-sm ' + (!notif.read ? 'font-semibold' : 'font-medium')}>{notif.title}</p>
                <p className='text-xs text-muted-foreground truncate'>{notif.message}</p>
                <p className='text-xs text-muted-foreground mt-1'>{notif.time}</p>
              </div>
              {!notif.read && <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1' />}
            </DropdownMenuItem>
          ))
        ) : (
          <div className='p-4 text-center text-sm text-muted-foreground'>
            Khong co thong bao moi
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

