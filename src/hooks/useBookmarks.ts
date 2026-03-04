import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ItineraryBookmark } from '@/types/database';

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itinerary_bookmarks')
        .select('*, public_itinerary:public_itineraries(*, owner:profiles(full_name, avatar_url), trip:trips(destination_provinces, start_date, end_date, travelers_count, mode))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}


export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ itineraryId, isBookmarked }: { itineraryId: string; isBookmarked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isBookmarked) {
        const { error } = await supabase
          .from('itinerary_bookmarks')
          .delete()
          .eq('public_itinerary_id', itineraryId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('itinerary_bookmarks')
          .insert({ public_itinerary_id: itineraryId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isBookmarked }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      toast({ title: isBookmarked ? 'Da bo luu' : 'Da luu lich trinh!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}

