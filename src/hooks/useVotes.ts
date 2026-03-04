import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTripVotes(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-votes', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase.from('trip_votes').select('*').eq('trip_id', tripId);
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}

export function useAddVote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ tripId, targetType, targetId, voteValue }: {
      tripId: string; targetType: string; targetId: string; voteValue: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('trip_votes')
        .upsert({ trip_id: tripId, target_type: targetType, target_id: targetId, user_id: user.id, vote_value: voteValue },
          { onConflict: 'trip_id,target_type,target_id,user_id' })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-votes', tripId] });
      toast({ title: 'Da binh chon!' });
    },
  });
}

export function useDeleteVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ voteId, tripId }: { voteId: string; tripId: string }) => {
      const { error } = await supabase.from('trip_votes').delete().eq('id', voteId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-votes', tripId] });
    },
  });
}
