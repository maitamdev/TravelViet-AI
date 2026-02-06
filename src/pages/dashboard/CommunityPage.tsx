import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Heart, 
  Bookmark, 
  Star,
  Calendar,
  Users,
  ExternalLink
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { PublicItinerary } from '@/types/database';

export default function CommunityPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CommunityContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function CommunityContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');

  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['public-itineraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_itineraries')
        .select(`
          *,
          owner:profiles(full_name, avatar_url),
          trip:trips(destination_provinces, start_date, end_date, travelers_count, mode)
        `)
        .order('likes_count', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredItineraries = useMemo(() => {
    if (!itineraries) return [];
    
    return itineraries.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.trip as any)?.destination_provinces?.some((p: string) => 
          p.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      return matchesSearch;
    });
  }, [itineraries, searchQuery]);

  const sortedItineraries = useMemo(() => {
    const items = [...filteredItineraries];
    
    switch (activeTab) {
      case 'popular':
        return items.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      case 'recent':
        return items.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
      case 'saved':
        return items.sort((a, b) => (b.saves_count || 0) - (a.saves_count || 0));
      default:
        return items;
    }
  }, [filteredItineraries, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Cộng đồng</h1>
        <p className="text-muted-foreground mt-1">
          Khám phá lịch trình du lịch được chia sẻ bởi cộng đồng
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm lịch trình, địa điểm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Phổ biến
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Mới nhất
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Được lưu nhiều
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
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
          ) : sortedItineraries.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedItineraries.map(itinerary => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">
                  {searchQuery ? 'Không tìm thấy lịch trình' : 'Chưa có lịch trình nào'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery 
                    ? 'Thử tìm kiếm với từ khóa khác' 
                    : 'Hãy là người đầu tiên chia sẻ lịch trình du lịch của bạn!'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ItineraryCardProps {
  itinerary: any; // Using any for now due to nested relations
}

function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const trip = itinerary.trip;
  const owner = itinerary.owner;

  return (
    <Card className="card-hover overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {itinerary.title}
            </CardTitle>
            {owner && (
              <p className="text-sm text-muted-foreground mt-1">
                bởi {owner.full_name || 'Ẩn danh'}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {itinerary.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {itinerary.summary}
          </p>
        )}

        {trip?.destination_provinces?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">
              {trip.destination_provinces.join(', ')}
            </span>
          </div>
        )}

        {itinerary.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {itinerary.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {itinerary.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{itinerary.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {itinerary.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              {itinerary.saves_count || 0}
            </span>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to={`/share/${itinerary.trip_id}`} className="flex items-center gap-1">
              Xem
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
