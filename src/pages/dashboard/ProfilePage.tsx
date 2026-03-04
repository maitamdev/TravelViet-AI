import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Map, Calendar, MapPin, Settings, Trophy, Plane } from 'lucide-react';
import { formatVND } from '@/lib/constants';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ProfileContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function ProfileContent() {
  const { profile } = useAuth();
  const { data: trips } = useTrips();

  const completedTrips = trips?.filter(t => t.status === 'completed').length || 0;
  const totalTrips = trips?.length || 0;
  const totalProvinces = new Set(trips?.flatMap(t => t.destination_provinces) || []).size;
  const totalBudget = trips?.reduce((sum, t) => sum + Number(t.total_budget_vnd), 0) || 0;

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      {/* Profile Header */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center text-center'>
            <Avatar className='h-24 w-24 mb-4'>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className='text-3xl bg-primary text-primary-foreground'>
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <h1 className='text-2xl font-bold'>{profile?.full_name || 'Nguoi dung'}</h1>
            <p className='text-muted-foreground flex items-center gap-1 mt-1'>
              <MapPin className='h-4 w-4' />
              {profile?.home_city || 'Viet Nam'}
            </p>
            {profile?.travel_styles && profile.travel_styles.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3 justify-center'>
                {profile.travel_styles.map(style => (
                  <Badge key={style} variant='secondary'>{style}</Badge>
                ))}
              </div>
            )}
            <Button asChild variant='outline' size='sm' className='mt-4'>
              <Link to='/settings'>
                <Settings className='h-4 w-4 mr-2' /> Chinh sua ho so
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          { label: 'Chuyen di', value: totalTrips, icon: Map },
          { label: 'Hoan thanh', value: completedTrips, icon: Trophy },
          { label: 'Tinh thanh', value: totalProvinces, icon: MapPin },
          { label: 'Tong ngan sach', value: formatVND(totalBudget), icon: Plane },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className='p-4 text-center'>
              <stat.icon className='h-6 w-6 mx-auto mb-2 text-primary' />
              <p className='text-2xl font-bold'>{stat.value}</p>
              <p className='text-xs text-muted-foreground'>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent completed trips */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Chuyen di da hoan thanh</CardTitle>
        </CardHeader>
        <CardContent>
          {trips?.filter(t => t.status === 'completed').length ? (
            <div className='space-y-3'>
              {trips.filter(t => t.status === 'completed').slice(0, 5).map(trip => (
                <Link key={trip.id} to={'/trips/' + trip.id} className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                  <div className='p-2 rounded-lg bg-green-500/10'>
                    <Trophy className='h-4 w-4 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{trip.title}</p>
                    <p className='text-xs text-muted-foreground'>{trip.destination_provinces.join(', ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground text-center py-6'>Chua hoan thanh chuyen di nao</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

