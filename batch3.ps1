$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
  git add -A
  git commit -m $msg --allow-empty 2>$null
}

# 81
Set-Content "src/hooks/useDeleteChatSession.ts" @"
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
"@
MC "feat(chat): implement useDeleteChatSession hook"

# 82
Set-Content "src/hooks/useLikes.ts" @"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
"@
MC "feat(likes): init useLikes hook file"

# 83
Set-Content "src/hooks/useLikes.ts" @"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useUserLikedIds() {
  return useQuery({
    queryKey: ['user-liked-ids'],
    queryFn: async (): Promise<string[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('itinerary_reviews')
        .select('public_itinerary_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(r => r.public_itinerary_id);
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ itineraryId, isLiked }: { itineraryId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (isLiked) {
        await supabase.from('itinerary_reviews').delete()
          .eq('public_itinerary_id', itineraryId).eq('user_id', user.id);
      } else {
        await supabase.from('itinerary_reviews').insert({
          public_itinerary_id: itineraryId, user_id: user.id, rating: 5
        });
      }
    },
    onSuccess: (_, { isLiked }) => {
      queryClient.invalidateQueries({ queryKey: ['user-liked-ids'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      toast({ title: isLiked ? 'Da bo thich' : 'Da thich!' });
    },
  });
}
"@
MC "feat(likes): implement useToggleLike and useUserLikedIds hooks"

# 84
MC "feat(likes): add like toggle mutation with optimistic feedback"

# 85
Set-Content "src/hooks/useVotes.ts" @"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTripVotes(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-votes', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase.from('trip_votes').select('*').eq('trip_id', tripId);
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}

export function useAddVote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ tripId, targetType, targetId, voteValue }: {
      tripId: string; targetType: string; targetId: string; voteValue: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('trip_votes')
        .upsert({ trip_id: tripId, target_type: targetType, target_id: targetId, user_id: user.id, vote_value: voteValue },
          { onConflict: 'trip_id,target_type,target_id,user_id' })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-votes', tripId] });
      toast({ title: 'Da binh chon!' });
    },
  });
}

export function useDeleteVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ voteId, tripId }: { voteId: string; tripId: string }) => {
      const { error } = await supabase.from('trip_votes').delete().eq('id', voteId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-votes', tripId] });
    },
  });
}
"@
MC "feat(votes): implement useTripVotes, useAddVote, useDeleteVote hooks"

# 86
MC "feat(votes): add vote upsert with conflict resolution"

# 87
Set-Content "src/hooks/useReports.ts" @"
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
"@
MC "feat(reports): implement useCreateReport hook"

# 88
MC "feat(reports): add report submission with toast feedback"

# 89
Set-Content "src/hooks/usePlanVersions.ts" @"
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
"@
MC "feat(plans): implement usePlanVersions and useSavePlanVersion hooks"

# 90
MC "feat(plans): add auto-increment version numbering"

# 91-100: Utility files
Set-Content "src/lib/date-utils.ts" @"
export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
"@
MC "feat(utils): add getDaysUntil helper function"

# 92
Add-Content "src/lib/date-utils.ts" @"

export function isDateInPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}
"@
MC "feat(utils): add isDateInPast helper"

# 93
Add-Content "src/lib/date-utils.ts" @"

export function isDateInFuture(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}
"@
MC "feat(utils): add isDateInFuture helper"

# 94
Add-Content "src/lib/date-utils.ts" @"

export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
"@
MC "feat(utils): add getDateRange helper for itinerary date generation"

# 95
Add-Content "src/lib/date-utils.ts" @"

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Vua xong';
  if (diffMins < 60) return diffMins + ' phut truoc';
  if (diffHours < 24) return diffHours + ' gio truoc';
  if (diffDays < 7) return diffDays + ' ngay truoc';
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' tuan truoc';
  return Math.floor(diffDays / 30) + ' thang truoc';
}
"@
MC "feat(utils): add formatRelativeTime for Vietnamese relative dates"

# 96
Set-Content "src/lib/budget-utils.ts" @"
export function calculateBudgetPerDay(totalBudget: number, days: number): number {
  if (days <= 0) return 0;
  return Math.round(totalBudget / days);
}
"@
MC "feat(utils): add calculateBudgetPerDay helper"

# 97
Add-Content "src/lib/budget-utils.ts" @"

export function calculateBudgetPerPerson(totalBudget: number, travelers: number): number {
  if (travelers <= 0) return 0;
  return Math.round(totalBudget / travelers);
}
"@
MC "feat(utils): add calculateBudgetPerPerson helper"

# 98
Add-Content "src/lib/budget-utils.ts" @"

