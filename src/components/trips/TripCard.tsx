import { Link } from 'react-router-dom';
import { formatVND, formatShortDateVN, TRIP_MODES, TRIP_STATUSES } from '@/lib/constants';
import type { Trip } from '@/types/database';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ArrowRight, MoreVertical, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteTrip } from '@/hooks/useTrips';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const deleteTrip = useDeleteTrip();
  const mode = TRIP_MODES.find(m => m.value === trip.mode);
  const status = TRIP_STATUSES.find(s => s.value === trip.status);

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa chuyến đi này?')) {
      deleteTrip.mutate(trip.id);
    }
  };

  return (
    <Card className="card-hover overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={status?.color === 'success' ? 'default' : 'secondary'} className="text-xs">
                {status?.label}
              </Badge>
              <span className="text-lg">{mode?.icon}</span>
            </div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {trip.title}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/trips/${trip.id}`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          {trip.destination_provinces.length > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">
                {trip.destination_provinces.join(', ')}
              </span>
            </div>
          )}
          
          {trip.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span>
                {formatShortDateVN(trip.start_date)}
                {trip.end_date && ` - ${formatShortDateVN(trip.end_date)}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            <span>{trip.travelers_count} người</span>
          </div>
        </div>

        {trip.total_budget_vnd > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Ngân sách dự kiến</p>
            <p className="font-semibold text-primary">{formatVND(trip.total_budget_vnd)}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="ghost" className="w-full group/btn">
          <Link to={`/trips/${trip.id}`} className="flex items-center justify-center gap-2">
            Xem chi tiết
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
