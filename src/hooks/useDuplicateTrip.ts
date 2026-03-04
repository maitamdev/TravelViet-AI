import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export function useDuplicateTrip() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn: async (tripId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (!trip) throw new Error('Trip not found');
      const { data, error } = await supabase.from('trips').insert({
        user_id: user.id, title: trip.title + ' (ban sao)', mode: trip.mode,
        destination_provinces: trip.destination_provinces, travelers_count: trip.travelers_count,
        total_budget_vnd: trip.total_budget_vnd, status: 'draft',
      }).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trips'] }); toast({ title: 'Da tao ban sao!' }); },
  });
}