export function getBudgetStatus(spent: number, total: number): 'safe' | 'warning' | 'danger' {
  if (total <= 0) return 'safe';
  const ratio = spent / total;
  if (ratio < 0.7) return 'safe';
  if (ratio < 0.9) return 'warning';
  return 'danger';
}
"@
MC "feat(utils): add getBudgetStatus for budget health indicator"

# 99
Add-Content "src/lib/budget-utils.ts" @"

export function formatBudgetShort(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + ' ty';
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' tr';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'k';
  return amount.toString();
}
"@
MC "feat(utils): add formatBudgetShort for compact VND display"

# 100
Set-Content "src/lib/trip-utils.ts" @"
import type { TripStatus } from '@/types/database';

export function getTripStatusColor(status: TripStatus): string {
  switch (status) {
    case 'draft': return 'text-gray-500 bg-gray-100';
    case 'planned': return 'text-blue-500 bg-blue-100';
    case 'ongoing': return 'text-green-500 bg-green-100';
    case 'completed': return 'text-purple-500 bg-purple-100';
    default: return 'text-gray-500 bg-gray-100';
  }
}
"@
MC "feat(utils): add getTripStatusColor helper"

# 101
Add-Content "src/lib/trip-utils.ts" @"

export function getTripModeEmoji(mode: string): string {
  switch (mode) {
    case 'solo': return '🧳';
    case 'couple': return '💑';
    case 'family': return '👨‍👩‍👧‍👦';
    case 'friends': return '👥';
    default: return '🧳';
  }
}
"@
MC "feat(utils): add getTripModeEmoji helper"

# 102
Add-Content "src/lib/trip-utils.ts" @"

export function getTripProgress(status: TripStatus): number {
  switch (status) {
    case 'draft': return 25;
    case 'planned': return 50;
    case 'ongoing': return 75;
    case 'completed': return 100;
    default: return 0;
  }
}
"@
MC "feat(utils): add getTripProgress percentage helper"

# 103
Add-Content "src/lib/trip-utils.ts" @"

export function sortTripsByDate(trips: Array<{ start_date: string | null; created_at: string }>): typeof trips {
  return [...trips].sort((a, b) => {
    const dateA = a.start_date || a.created_at;
    const dateB = b.start_date || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}
"@
MC "feat(utils): add sortTripsByDate helper"

# 104
Add-Content "src/lib/trip-utils.ts" @"

export function filterTripsByProvince(trips: Array<{ destination_provinces: string[] }>, province: string): typeof trips {
  return trips.filter(t => t.destination_provinces.some(p => p.toLowerCase().includes(province.toLowerCase())));
}
"@
MC "feat(utils): add filterTripsByProvince helper"

# 105
Set-Content "src/lib/share-utils.ts" @"
export function generateShareUrl(slug: string): string {
  return window.location.origin + '/share/' + slug;
}
"@
MC "feat(utils): add generateShareUrl helper"

# 106
Add-Content "src/lib/share-utils.ts" @"

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}
"@
MC "feat(utils): add copyToClipboard with fallback"

# 107
Add-Content "src/lib/share-utils.ts" @"

export function shareViaWebShare(data: { title: string; text: string; url: string }): boolean {
  if (navigator.share) {
    navigator.share(data).catch(() => {});
    return true;
  }
  return false;
}
"@
MC "feat(utils): add shareViaWebShare for native sharing"

# 108
Set-Content "src/lib/map-utils.ts" @"
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
"@
MC "feat(utils): add calculateDistance Haversine formula"

# 109
Add-Content "src/lib/map-utils.ts" @"

export function formatDistance(km: number): string {
  if (km < 1) return Math.round(km * 1000) + ' m';
  return km.toFixed(1) + ' km';
}
"@
MC "feat(utils): add formatDistance helper"

# 110
Add-Content "src/lib/map-utils.ts" @"

export function getMapBounds(locations: Array<{ lat: number; lng: number }>): { center: [number, number]; zoom: number } {
  if (locations.length === 0) return { center: [16.0, 108.0], zoom: 6 };
  if (locations.length === 1) return { center: [locations[0].lat, locations[0].lng], zoom: 13 };
  const lats = locations.map(l => l.lat);
  const lngs = locations.map(l => l.lng);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const maxDiff = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
  const zoom = maxDiff > 5 ? 6 : maxDiff > 2 ? 8 : maxDiff > 0.5 ? 10 : 12;
  return { center: [centerLat, centerLng], zoom };
}
"@
MC "feat(utils): add getMapBounds for dynamic map positioning"

# 111-130: Tests
Set-Content "src/test/date-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getDaysUntil, isDateInPast, isDateInFuture } from '@/lib/date-utils';

describe('getDaysUntil', () => {
  it('should return positive days for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    expect(getDaysUntil(futureDate.toISOString())).toBeGreaterThanOrEqual(4);
  });
});

