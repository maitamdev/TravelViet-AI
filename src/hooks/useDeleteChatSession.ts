import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast({ title: 'Da xoa cuoc tro chuyen' });
    },
    onError: (error) => {
      toast({ title: 'Loi xoa', description: error.message, variant: 'destructive' });
    },
  });
}
