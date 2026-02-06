import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VIETNAM_PROVINCES, TRIP_MODES } from '@/lib/constants';
import { useCreateTrip } from '@/hooks/useTrips';
import type { TripMode } from '@/types/database';

const createTripSchema = z.object({
  title: z.string().min(3, 'Tên chuyến đi ít nhất 3 ký tự'),
  mode: z.enum(['solo', 'couple', 'family', 'friends']),
  travelers_count: z.number().min(1).max(50),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  total_budget_vnd: z.number().min(0),
});

type CreateTripFormData = z.infer<typeof createTripSchema>;

export function CreateTripDialog() {
  const [open, setOpen] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const form = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: '',
      mode: 'solo',
      travelers_count: 1,
      total_budget_vnd: 0,
    },
  });

  const handleSubmit = async (data: CreateTripFormData) => {
    try {
      const trip = await createTrip.mutateAsync({
        title: data.title,
        mode: data.mode,
        travelers_count: data.travelers_count,
        total_budget_vnd: data.total_budget_vnd,
        start_date: data.start_date,
        end_date: data.end_date,
        destination_provinces: selectedProvinces,
      });
      setOpen(false);
      form.reset();
      setSelectedProvinces([]);
      // Navigate to chat with tripId and auto-plan flag
      navigate(`/chat?tripId=${trip.id}&autoplan=true`);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces(prev =>
      prev.includes(province)
        ? prev.filter(p => p !== province)
        : [...prev, province]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-hero">
          <Plus className="h-4 w-4 mr-2" />
          Tạo chuyến đi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo chuyến đi mới</DialogTitle>
          <DialogDescription>
            Điền thông tin cơ bản để bắt đầu lên kế hoạch
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tên chuyến đi *</Label>
            <Input
              id="title"
              placeholder="VD: Khám phá Đà Nẵng - Hội An"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Điểm đến</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
              {VIETNAM_PROVINCES.map(province => (
                <Badge
                  key={province}
                  variant={selectedProvinces.includes(province) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => toggleProvince(province)}
                >
                  {province}
                  {selectedProvinces.includes(province) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            {selectedProvinces.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {selectedProvinces.join(', ')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Kiểu du lịch</Label>
              <Select
                value={form.watch('mode')}
                onValueChange={(value) => form.setValue('mode', value as TripMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIP_MODES.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.icon} {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelers_count">Số người</Label>
              <Input
                id="travelers_count"
                type="number"
                min={1}
                max={50}
                {...form.register('travelers_count', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Ngày bắt đầu</Label>
              <Input
                id="start_date"
                type="date"
                {...form.register('start_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Ngày kết thúc</Label>
              <Input
                id="end_date"
                type="date"
                {...form.register('end_date')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_budget_vnd">Ngân sách dự kiến (VNĐ)</Label>
            <Input
              id="total_budget_vnd"
              type="number"
              min={0}
              step={100000}
              placeholder="5000000"
              {...form.register('total_budget_vnd', { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" className="btn-hero" disabled={createTrip.isPending}>
              {createTrip.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Tạo chuyến đi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
