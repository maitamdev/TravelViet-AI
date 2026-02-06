import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TripCard } from '@/components/trips/TripCard';
import { CreateTripDialog } from '@/components/trips/CreateTripDialog';
import { 
  Map, 
  MessageSquare, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { formatVND } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function DashboardContent() {
  const { profile } = useAuth();
  const { data: trips, isLoading } = useTrips();

  const stats = [
    { 
      label: 'Chuyến đi', 
      value: trips?.length || 0, 
      icon: Map, 
      color: 'text-primary',
      bg: 'bg-primary/10' 
    },
    { 
      label: 'Đang diễn ra', 
      value: trips?.filter(t => t.status === 'ongoing').length || 0, 
      icon: TrendingUp, 
      color: 'text-success',
      bg: 'bg-success/10' 
    },
    { 
      label: 'Tổng ngân sách', 
      value: formatVND(trips?.reduce((sum, t) => sum + Number(t.total_budget_vnd), 0) || 0), 
      icon: Users, 
      color: 'text-secondary',
      bg: 'bg-secondary/10' 
    },
  ];

  const recentTrips = trips?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Xin chào, <span className="text-gradient">{profile?.full_name || 'Bạn'}!</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Sẵn sàng cho chuyến phiêu lưu tiếp theo chưa?
          </p>
        </div>
        <CreateTripDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card-hover group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>AI Planner</CardTitle>
                <CardDescription>Tạo lịch trình thông minh với AI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full group/btn">
              <Link to="/chat" className="flex items-center justify-center gap-2">
                Bắt đầu trò chuyện
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="icon-badge-accent">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>Cộng đồng</CardTitle>
                <CardDescription>Khám phá lịch trình từ cộng đồng</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group/btn">
              <Link to="/community" className="flex items-center justify-center gap-2">
                Khám phá ngay
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chuyến đi gần đây</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/trips" className="flex items-center gap-2">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Chưa có chuyến đi nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu lên kế hoạch cho chuyến phiêu lưu đầu tiên của bạn
              </p>
              <CreateTripDialog />
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
