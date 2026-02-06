import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Image, Loader2, Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { formatVND, formatShortDateVN, TRIP_MODES, ITEM_TYPES } from '@/lib/constants';
import type { TripWithDetails, TripDayWithItems, TripItem } from '@/types/database';

interface ExportItineraryDialogProps {
  trip: TripWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportItineraryDialog({ trip, open, onOpenChange }: ExportItineraryDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const mode = TRIP_MODES.find(m => m.value === trip.mode);

  const handleExportImage = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `${trip.title.replace(/\s+/g, '_')}_lichTrinh.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Đã xuất hình ảnh!',
        description: 'Lịch trình đã được lưu thành file ảnh.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Lỗi xuất ảnh',
        description: 'Không thể xuất lịch trình. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Xuất lịch trình
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={handleExportImage} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Image className="h-4 w-4 mr-2" />
              )}
              Tải xuống ảnh PNG
            </Button>
          </div>

          {/* Exportable Content */}
          <div 
            ref={contentRef}
            className="bg-white text-black p-6 rounded-lg border"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-primary">
              <h1 className="text-2xl font-bold text-primary mb-2">{trip.title}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
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
              {trip.total_budget_vnd > 0 && (
                <div className="mt-2 text-lg font-semibold text-primary flex items-center justify-center gap-1">
                  <DollarSign className="h-5 w-5" />
                  Ngân sách: {formatVND(trip.total_budget_vnd)}
                </div>
              )}
            </div>

            {/* Days */}
            {trip.days && trip.days.length > 0 ? (
              <div className="space-y-6">
                {trip.days.map((day: TripDayWithItems) => (
                  <div key={day.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                        {day.day_index}
                      </span>
                      <h3 className="font-bold text-lg">
                        Ngày {day.day_index}
                        {day.date && (
                          <span className="ml-2 font-normal text-gray-500">
                            ({formatShortDateVN(day.date)})
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    {day.items && day.items.length > 0 ? (
                      <div className="space-y-2">
                        {day.items.map((item: TripItem) => {
                          const itemType = ITEM_TYPES.find(t => t.value === item.item_type);
                          return (
                            <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                              <span className="text-lg">{itemType?.icon || '📌'}</span>
                              <div className="flex-1">
                                <div className="font-medium">{item.title}</div>
                                {item.description && (
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
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
                                    <span className="font-medium text-primary">
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
                      <p className="text-gray-500 text-sm">Chưa có hoạt động</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Chưa có lịch trình. Hãy sử dụng AI để tạo lịch trình trước khi xuất.
              </p>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t text-center text-xs text-gray-400">
              Tạo bởi TravelViet AI • {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
