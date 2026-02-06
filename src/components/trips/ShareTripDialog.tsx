import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Copy, Link, Check, Loader2, Globe, Lock } from 'lucide-react';
import type { Trip } from '@/types/database';

interface ShareTripDialogProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareTripDialog({ trip, open, onOpenChange }: ShareTripDialogProps) {
  const [shareSlug, setShareSlug] = useState(trip.share_slug || '');
  const [isPublic, setIsPublic] = useState(!!trip.share_slug);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = shareSlug 
    ? `${window.location.origin}/share/${shareSlug}`
    : '';

  useEffect(() => {
    setShareSlug(trip.share_slug || '');
    setIsPublic(!!trip.share_slug);
  }, [trip]);

  const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  };

  const handleTogglePublic = async (checked: boolean) => {
    setIsLoading(true);
    try {
      if (checked) {
        // Generate and save slug
        const newSlug = generateSlug();
        const { error } = await supabase
          .from('trips')
          .update({ share_slug: newSlug })
          .eq('id', trip.id);

        if (error) throw error;
        setShareSlug(newSlug);
        setIsPublic(true);
        toast({
          title: 'Đã bật chia sẻ công khai',
          description: 'Link chia sẻ đã được tạo.',
        });
      } else {
        // Remove slug
        const { error } = await supabase
          .from('trips')
          .update({ share_slug: null })
          .eq('id', trip.id);

        if (error) throw error;
        setShareSlug('');
        setIsPublic(false);
        toast({
          title: 'Đã tắt chia sẻ công khai',
          description: 'Link chia sẻ không còn hoạt động.',
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Đã copy link!',
      });
    } catch (err) {
      console.error('Clipboard error:', err);
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateLink = async () => {
    setIsLoading(true);
    try {
      const newSlug = generateSlug();
      const { error } = await supabase
        .from('trips')
        .update({ share_slug: newSlug })
        .eq('id', trip.id);

      if (error) throw error;
      setShareSlug(newSlug);
      toast({
        title: 'Đã tạo link mới',
        description: 'Link cũ sẽ không còn hoạt động.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Chia sẻ chuyến đi
          </DialogTitle>
          <DialogDescription>
            Chia sẻ lịch trình với bạn bè thông qua link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Toggle public sharing */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="public-toggle" className="font-medium">
                  Chia sẻ công khai
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPublic 
                    ? 'Bất kỳ ai có link đều xem được' 
                    : 'Chỉ bạn và thành viên xem được'}
                </p>
              </div>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={isLoading}
            />
          </div>

          {/* Share URL */}
          {isPublic && shareUrl && (
            <div className="space-y-3">
              <Label>Link chia sẻ</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={isLoading}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateLink}
                disabled={isLoading}
                className="text-muted-foreground"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Tạo link mới
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>📌 Người xem có thể thấy lịch trình và bản đồ</p>
            <p>🔒 Họ không thể chỉnh sửa hoặc xem thông tin riêng tư</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
