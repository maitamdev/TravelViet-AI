import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, ChatMessage } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Fetch chat sessions for current user
export function useChatSessions(tripId?: string) {
  return useQuery({
    queryKey: ['chat-sessions', tripId],
    queryFn: async (): Promise<ChatSession[]> => {
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (tripId) {
        query = query.eq('trip_id', tripId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ChatSession[];
    },
  });
}

// Fetch messages for a session
export function useChatMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!sessionId) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!sessionId,
  });
}

// Create chat session
export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, title }: { tripId?: string; title?: string }): Promise<ChatSession> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          trip_id: tripId || null,
          title: title || 'Cuộc trò chuyện mới',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChatSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });
}

// Add message to session
export function useAddChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      role, 
      content, 
      metadata = {} 
    }: { 
      sessionId: string; 
      role: 'user' | 'assistant' | 'system'; 
      content: string;
      metadata?: Record<string, unknown>;
    }): Promise<ChatMessage> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          role,
          content,
          metadata: metadata as any,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update session's updated_at
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      return data as ChatMessage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });
}

// Streaming chat hook for AI responses
export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const { toast } = useToast();
  const addMessage = useAddChatMessage();

  const sendMessage = useCallback(async ({
    sessionId,
    messages,
    tripContext,
    onComplete,
  }: {
    sessionId: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    tripContext?: {
      tripId: string;
      destination: string[];
      startDate?: string;
      endDate?: string;
      mode: string;
      budget: number;
    };
    onComplete?: (fullResponse: string) => void;
  }) => {
    setIsStreaming(true);
    setStreamedContent('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-planner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages,
            tripContext,
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('Payment required. Please add credits.');
        }
        throw new Error('AI service error');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setStreamedContent(fullContent);
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Save assistant message to DB
      await addMessage.mutateAsync({
        sessionId,
        role: 'assistant',
        content: fullContent,
      });

      onComplete?.(fullContent);
      return fullContent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Lỗi AI',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsStreaming(false);
    }
  }, [addMessage, toast]);

  return {
    sendMessage,
    isStreaming,
    streamedContent,
    setStreamedContent,
  };
}
