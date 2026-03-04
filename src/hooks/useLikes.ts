import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useUserLikedIds() {
  return useQuery({
    queryKey: ['user-liked-ids'],
    queryFn: async (): Promise<string[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('itinerary_reviews')
        .select('public_itinerary_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(r => r.public_itinerary_id);
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ itineraryId, isLiked }: { itineraryId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (isLiked) {
        await supabase.from('itinerary_reviews').delete()
          .eq('public_itinerary_id', itineraryId).eq('user_id', user.id);
      } else {
        await supabase.from('itinerary_reviews').insert({
          public_itinerary_id: itineraryId, user_id: user.id, rating: 5
        });
      }
    },
    onSuccess: (_, { isLiked }) => {
      queryClient.invalidateQueries({ queryKey: ['user-liked-ids'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      toast({ title: isLiked ? 'Da bo thich' : 'Da thich!' });
    },
  });
}
