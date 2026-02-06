import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '@/components/trips/TripCard';
import { CreateTripDialog } from '@/components/trips/CreateTripDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Map, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { TripStatus } from '@/types/database';

export default function TripsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TripsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function TripsContent() {
  const { data: trips, isLoading } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TripStatus | 'all'>('all');

  const filteredTrips = useMemo(() => {
    if (!trips) return [];
    
    return trips.filter(trip => {
      const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination_provinces.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  const tripsByStatus = useMemo(() => ({
    all: trips?.length || 0,
    draft: trips?.filter(t => t.status === 'draft').length || 0,
    planned: trips?.filter(t => t.status === 'planned').length || 0,
    ongoing: trips?.filter(t => t.status === 'ongoing').length || 0,
    completed: trips?.filter(t => t.status === 'completed').length || 0,
  }), [trips]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Chuyến đi của bạn</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi tất cả các chuyến du lịch
          </p>
        </div>
        <CreateTripDialog />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm chuyến đi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as TripStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({tripsByStatus.all})</TabsTrigger>
          <TabsTrigger value="draft">Bản nháp ({tripsByStatus.draft})</TabsTrigger>
          <TabsTrigger value="planned">Đã lên kế hoạch ({tripsByStatus.planned})</TabsTrigger>
          <TabsTrigger value="ongoing">Đang diễn ra ({tripsByStatus.ongoing})</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành ({tripsByStatus.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">
                  {searchQuery ? 'Không tìm thấy chuyến đi' : 'Chưa có chuyến đi nào'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Thử tìm kiếm với từ khóa khác' 
                    : 'Bắt đầu lên kế hoạch cho chuyến phiêu lưu đầu tiên'}
                </p>
                {!searchQuery && <CreateTripDialog />}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
