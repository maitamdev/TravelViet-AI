import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Trip, 
  TripWithDetails, 
  TripDay, 
  TripItem,
  CreateTripInput, 
  UpdateTripInput,
  CreateTripDayInput,
  CreateTripItemInput,
  TripDayWithItems,
} from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Fetch all trips for current user
export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async (): Promise<Trip[]> => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Trip[];
    },
  });
}

// Fetch single trip with details
export function useTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async (): Promise<TripWithDetails | null> => {
      if (!tripId) return null;

      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Fetch days with items
      const { data: days, error: daysError } = await supabase
        .from('trip_days')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_index', { ascending: true });

      if (daysError) throw daysError;

      // Fetch items for all days (skip if no days exist)
      const dayIds = days.map(d => d.id);
      let items: TripItem[] = [];

      if (dayIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('trip_items')
          .select('*')
          .in('trip_day_id', dayIds)
          .order('sort_order', { ascending: true });

        if (itemsError) throw itemsError;
        items = (itemsData as TripItem[]) || [];
      }

      // Map items to days
      const daysWithItems: TripDayWithItems[] = (days as TripDay[]).map(day => ({
        ...day,
        items: (items as TripItem[]).filter(item => item.trip_day_id === day.id),
      }));

      // Fetch members
      const { data: members } = await supabase
        .from('trip_members')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('trip_id', tripId);

      return {
        ...trip,
        days: daysWithItems,
        members: members || [],
      } as TripWithDetails;
    },
    enabled: !!tripId,
  });
}

// Create trip mutation
export function useCreateTrip() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateTripInput): Promise<Trip> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('trips')
        .insert({
          ...input,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Trip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'Tạo chuyến đi thành công!',
        description: `Chuyến "${data.title}" đã được tạo.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi tạo chuyến đi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Update trip mutation
export function useUpdateTrip() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tripId, updates }: { tripId: string; updates: UpdateTripInput }): Promise<Trip> => {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', tripId)
        .select()
        .single();

      if (error) throw error;
      return data as Trip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', data.id] });
      toast({
        title: 'Cập nhật thành công!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi cập nhật',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Delete trip mutation
export function useDeleteTrip() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tripId: string): Promise<void> => {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'Đã xóa chuyến đi',
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi xóa chuyến đi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Create trip day mutation
export function useCreateTripDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTripDayInput): Promise<TripDay> => {
      const { data, error } = await supabase
        .from('trip_days')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as TripDay;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.trip_id] });
    },
  });
}

// Create trip item mutation
export function useCreateTripItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTripItemInput): Promise<TripItem> => {
      const { data, error } = await supabase
        .from('trip_items')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as TripItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip'] });
    },
  });
}

// Update trip item mutation
export function useUpdateTripItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: Partial<CreateTripItemInput> }): Promise<TripItem> => {
      const { data, error } = await supabase
        .from('trip_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data as TripItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip'] });
    },
  });
}

// Delete trip item mutation
export function useDeleteTripItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      const { error } = await supabase
        .from('trip_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip'] });
    },
  });
}

// Delete trip day mutation
export function useDeleteTripDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dayId: string): Promise<void> => {
      const { error } = await supabase
        .from('trip_days')
        .delete()
        .eq('id', dayId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip'] });
    },
  });
}