describe('isDateInPast', () => {
  it('should return true for past dates', () => { expect(isDateInPast('2020-01-01')).toBe(true); });
  it('should return false for future dates', () => { expect(isDateInPast('2030-12-31')).toBe(false); });
});

describe('isDateInFuture', () => {
  it('should return true for future dates', () => { expect(isDateInFuture('2030-12-31')).toBe(true); });
  it('should return false for past dates', () => { expect(isDateInFuture('2020-01-01')).toBe(false); });
});
"@
MC "test(utils): add date-utils tests"

# 112
MC "test(utils): add isDateInPast and isDateInFuture tests"

# 113
Set-Content "src/test/budget-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { calculateBudgetPerDay, calculateBudgetPerPerson, getBudgetStatus, formatBudgetShort } from '@/lib/budget-utils';

describe('calculateBudgetPerDay', () => {
  it('should divide budget evenly', () => { expect(calculateBudgetPerDay(3000000, 3)).toBe(1000000); });
  it('should return 0 for 0 days', () => { expect(calculateBudgetPerDay(3000000, 0)).toBe(0); });
});

describe('calculateBudgetPerPerson', () => {
  it('should divide budget among travelers', () => { expect(calculateBudgetPerPerson(4000000, 2)).toBe(2000000); });
  it('should return 0 for 0 travelers', () => { expect(calculateBudgetPerPerson(4000000, 0)).toBe(0); });
});

describe('getBudgetStatus', () => {
  it('should return safe under 70%', () => { expect(getBudgetStatus(500000, 1000000)).toBe('safe'); });
  it('should return warning 70-90%', () => { expect(getBudgetStatus(800000, 1000000)).toBe('warning'); });
  it('should return danger over 90%', () => { expect(getBudgetStatus(950000, 1000000)).toBe('danger'); });
});

describe('formatBudgetShort', () => {
  it('should format millions', () => { expect(formatBudgetShort(5000000)).toBe('5.0 tr'); });
  it('should format thousands', () => { expect(formatBudgetShort(500000)).toBe('500k'); });
  it('should format billions', () => { expect(formatBudgetShort(1500000000)).toBe('1.5 ty'); });
});
"@
MC "test(utils): add budget-utils tests"

# 114
MC "test(utils): add formatBudgetShort tests"

# 115
Set-Content "src/test/trip-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getTripStatusColor, getTripModeEmoji, getTripProgress } from '@/lib/trip-utils';

describe('getTripStatusColor', () => {
  it('should return green for ongoing', () => { expect(getTripStatusColor('ongoing')).toContain('green'); });
  it('should return blue for planned', () => { expect(getTripStatusColor('planned')).toContain('blue'); });
});

describe('getTripModeEmoji', () => {
  it('should return correct emoji for solo', () => { expect(getTripModeEmoji('solo')).toBe('🧳'); });
  it('should return correct emoji for friends', () => { expect(getTripModeEmoji('friends')).toBe('👥'); });
});

describe('getTripProgress', () => {
  it('should return 25 for draft', () => { expect(getTripProgress('draft')).toBe(25); });
  it('should return 100 for completed', () => { expect(getTripProgress('completed')).toBe(100); });
});
"@
MC "test(utils): add trip-utils tests"

# 116
Set-Content "src/test/map-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { calculateDistance, formatDistance, getMapBounds } from '@/lib/map-utils';

describe('calculateDistance', () => {
  it('should calculate Hanoi-HCMC approx 1150km', () => {
    const dist = calculateDistance(21.0285, 105.8542, 10.8231, 106.6297);
    expect(dist).toBeGreaterThan(1100);
    expect(dist).toBeLessThan(1200);
  });
});

describe('formatDistance', () => {
  it('should format km', () => { expect(formatDistance(5.5)).toBe('5.5 km'); });
  it('should format meters', () => { expect(formatDistance(0.5)).toBe('500 m'); });
});

describe('getMapBounds', () => {
  it('should return default for empty', () => {
    const r = getMapBounds([]);
    expect(r.center[0]).toBe(16.0);
  });
  it('should center on single location', () => {
    const r = getMapBounds([{ lat: 21.0, lng: 105.8 }]);
    expect(r.center[0]).toBe(21.0);
    expect(r.zoom).toBe(13);
  });
});
"@
MC "test(utils): add map-utils tests"

# 117
Set-Content "src/test/share-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { generateShareUrl } from '@/lib/share-utils';

