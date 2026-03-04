import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalTrips: 0, completedTrips: 0, totalDays: 0, totalBudget: 0 };
      const { data: trips } = await supabase.from('trips').select('id, status, total_budget_vnd').eq('user_id', user.id);
      const totalTrips = trips?.length || 0;
      const completedTrips = trips?.filter(t => t.status === 'completed').length || 0;
      const totalBudget = trips?.reduce((s, t) => s + (t.total_budget_vnd || 0), 0) || 0;
      const { count } = await supabase.from('trip_days').select('*', { count: 'exact', head: true })
        .in('trip_id', trips?.map(t => t.id) || []);
      return { totalTrips, completedTrips, totalDays: count || 0, totalBudget };
    },
  });
}
