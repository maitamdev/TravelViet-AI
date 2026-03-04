import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlanVersions(tripId: string | undefined) {
  return useQuery({
    queryKey: ['plan-versions', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase.from('ai_plan_versions').select('*')
        .eq('trip_id', tripId).order('version_no', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}

export function useSavePlanVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tripId, planJson, reason = 'initial' }: {
      tripId: string; planJson: any; reason?: string;
    }) => {
      const { data: existing } = await supabase.from('ai_plan_versions')
        .select('version_no').eq('trip_id', tripId)
        .order('version_no', { ascending: false }).limit(1);
      const nextVersion = (existing?.[0]?.version_no || 0) + 1;
      const { data, error } = await supabase.from('ai_plan_versions')
        .insert({ trip_id: tripId, version_no: nextVersion, reason, plan_json: planJson })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['plan-versions', tripId] });
    },
  });
}
