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

