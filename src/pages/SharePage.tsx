import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Plane,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react';
import { formatVND, formatShortDateVN, TRIP_MODES, ITEM_TYPES } from '@/lib/constants';
import type { Trip, TripDay, TripItem } from '@/types/database';

interface SharedDayWithItems extends TripDay {
  items: TripItem[];
}

export default function SharePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['shared-trip', slug],
    queryFn: async () => {
      // First try to find by share_slug, then by trip_id (for public itineraries)
      const { data: slugTrip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('share_slug', slug)
        .single();

      let trip = slugTrip;

      if (tripError) {
        // Try finding by trip_id through public_itineraries
        const { data: itinerary } = await supabase
          .from('public_itineraries')
          .select(`
            *,
            owner:profiles(full_name, avatar_url),
            trip:trips(*)
          `)
          .eq('trip_id', slug)
          .single();

        if (itinerary && itinerary.trip) {
          trip = itinerary.trip as Trip;
        } else {
          throw new Error('Trip not found');
        }
      }

      // Fetch days
      const { data: days } = await supabase
        .from('trip_days')
        .select('*')
        .eq('trip_id', trip.id)
        .order('day_index', { ascending: true });

      // Fetch items
      const dayIds = (days || []).map(d => d.id);
      const { data: items } = await supabase
        .from('trip_items')
        .select('*')
        .in('trip_day_id', dayIds.length > 0 ? dayIds : ['__none__'])
        .order('sort_order', { ascending: true });

      // Map items to days
      const daysWithItems = (days || []).map(day => ({
        ...day,
        items: (items || []).filter(item => item.trip_day_id === day.id),
      }));

      return { trip, days: daysWithItems };
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy lịch trình</h2>
            <p className="text-muted-foreground mb-6">
              Lịch trình này có thể đã bị xóa hoặc không được chia sẻ công khai
            </p>
            <Button asChild>
              <Link to="/">Về trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { trip, days } = data;
  const mode = TRIP_MODES.find(m => m.value === trip.mode);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold">TravelViet</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Trip Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              {mode?.icon} {mode?.label}
            </span>
            {trip.destination_provinces?.length > 0 && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                {trip.destination_provinces.join(', ')}
              </span>
            )}
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatShortDateVN(trip.start_date)}
                {trip.end_date && ` - ${formatShortDateVN(trip.end_date)}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {trip.travelers_count} người
            </span>
          </div>

          {trip.total_budget_vnd > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân sách dự kiến</p>
                    <p className="text-xl font-bold text-primary">{formatVND(trip.total_budget_vnd)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Days */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Lịch trình chi tiết</h2>

          {days && days.length > 0 ? (
            <div className="space-y-6">
              {days.map((day: SharedDayWithItems) => (
                <Card key={day.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {day.day_index}
                      </span>
                      Ngày {day.day_index}
                      {day.date && (
                        <span className="text-sm font-normal text-muted-foreground">
                          ({formatShortDateVN(day.date)})
                        </span>
                      )}
                    </CardTitle>
                    {day.summary && (
                      <p className="text-sm text-muted-foreground">{day.summary}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {day.items && day.items.length > 0 ? (
                      <div className="space-y-3">
                        {day.items.map((item: TripItem) => {
                          const itemType = ITEM_TYPES.find(t => t.value === item.item_type);
                          return (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <span className="text-xl">{itemType?.icon || '📌'}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{item.title}</h4>
                                  {item.is_hidden_gem && (
                                    <Badge variant="secondary" className="text-xs">💎 Hidden Gem</Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  {item.start_time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.start_time}
                                      {item.end_time && ` - ${item.end_time}`}
                                    </span>
                                  )}
                                  {item.location_name && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {item.location_name}
                                    </span>
                                  )}
                                  {item.estimated_cost_vnd > 0 && (
                                    <span className="text-primary font-medium">
                                      {formatVND(item.estimated_cost_vnd)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Chưa có hoạt động nào trong ngày này
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Chưa có lịch trình</h3>
                <p className="text-sm text-muted-foreground">
                  Người tạo chưa thêm lịch trình chi tiết cho chuyến đi này
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2">Thích lịch trình này?</h3>
              <p className="text-muted-foreground mb-4">
                Tạo tài khoản miễn phí để lưu và tùy chỉnh lịch trình cho riêng bạn
              </p>
              <Button asChild className="btn-hero">
                <Link to="/register">Bắt đầu miễn phí</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
