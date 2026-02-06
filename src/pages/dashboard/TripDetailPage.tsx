import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useTrip, useCreateTripDay, useCreateTripItem, useDeleteTripDay, useDeleteTripItem } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditTripDialog } from '@/components/trips/EditTripDialog';
import { ShareTripDialog } from '@/components/trips/ShareTripDialog';
import { ExportItineraryDialog } from '@/components/trips/ExportItineraryDialog';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Plus,
  Clock,
  Trash2,
  Sparkles,
  DollarSign,
  Map,
  Pencil,
  Share2,
  Download
} from 'lucide-react';
import { formatVND, formatShortDateVN, TRIP_MODES, TRIP_STATUSES, ITEM_TYPES } from '@/lib/constants';
import { TripMap } from '@/components/maps/TripMap';
import { ItemsMap } from '@/components/maps/ItemsMap';
import type { TripDayWithItems, TripItem } from '@/types/database';

export default function TripDetailPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TripDetailContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function TripDetailContent() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading, error } = useTrip(tripId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const createDay = useCreateTripDay();
  const deleteDay = useDeleteTripDay();
  const createItem = useCreateTripItem();
  const deleteItem = useDeleteTripItem();

  const handleAddDay = async () => {
    if (!tripId) return;
    const nextIndex = (trip?.days?.length || 0) + 1;
    await createDay.mutateAsync({
      trip_id: tripId,
      day_index: nextIndex,
    });
  };

  const handleDeleteDay = async (dayId: string) => {
    if (confirm('Xóa ngày này sẽ xóa tất cả hoạt động trong ngày. Tiếp tục?')) {
      await deleteDay.mutateAsync(dayId);
    }
  };

  const handleAddItem = async (dayId: string) => {
    await createItem.mutateAsync({
      trip_day_id: dayId,
      item_type: 'visit',
      title: 'Hoạt động mới',
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem.mutateAsync(itemId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy chuyến đi</h2>
        <p className="text-muted-foreground mb-4">Chuyến đi có thể đã bị xóa hoặc bạn không có quyền truy cập</p>
        <Button asChild>
          <Link to="/trips">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const mode = TRIP_MODES.find(m => m.value === trip.mode);
  const status = TRIP_STATUSES.find(s => s.value === trip.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/trips">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{trip.title}</h1>
            <Badge variant={status?.color === 'success' ? 'default' : 'secondary'}>
              {status?.label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {mode?.icon} {mode?.label}
            </span>
            {trip.destination_provinces.length > 0 && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
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
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowEditDialog(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowShareDialog(true)}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button asChild className="btn-accent">
            <Link to={`/chat?tripId=${trip.id}`}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Lên kế hoạch
            </Link>
          </Button>
        </div>
      </div>

      {/* Budget Summary */}
      {trip.total_budget_vnd > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngân sách dự kiến</p>
                  <p className="text-xl font-bold text-primary">{formatVND(trip.total_budget_vnd)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Section */}
      {trip.destination_provinces && trip.destination_provinces.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Map className="h-5 w-5" />
              Bản đồ điểm đến
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="destinations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="destinations">Điểm đến</TabsTrigger>
                <TabsTrigger value="activities">Hoạt động</TabsTrigger>
              </TabsList>
              <TabsContent value="destinations">
                <TripMap 
                  provinces={trip.destination_provinces} 
                  className="h-[400px]" 
                />
              </TabsContent>
              <TabsContent value="activities">
                <ItemsMap 
                  items={trip.days?.flatMap((day: TripDayWithItems) => day.items || []) || []} 
                  className="h-[400px]" 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lịch trình</h2>
          <Button onClick={handleAddDay} disabled={createDay.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm ngày
          </Button>
        </div>

        {trip.days && trip.days.length > 0 ? (
          <div className="space-y-4">
            {trip.days.map((day: TripDayWithItems) => (
              <DayCard
                key={day.id}
                day={day}
                onAddItem={() => handleAddItem(day.id)}
                onDeleteDay={() => handleDeleteDay(day.id)}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium mb-2">Chưa có ngày nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thêm ngày để bắt đầu lên lịch trình hoặc để AI tự động tạo
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={handleAddDay} disabled={createDay.isPending}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm ngày thủ công
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/chat?tripId=${trip.id}`}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Tạo lịch trình
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Dialogs */}
      <EditTripDialog 
        trip={trip} 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
      />
      <ShareTripDialog 
        trip={trip} 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog} 
      />
      <ExportItineraryDialog 
        trip={trip} 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
      />
    </div>
  );
}

interface DayCardProps {
  day: TripDayWithItems;
  onAddItem: () => void;
  onDeleteDay: () => void;
  onDeleteItem: (itemId: string) => void;
}

function DayCard({ day, onAddItem, onDeleteDay, onDeleteItem }: DayCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
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
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onAddItem}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDeleteDay}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {day.summary && (
          <p className="text-sm text-muted-foreground">{day.summary}</p>
        )}
      </CardHeader>
      <CardContent>
        {day.items && day.items.length > 0 ? (
          <div className="space-y-3">
            {day.items.map((item: TripItem) => (
              <ItemCard key={item.id} item={item} onDelete={() => onDeleteItem(item.id)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có hoạt động. Nhấn + để thêm.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface ItemCardProps {
  item: TripItem;
  onDelete: () => void;
}

function ItemCard({ item, onDelete }: ItemCardProps) {
  const itemType = ITEM_TYPES.find(t => t.value === item.item_type);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 group">
      <span className="text-xl">{itemType?.icon || '📌'}</span>
      <div className="flex-1 min-w-0">
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
      <Button
        size="icon"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
