import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateTrip } from '@/hooks/useTrips';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TRIP_MODES, VIETNAM_PROVINCES } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import type { Trip } from '@/types/database';

const editTripSchema = z.object({
  title: z.string().min(1, 'Tên chuyến đi không được để trống'),
  destination_provinces: z.array(z.string()).min(1, 'Chọn ít nhất một điểm đến'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  mode: z.string(),
  travelers_count: z.coerce.number().min(1).max(50),
  total_budget_vnd: z.coerce.number().min(0),
});

type EditTripFormData = z.infer<typeof editTripSchema>;

interface EditTripDialogProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTripDialog({ trip, open, onOpenChange }: EditTripDialogProps) {
  const updateTrip = useUpdateTrip();
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(trip.destination_provinces || []);

  const form = useForm<EditTripFormData>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {
      title: trip.title,
      destination_provinces: trip.destination_provinces || [],
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      mode: trip.mode || 'solo',
      travelers_count: trip.travelers_count || 1,
      total_budget_vnd: trip.total_budget_vnd || 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: trip.title,
        destination_provinces: trip.destination_provinces || [],
        start_date: trip.start_date || '',
        end_date: trip.end_date || '',
        mode: trip.mode || 'solo',
        travelers_count: trip.travelers_count || 1,
        total_budget_vnd: trip.total_budget_vnd || 0,
      });
      setSelectedProvinces(trip.destination_provinces || []);
    }
  }, [open, trip, form]);

  const onSubmit = async (data: EditTripFormData) => {
    await updateTrip.mutateAsync({
      tripId: trip.id,
      updates: {
        title: data.title,
        start_date: data.start_date,
        end_date: data.end_date,
        mode: data.mode as 'solo' | 'couple' | 'family' | 'friends',
        travelers_count: data.travelers_count,
        total_budget_vnd: data.total_budget_vnd,
        destination_provinces: selectedProvinces,
      },
    });
    onOpenChange(false);
  };

  const handleProvinceToggle = (province: string) => {
    const updated = selectedProvinces.includes(province)
      ? selectedProvinces.filter(p => p !== province)
      : [...selectedProvinces, province];
    setSelectedProvinces(updated);
    form.setValue('destination_provinces', updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chuyến đi</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chuyến đi</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Du lịch Đà Nẵng hè 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Điểm đến</FormLabel>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                {VIETNAM_PROVINCES.map(province => (
                  <Button
                    key={province}
                    type="button"
                    variant={selectedProvinces.includes(province) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleProvinceToggle(province)}
                  >
                    {province}
                  </Button>
                ))}
              </div>
              {selectedProvinces.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {selectedProvinces.join(', ')}
                </p>
              )}
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày đi</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày về</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình thức</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRIP_MODES.map(mode => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.icon} {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="travelers_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số người</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={50} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="total_budget_vnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngân sách (VNĐ)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={100000} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={updateTrip.isPending}>
                {updateTrip.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