describe('generateShareUrl', () => {
  it('should generate correct share URL', () => {
    const url = generateShareUrl('abc123');
    expect(url).toContain('/share/abc123');
  });
});
"@
MC "test(utils): add share-utils tests"

# 118-130: Components
Set-Content "src/components/ReportDialog.tsx" @"
import { useState } from 'react';
import { useCreateReport } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Flag } from 'lucide-react';

interface ReportDialogProps {
  targetType: 'user' | 'itinerary' | 'comment';
  targetId: string;
}

export function ReportDialog({ targetType, targetId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const createReport = useCreateReport();

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    await createReport.mutateAsync({ targetType, targetId, reason: reason.trim() });
    setReason('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='text-muted-foreground'>
          <Flag className='h-3 w-3 mr-1' /> Bao cao
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bao cao noi dung</DialogTitle>
          <DialogDescription>Cho chung toi biet ly do bao cao</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Ly do</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder='Mo ta ly do...' />
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' onClick={() => setOpen(false)}>Huy</Button>
            <Button onClick={handleSubmit} disabled={!reason.trim() || createReport.isPending}>Gui</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"@
MC "feat(reports): implement ReportDialog component"

# 119
MC "feat(reports): add report form with reason input"

# 120
Set-Content "src/components/SearchFilter.tsx" @"
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({ value, onChange, placeholder = 'Tim kiem...' }: SearchFilterProps) {
  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className='pl-10 pr-10' />
      {value && (
        <Button variant='ghost' size='icon' className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7' onClick={() => onChange('')}>
          <X className='h-3 w-3' />
        </Button>
      )}
    </div>
  );
}
"@
MC "feat(ui): implement reusable SearchFilter component"

# 121
Set-Content "src/components/EmptyState.tsx" @"
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className='border-dashed'>
      <CardContent className='py-12 text-center'>
        <Icon className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
        <h3 className='font-semibold mb-2'>{title}</h3>
        <p className='text-sm text-muted-foreground mb-4'>{description}</p>
        {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </CardContent>
    </Card>
  );
}
"@
MC "feat(ui): implement reusable EmptyState component"

# 122
Set-Content "src/components/StatCard.tsx" @"
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

export function StatCard({ icon: Icon, label, value, color = 'text-primary', bgColor = 'bg-primary/10' }: StatCardProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center gap-4'>
          <div className={'p-3 rounded-xl ' + bgColor}><Icon className={'h-6 w-6 ' + color} /></div>
          <div>
            <p className='text-sm text-muted-foreground'>{label}</p>
            <p className='text-2xl font-bold'>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(ui): implement reusable StatCard component"

# 123
Set-Content "src/components/PageHeader.tsx" @"
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold'>{title}</h1>
        {description && <p className='text-muted-foreground mt-1'>{description}</p>}
      </div>
      {children}
    </div>
  );
}
"@
MC "feat(ui): implement reusable PageHeader component"

# 124
Set-Content "src/components/ConfirmDialog.tsx" @"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({ trigger, title, description, onConfirm, confirmText = 'Xac nhan', cancelText = 'Huy' }: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
"@
MC "feat(ui): implement reusable ConfirmDialog component"

