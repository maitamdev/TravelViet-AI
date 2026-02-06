import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useChatSessions, useChatMessages, useCreateChatSession, useAddChatMessage, useStreamingChat } from '@/hooks/useChat';
import { useTrip } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SaveItineraryButton } from '@/components/trips/SaveItineraryButton';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Sparkles,
  Loader2,
  Bot,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/database';

export default function ChatPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ChatContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function ChatContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripId = searchParams.get('tripId') || undefined;
  const autoplan = searchParams.get('autoplan') === 'true';
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [hasAutoPlanned, setHasAutoPlanned] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions, isLoading: sessionsLoading } = useChatSessions(tripId);
  const { data: messages, isLoading: messagesLoading } = useChatMessages(activeSessionId || undefined);
  const { data: trip, isLoading: tripLoading } = useTrip(tripId);
  
  const createSession = useCreateChatSession();
  const addMessage = useAddChatMessage();
  const { sendMessage, isStreaming, streamedContent } = useStreamingChat();

  // Auto-select first session or create new one
  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  // Auto-plan when coming from create trip dialog
  useEffect(() => {
    const triggerAutoPlan = async () => {
      if (!autoplan || hasAutoPlanned || tripLoading || !trip || sessionsLoading || isStreaming) return;
      
      setHasAutoPlanned(true);
      
      // Remove autoplan from URL
      searchParams.delete('autoplan');
      setSearchParams(searchParams, { replace: true });
      
      // Create a new session
      const title = `Lên kế hoạch: ${trip.title}`;
      const session = await createSession.mutateAsync({ tripId, title });
      setActiveSessionId(session.id);
      
      // Build the auto-plan message
      const destinations = trip.destination_provinces?.join(', ') || 'Việt Nam';
      const dates = trip.start_date && trip.end_date 
        ? `từ ${trip.start_date} đến ${trip.end_date}` 
        : trip.start_date 
          ? `bắt đầu từ ${trip.start_date}`
          : '';
      const budget = trip.total_budget_vnd > 0 
        ? `ngân sách ${trip.total_budget_vnd.toLocaleString('vi-VN')} VNĐ` 
        : '';
      const travelers = trip.travelers_count > 1 
        ? `cho ${trip.travelers_count} người` 
        : '';

      const planMessage = `Hãy lên lịch trình chi tiết cho chuyến đi ${destinations} ${dates} ${travelers} ${budget}. Bao gồm địa điểm tham quan, ăn uống, thời gian di chuyển và chi phí ước tính cho từng hoạt động.`.trim().replace(/\s+/g, ' ');

      // Save user message
      await addMessage.mutateAsync({
        sessionId: session.id,
        role: 'user',
        content: planMessage,
      });

      // Send to AI
      await sendMessage({
        sessionId: session.id,
        messages: [{ role: 'user', content: planMessage }],
        tripContext: {
          tripId: trip.id,
          destination: trip.destination_provinces,
          startDate: trip.start_date || undefined,
          endDate: trip.end_date || undefined,
          mode: trip.mode,
          budget: trip.total_budget_vnd,
        },
      });
    };

    triggerAutoPlan();
  }, [autoplan, hasAutoPlanned, trip, tripLoading, sessionsLoading, isStreaming]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedContent]);

  const handleCreateSession = async () => {
    const title = tripId && trip ? `Lên kế hoạch: ${trip.title}` : 'Cuộc trò chuyện mới';
    const session = await createSession.mutateAsync({ tripId, title });
    setActiveSessionId(session.id);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;
    
    let sessionId = activeSessionId;
    
    // Create session if none exists
    if (!sessionId) {
      const title = tripId && trip ? `Lên kế hoạch: ${trip.title}` : 'Cuộc trò chuyện mới';
      const session = await createSession.mutateAsync({ tripId, title });
      sessionId = session.id;
      setActiveSessionId(sessionId);
    }

    const userMessage = inputValue.trim();
    setInputValue('');

    // Save user message
    await addMessage.mutateAsync({
      sessionId,
      role: 'user',
      content: userMessage,
    });

    // Prepare messages for AI
    const allMessages = [
      ...(messages || []).map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
      { role: 'user' as const, content: userMessage },
    ];

    // Send to AI
    await sendMessage({
      sessionId,
      messages: allMessages,
      tripContext: trip ? {
        tripId: trip.id,
        destination: trip.destination_provinces,
        startDate: trip.start_date || undefined,
        endDate: trip.end_date || undefined,
        mode: trip.mode,
        budget: trip.total_budget_vnd,
      } : undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sessions Sidebar */}
      <Card className="w-72 hidden lg:flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cuộc trò chuyện</CardTitle>
            <Button size="icon" variant="ghost" onClick={handleCreateSession}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-4 pb-4">
            {sessionsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      activeSessionId === session.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {session.title || 'Cuộc trò chuyện'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có cuộc trò chuyện
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-badge w-10 h-10">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Travel Planner</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {trip ? `Đang lên kế hoạch: ${trip.title}` : 'Hỏi bất cứ điều gì về du lịch Việt Nam'}
                </p>
              </div>
            </div>
            {tripId && messages && messages.length > 0 && (
              <SaveItineraryButton 
                tripId={tripId} 
                aiContent={messages.filter(m => m.role === 'assistant').pop()?.content || ''} 
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-3/4" />
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message: ChatMessage) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isStreaming && streamedContent && (
                  <MessageBubble
                    message={{
                      id: 'streaming',
                      session_id: activeSessionId || '',
                      role: 'assistant',
                      content: streamedContent,
                      metadata: {},
                      created_at: new Date().toISOString(),
                    }}
                    isStreaming
                  />
                )}
                {isStreaming && !streamedContent && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI đang suy nghĩ...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="icon-badge w-16 h-16 mb-4">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Travel Planner</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Xin chào! Tôi có thể giúp bạn lên kế hoạch du lịch Việt Nam. 
                  Hãy cho tôi biết bạn muốn đi đâu, khi nào và ngân sách bao nhiêu.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Gợi ý địa điểm du lịch mùa hè',
                    'Lịch trình 3 ngày ở Đà Nẵng',
                    'Du lịch Phú Quốc cho 2 người',
                  ].map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isStreaming}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isStreaming}
              className="btn-hero"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary' : 'bg-accent'
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-accent-foreground" />
        )}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      )}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 prose-img:rounded-lg prose-img:my-2 prose-a:text-primary prose-a:underline">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <button
                    type="button"
                    onClick={async () => {
                      if (href) {
                        // Try to open in new tab
                        const newWindow = window.open(href, '_blank', 'noopener,noreferrer');
                        
                        // If blocked by iframe, copy to clipboard
                        if (!newWindow || newWindow.closed) {
                          try {
                            await navigator.clipboard.writeText(href);
                            alert('Link đã được copy! Hãy dán vào tab mới để mở Google Maps.\n\n' + href);
                          } catch {
                            // Fallback: show the URL
                            prompt('Copy link này và dán vào tab mới:', href);
                          }
                        }
                      }
                    }}
                    className="text-primary hover:underline inline cursor-pointer"
                  >
                    {children}
                  </button>
                ),
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg w-full max-w-md object-cover" 
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
