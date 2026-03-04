import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripCost, CostCategory } from '@/types/database';

export interface CreateTripCostInput {
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note?: string;
}

export function useTripCosts(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-costs', tripId],
    queryFn: async (): Promise<TripCost[]> => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_costs')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as TripCost[];
    },
    enabled: !!tripId,
  });
}


export function useAddTripCost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateTripCostInput): Promise<TripCost> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('trip_costs')
        .insert({
          ...input,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripCost;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip-costs', variables.trip_id] });
      toast({ title: 'Da them chi phi!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}


export function useDeleteTripCost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ costId, tripId }: { costId: string; tripId: string }): Promise<void> => {
      const { error } = await supabase
        .from('trip_costs')
        .delete()
        .eq('id', costId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip-costs', variables.tripId] });
      toast({ title: 'Da xoa chi phi' });
    },
    onError: (error) => {
      toast({ title: 'Loi xoa chi phi', description: error.message, variant: 'destructive' });
    },
  });
}