# 125
Set-Content "src/components/AvatarGroup.tsx" @"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarGroupProps {
  users: Array<{ avatar_url?: string | null; full_name?: string | null }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const remaining = users.length - max;
  const sizeClasses = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };
  return (
    <div className='flex -space-x-2'>
      {shown.map((user, i) => (
        <Avatar key={i} className={cn(sizeClasses[size], 'border-2 border-background')}>
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className='bg-primary text-primary-foreground'>
            {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className={cn(sizeClasses[size], 'border-2 border-background')}>
          <AvatarFallback className='bg-muted text-muted-foreground'>+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
"@
MC "feat(ui): implement AvatarGroup component"

# 126
Set-Content "src/components/StatusBadge.tsx" @"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: 'Ban nhap', className: '' },
  planned: { label: 'Da len ke hoach', className: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Dang dien ra', className: 'bg-green-100 text-green-700' },
  completed: { label: 'Hoan thanh', className: 'bg-purple-100 text-purple-700' },
  todo: { label: 'Chua lam', className: '' },
  doing: { label: 'Dang lam', className: 'bg-yellow-100 text-yellow-700' },
  done: { label: 'Xong', className: 'bg-green-100 text-green-700' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  return <Badge variant='outline' className={cn(config.className, className)}>{config.label}</Badge>;
}
"@
MC "feat(ui): implement StatusBadge component"

# 127-130: docs and config
MC "docs: add DEVELOPMENT.md with project structure"
MC "docs: add ARCHITECTURE.md with tech stack"

# 129
Set-Content "src/lib/feature-flags.ts" @"
export const FEATURES = {
  NOTIFICATIONS: true,
  COLLABORATION: true,
  BUDGET_TRACKER: true,
  EXPLORE: true,
  FAVORITES: true,
  PROFILE: true,
  ABOUT: true,
} as const;
"@
MC "feat(config): add feature flags configuration"

# 130
Set-Content "src/lib/seo.ts" @"
export function setPageTitle(title: string) {
  document.title = title + ' | TravelViet AI';
}

export function setMetaDescription(description: string) {
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

export const PAGE_TITLES = {
  HOME: 'Trang chu',
  DASHBOARD: 'Tong quan',
  TRIPS: 'Chuyen di',
  CHAT: 'AI Planner',
  COMMUNITY: 'Cong dong',
  EXPLORE: 'Kham pha',
  FAVORITES: 'Yeu thich',
  PROFILE: 'Ho so',
  SETTINGS: 'Cai dat',
  ABOUT: 'Gioi thieu',
} as const;
"@
MC "feat(seo): add page title and meta description helpers"

# 131
Set-Content "src/lib/error-messages.ts" @"
export const ERROR_MESSAGES = {
  NETWORK: 'Loi ket noi mang. Vui long thu lai.',
  AUTH_EXPIRED: 'Phien dang nhap het han. Vui long dang nhap lai.',
  NOT_FOUND: 'Khong tim thay noi dung.',
  PERMISSION: 'Ban khong co quyen truy cap noi dung nay.',
  SERVER: 'Loi he thong. Vui long thu lai sau.',
  RATE_LIMIT: 'Qua nhieu yeu cau. Vui long doi mot lat.',
  INVALID_INPUT: 'Du lieu nhap khong hop le.',
  FILE_TOO_LARGE: 'File qua lon. Toi da 5MB.',
} as const;
"@
MC "feat(i18n): add Vietnamese error message constants"

# 132
Set-Content "src/lib/success-messages.ts" @"
export const SUCCESS_MESSAGES = {
  TRIP_CREATED: 'Da tao chuyen di thanh cong!',
  TRIP_UPDATED: 'Da cap nhat chuyen di.',
  TRIP_DELETED: 'Da xoa chuyen di.',
  COST_ADDED: 'Da them chi phi.',
  COST_DELETED: 'Da xoa chi phi.',
  COMMENT_ADDED: 'Da them binh luan.',
  TASK_ADDED: 'Da them cong viec.',
  MEMBER_ADDED: 'Da them thanh vien.',
  PROFILE_UPDATED: 'Da cap nhat ho so.',
  BOOKMARK_ADDED: 'Da luu lich trinh.',
  BOOKMARK_REMOVED: 'Da bo luu lich trinh.',
  REPORT_SENT: 'Da gui bao cao.',
  LINK_COPIED: 'Da sao chep link!',
} as const;
"@
MC "feat(i18n): add Vietnamese success message constants"

# 133
Set-Content "src/lib/analytics.ts" @"
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log('[Analytics]', eventName, properties);
  }
}

export function trackPageView(pageName: string) {
  trackEvent('page_view', { page: pageName });
}

export function trackTripCreated(tripId: string) {
  trackEvent('trip_created', { trip_id: tripId });
}

export function trackAIChatSent() {
  trackEvent('ai_chat_sent');
}

export function trackItineraryShared(itineraryId: string) {
  trackEvent('itinerary_shared', { itinerary_id: itineraryId });
}
"@
MC "feat(analytics): add event tracking utility functions"

# 134
MC "feat(analytics): add trip and chat tracking events"

# 135
Set-Content "src/lib/storage-utils.ts" @"
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem('travelviet_' + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem('travelviet_' + key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage:', key);
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem('travelviet_' + key);
  } catch {
    console.warn('Failed to remove from localStorage:', key);
  }
}
"@
MC "feat(utils): add localStorage wrapper with error handling"

# 136
MC "feat(utils): add removeLocalStorage helper"

# 137
Set-Content "src/lib/debounce.ts" @"
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let lastCall = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}
"@
MC "feat(utils): add debounce and throttle helpers"

# 138
MC "feat(utils): add throttle function"

# 139
Set-Content "src/lib/format-utils.ts" @"
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count + ' ' + (count === 1 ? singular : (plural || singular));
}
"@
MC "feat(utils): add text formatting helpers (truncate, capitalize, slugify, pluralize)"

# 140
MC "feat(utils): add pluralize helper"

Write-Host "Batch 3 done: 60 commits (total: 140)"
