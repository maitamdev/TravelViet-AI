import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripMember, TripComment, TripTask } from '@/types/database';


export function useTripMembers(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_members')
        .select('*, profile:profiles(full_name, avatar_url)')
        .eq('trip_id', tripId);
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}

