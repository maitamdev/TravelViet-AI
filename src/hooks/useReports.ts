import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCreateReport() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ targetType, targetId, reason }: {
      targetType: 'user' | 'itinerary' | 'comment'; targetId: string; reason: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('reports')
        .insert({ reporter_id: user.id, target_type: targetType, target_id: targetId, reason })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Da gui bao cao', description: 'Chung toi se xem xet bao cao cua ban.' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}
