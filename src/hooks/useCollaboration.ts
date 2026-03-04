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


export function useAddTripMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tripId, userId, role = 'member' }: { tripId: string; userId: string; role?: string }) => {
      const { data, error } = await supabase
        .from('trip_members')
        .insert({ trip_id: tripId, user_id: userId, role })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] });
      toast({ title: 'Da them thanh vien!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}


export function useRemoveTripMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, tripId }: { memberId: string; tripId: string }) => {
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] });
      toast({ title: 'Da xoa thanh vien' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}


export function useTripComments(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-comments', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_comments')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}

