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

