import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

interface ParsedDay {
  day_index: number;
  date?: string;
  summary?: string;
  items: ParsedItem[];
}

interface ParsedItem {
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  item_type: string;
  estimated_cost_vnd?: number;
}

interface SaveItineraryButtonProps {
  tripId: string;
  aiContent: string;
  onSuccess?: () => void;
}

export function SaveItineraryButton({ tripId, aiContent, onSuccess }: SaveItineraryButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const parseAIContent = (content: string): ParsedDay[] => {
    const days: ParsedDay[] = [];
    
    // Split content by day headers (e.g., "#### Ngày 1:", "### Ngày 2:")
    const dayPattern = /(?:#{2,4})\s*Ngày\s*(\d+)[:\s]*([\d-]*)/gi;
    const dayMatches = [...content.matchAll(dayPattern)];
    
    if (dayMatches.length === 0) {
      // Try alternative patterns
      const altPattern = /Ngày\s*(\d+)[:\s]*(\d{4}-\d{2}-\d{2})?/gi;
      const altMatches = [...content.matchAll(altPattern)];
      if (altMatches.length === 0) return days;
      dayMatches.push(...altMatches);
    }

    for (let i = 0; i < dayMatches.length; i++) {
      const match = dayMatches[i];
      const dayIndex = parseInt(match[1], 10);
      const dateStr = match[2] || undefined;
      
      // Get content between this day and next day
      const startIdx = match.index! + match[0].length;
      const endIdx = i < dayMatches.length - 1 ? dayMatches[i + 1].index! : content.length;
      const dayContent = content.substring(startIdx, endIdx);
      
      // Parse items from day content
      const items = parseItems(dayContent);
      
      days.push({
        day_index: dayIndex,
        date: dateStr,
        items,
      });
    }

    return days;
  };

  const parseItems = (dayContent: string): ParsedItem[] => {
    const items: ParsedItem[] = [];
    
    // Match activity lines like "- **Sáng**: ..." or "- **8:00**: ..."
    const activityPattern = /[-*]\s*\*?\*?([^*\n:]+)(?:\*?\*?):\s*([^\n]+(?:\n(?![-*]\s*\*?\*?[^*\n:]+:)[^\n]*)*)/gi;
    const matches = [...dayContent.matchAll(activityPattern)];
    
    for (const match of matches) {
      const timeLabel = match[1].trim();
      const description = match[2].trim();
      
      // Extract location from [...](maps.google.com...) or plain text
      let locationName: string | undefined;
      const locationMatch = description.match(/\[([^\]]+)\]\([^)]+\)/);
      if (locationMatch) {
        locationName = locationMatch[1].replace(/📍\s*Xem bản đồ/i, '').trim();
      }
      
      // Parse time from label
      const timeMatch = timeLabel.match(/(\d{1,2})[h:](\d{2})?/);
      const startTime = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}` : undefined;
      
      // Determine item type based on keywords
      let itemType = 'visit';
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes('ăn') || lowerDesc.includes('uống') || lowerDesc.includes('quán') || lowerDesc.includes('nhà hàng')) {
        itemType = 'food';
      } else if (lowerDesc.includes('nghỉ') || lowerDesc.includes('khách sạn') || lowerDesc.includes('lưu trú')) {
        itemType = 'stay';
      } else if (lowerDesc.includes('di chuyển') || lowerDesc.includes('taxi') || lowerDesc.includes('xe')) {
        itemType = 'transport';
      }
      
      // Extract cost
      let estimatedCost: number | undefined;
      const costMatch = description.match(/(\d{1,3}(?:[.,]\d{3})*)\s*(?:VNĐ|đ|vnđ|đồng)/i);
      if (costMatch) {
        estimatedCost = parseInt(costMatch[1].replace(/[.,]/g, ''), 10);
      }
      
      // Clean description
      const cleanDesc = description
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove images
        .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => m.match(/\[([^\]]+)\]/)?.[1] || '') // Keep link text only
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500);
      
      // Create title from time label and first part of description
      const title = locationName || cleanDesc.split('.')[0].substring(0, 100);
      
      if (title && title.length > 2) {
        items.push({
          title,
          description: cleanDesc !== title ? cleanDesc : undefined,
          start_time: startTime,
          location_name: locationName,
          item_type: itemType,
          estimated_cost_vnd: estimatedCost,
        });
      }
    }
    
    return items;
  };

  const handleSave = async () => {
    if (!aiContent || !tripId) return;
    
    setIsSaving(true);
    try {
      const parsedDays = parseAIContent(aiContent);
      
      if (parsedDays.length === 0) {
        toast({
          title: 'Không tìm thấy lịch trình',
          description: 'AI chưa tạo lịch trình chi tiết theo ngày. Hãy yêu cầu AI tạo lịch trình cụ thể.',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      // Delete existing days first
      await supabase
        .from('trip_days')
        .delete()
        .eq('trip_id', tripId);

      // Insert new days
      for (const day of parsedDays) {
        const { data: dayData, error: dayError } = await supabase
          .from('trip_days')
          .insert({
            trip_id: tripId,
            day_index: day.day_index,
            date: day.date,
            summary: day.summary,
          })
          .select()
          .single();

        if (dayError) throw dayError;

        // Insert items for this day
        if (day.items.length > 0) {
          const itemsToInsert = day.items.map((item, idx) => ({
            trip_day_id: dayData.id,
            title: item.title,
            description: item.description,
            start_time: item.start_time,
            end_time: item.end_time,
            location_name: item.location_name,
            item_type: item.item_type,
            estimated_cost_vnd: item.estimated_cost_vnd || 0,
            sort_order: idx,
          }));

          const { error: itemsError } = await supabase
            .from('trip_items')
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }
      }

      toast({
        title: 'Đã lưu lịch trình!',
        description: `Đã lưu ${parsedDays.length} ngày với ${parsedDays.reduce((sum, d) => sum + d.items.length, 0)} hoạt động.`,
      });

      onSuccess?.();
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast({
        title: 'Lỗi lưu lịch trình',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving || !aiContent}
      variant="outline"
      size="sm"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      Lưu lịch trình
    </Button>
  );
}
