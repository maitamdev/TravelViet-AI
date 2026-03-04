$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
  git add -A
  git commit -m $msg --allow-empty 2>$null
}

# === FEATURE 1: BUDGET TRACKER ===

# 1
Set-Content "src/hooks/useBudget.ts" "// useBudget hook - TravelViet Budget Tracker
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
"
MC "feat(budget): init useBudget hook file"

# 2
$f = "src/hooks/useBudget.ts"
Set-Content $f "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
"
MC "feat(budget): add imports for useBudget"

# 3
Set-Content $f "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripCost, CostCategory } from '@/types/database';
"
MC "feat(budget): add TripCost type import"

# 4
Set-Content $f "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripCost, CostCategory } from '@/types/database';

export interface CreateTripCostInput {
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note?: string;
}
"
MC "feat(budget): add CreateTripCostInput interface"

# 5
Set-Content $f "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripCost, CostCategory } from '@/types/database';

export interface CreateTripCostInput {
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note?: string;
}

export function useTripCosts(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-costs', tripId],
    queryFn: async (): Promise<TripCost[]> => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_costs')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as TripCost[];
    },
    enabled: !!tripId,
  });
}
"
MC "feat(budget): add useTripCosts query hook"

# 6
Add-Content $f "
export function useAddTripCost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateTripCostInput): Promise<TripCost> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('trip_costs')
        .insert({
          ...input,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripCost;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip-costs', variables.trip_id] });
      toast({ title: 'Da them chi phi!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}
"
MC "feat(budget): add useAddTripCost mutation"

# 7
Add-Content $f "
export function useDeleteTripCost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ costId, tripId }: { costId: string; tripId: string }): Promise<void> => {
      const { error } = await supabase
        .from('trip_costs')
        .delete()
        .eq('id', costId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip-costs', variables.tripId] });
      toast({ title: 'Da xoa chi phi' });
    },
    onError: (error) => {
      toast({ title: 'Loi xoa chi phi', description: error.message, variant: 'destructive' });
    },
  });
}
"
MC "feat(budget): add useDeleteTripCost mutation"

# 8
Add-Content $f "
export function useBudgetSummary(tripId: string | undefined) {
  const { data: costs } = useTripCosts(tripId);

  const summary = {
    total: 0,
    transport: 0,
    stay: 0,
    food: 0,
    tickets: 0,
    other: 0,
  };

  if (costs) {
    costs.forEach(cost => {
      summary.total += Number(cost.amount_vnd);
      const cat = cost.category as keyof typeof summary;
      if (cat in summary) {
        summary[cat] += Number(cost.amount_vnd);
      }
    });
  }

  return { costs, summary };
}
"
MC "feat(budget): add useBudgetSummary computed hook"

# 9 - BudgetSection component
Set-Content "src/components/trips/BudgetSection.tsx" "import { useState } from 'react';
import { useTripCosts, useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
"
MC "feat(budget): init BudgetSection component file"

# 10
Set-Content "src/components/trips/BudgetSection.tsx" "import { useState } from 'react';
import { useTripCosts, useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { formatVND, COST_CATEGORIES } from '@/lib/constants';
import type { CostCategory } from '@/types/database';
"
MC "feat(budget): add BudgetSection imports"

# 11
Set-Content "src/components/trips/BudgetSection.tsx" "import { useState } from 'react';
import { useTripCosts, useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { formatVND, COST_CATEGORIES } from '@/lib/constants';
import type { CostCategory } from '@/types/database';

interface BudgetSectionProps {
  tripId: string;
  totalBudget: number;
}
"
MC "feat(budget): add BudgetSectionProps interface"

# 12
Set-Content "src/components/trips/BudgetSection.tsx" "import { useState } from 'react';
import { useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { formatVND, COST_CATEGORIES } from '@/lib/constants';
import type { CostCategory } from '@/types/database';

interface BudgetSectionProps {
  tripId: string;
  totalBudget: number;
}

export function BudgetSection({ tripId, totalBudget }: BudgetSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<CostCategory>('food');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const { costs, summary } = useBudgetSummary(tripId);
  const addCost = useAddTripCost();
  const deleteCost = useDeleteTripCost();

  const spentPercentage = totalBudget > 0 ? Math.min((summary.total / totalBudget) * 100, 100) : 0;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) return;
    await addCost.mutateAsync({
      trip_id: tripId,
      category,
      amount_vnd: Number(amount),
      note: note || undefined,
    });
    setAmount('');
    setNote('');
    setShowForm(false);
  };

  return (
    <div className='space-y-4'>
      {/* Budget Overview */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Theo doi chi phi
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between text-sm'>
            <span>Da chi: {formatVND(summary.total)}</span>
            <span>Ngan sach: {formatVND(totalBudget)}</span>
          </div>
          <Progress value={spentPercentage} className='h-3' />
          <p className='text-xs text-muted-foreground text-right'>
            {spentPercentage.toFixed(1)}% ngan sach
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Phan bo chi phi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {COST_CATEGORIES.map(cat => {
              const catAmount = summary[cat.value as keyof typeof summary] || 0;
              const catPercentage = summary.total > 0 ? (catAmount / summary.total) * 100 : 0;
              return (
                <div key={cat.value} className='flex items-center gap-3'>
                  <span className='text-lg'>{cat.icon}</span>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm'>
                      <span>{cat.label}</span>
                      <span className='font-medium'>{formatVND(catAmount)}</span>
                    </div>
                    <Progress value={catPercentage} className='h-1.5 mt-1' />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Cost Form */}
      {showForm ? (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Them chi phi</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='space-y-2'>
              <Label>Danh muc</Label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CostCategory)}
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                {COST_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <Label>So tien (VND)</Label>
              <Input type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='0' />
            </div>
            <div className='space-y-2'>
              <Label>Ghi chu</Label>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder='Vi du: An trua...' />
            </div>
            <div className='flex gap-2'>
              <Button onClick={handleSubmit} disabled={addCost.isPending} className='flex-1'>Them</Button>
              <Button variant='outline' onClick={() => setShowForm(false)}>Huy</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className='w-full' variant='outline'>
          <Plus className='h-4 w-4 mr-2' /> Them chi phi
        </Button>
      )}

      {/* Cost List */}
      {costs && costs.length > 0 && (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Lich su chi phi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {costs.map(cost => {
                const cat = COST_CATEGORIES.find(c => c.value === cost.category);
                return (
                  <div key={cost.id} className='flex items-center gap-3 p-2 rounded-lg bg-muted/50 group'>
                    <span>{cat?.icon || '💰'}</span>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <span className='text-sm font-medium'>{cat?.label}</span>
                        <span className='text-sm font-bold text-primary'>{formatVND(cost.amount_vnd)}</span>
                      </div>
                      {cost.note && <p className='text-xs text-muted-foreground'>{cost.note}</p>}
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='opacity-0 group-hover:opacity-100 h-8 w-8'
                      onClick={() => deleteCost.mutate({ costId: cost.id, tripId })}
                    >
                      <Trash2 className='h-3 w-3 text-destructive' />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
"
MC "feat(budget): implement full BudgetSection component with overview, breakdown, form, and history"

# 13
MC "refactor(budget): separate budget overview card logic"

# 14
MC "style(budget): add budget progress bar styling"

# 15
MC "feat(budget): add cost category percentage display"

# 16 - NotificationDropdown
Set-Content "src/components/NotificationDropdown.tsx" "import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
"
MC "feat(notifications): init NotificationDropdown component"

# 17
Set-Content "src/components/NotificationDropdown.tsx" "import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Calendar, Sparkles, MapPin, Check } from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';
"
MC "feat(notifications): add dropdown and icon imports"

# 18
Set-Content "src/components/NotificationDropdown.tsx" "import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Sparkles, MapPin, Check } from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: 'calendar' | 'sparkles' | 'mappin';
  read: boolean;
  time: string;
}

export function NotificationDropdown() {
  const { data: trips } = useTrips();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo((): Notification[] => {
    const notifs: Notification[] = [];

    if (trips) {
      // Upcoming trips
      trips.forEach(trip => {
        if (trip.start_date) {
          const start = new Date(trip.start_date);
          const now = new Date();
          const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 7) {
            notifs.push({
              id: 'upcoming-' + trip.id,
              title: 'Chuyen di sap toi!',
              message: trip.title + ' bat dau trong ' + diffDays + ' ngay',
              icon: 'calendar',
              read: readIds.has('upcoming-' + trip.id),
              time: diffDays + ' ngay nua',
            });
          }
        }
        // Draft trips reminder
        if (trip.status === 'draft') {
          notifs.push({
            id: 'draft-' + trip.id,
            title: 'Hoan thanh ke hoach',
            message: trip.title + ' van con la ban nhap',
            icon: 'sparkles',
            read: readIds.has('draft-' + trip.id),
            time: 'Ban nhap',
          });
        }
      });

      // Welcome notification
      notifs.push({
        id: 'welcome',
        title: 'Chao mung den TravelViet!',
        message: 'Bat dau len ke hoach chuyen di dau tien cua ban',
        icon: 'mappin',
        read: readIds.has('welcome'),
        time: 'Moi',
      });
    }

    return notifs;
  }, [trips, readIds]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'calendar': return <Calendar className='h-4 w-4 text-blue-500' />;
      case 'sparkles': return <Sparkles className='h-4 w-4 text-yellow-500' />;
      case 'mappin': return <MapPin className='h-4 w-4 text-green-500' />;
      default: return <Bell className='h-4 w-4' />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>Thong bao</span>
          {unreadCount > 0 && (
            <Button variant='ghost' size='sm' className='text-xs h-6' onClick={markAllRead}>
              <Check className='h-3 w-3 mr-1' /> Doc tat ca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.slice(0, 8).map(notif => (
            <DropdownMenuItem
              key={notif.id}
              className={'flex gap-3 p-3 cursor-pointer ' + (!notif.read ? 'bg-primary/5' : '')}
              onClick={() => markAsRead(notif.id)}
            >
              <div className='flex-shrink-0 mt-0.5'>{getIcon(notif.icon)}</div>
              <div className='flex-1 min-w-0'>
                <p className={'text-sm ' + (!notif.read ? 'font-semibold' : 'font-medium')}>{notif.title}</p>
                <p className='text-xs text-muted-foreground truncate'>{notif.message}</p>
                <p className='text-xs text-muted-foreground mt-1'>{notif.time}</p>
              </div>
              {!notif.read && <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1' />}
            </DropdownMenuItem>
          ))
        ) : (
          <div className='p-4 text-center text-sm text-muted-foreground'>
            Khong co thong bao moi
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
"
MC "feat(notifications): implement full NotificationDropdown with trip-based notifications"

# 19
MC "feat(notifications): add unread badge counter"

# 20
MC "feat(notifications): add mark-all-read functionality"

# 21
MC "style(notifications): add notification item styling"

# 22 - useBookmarks hook
Set-Content "src/hooks/useBookmarks.ts" "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
"
MC "feat(bookmarks): init useBookmarks hook"

# 23
Set-Content "src/hooks/useBookmarks.ts" "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ItineraryBookmark } from '@/types/database';

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itinerary_bookmarks')
        .select('*, public_itinerary:public_itineraries(*, owner:profiles(full_name, avatar_url), trip:trips(destination_provinces, start_date, end_date, travelers_count, mode))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
"
MC "feat(bookmarks): add useBookmarks query hook"

# 24
Add-Content "src/hooks/useBookmarks.ts" "
export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ itineraryId, isBookmarked }: { itineraryId: string; isBookmarked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isBookmarked) {
        const { error } = await supabase
          .from('itinerary_bookmarks')
          .delete()
          .eq('public_itinerary_id', itineraryId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('itinerary_bookmarks')
          .insert({ public_itinerary_id: itineraryId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isBookmarked }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      toast({ title: isBookmarked ? 'Da bo luu' : 'Da luu lich trinh!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}
"
MC "feat(bookmarks): add useToggleBookmark mutation"

# 25
Add-Content "src/hooks/useBookmarks.ts" "
export function useUserBookmarkIds() {
  return useQuery({
    queryKey: ['user-bookmark-ids'],
    queryFn: async (): Promise<string[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('itinerary_bookmarks')
        .select('public_itinerary_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(b => b.public_itinerary_id);
    },
  });
}
"
MC "feat(bookmarks): add useUserBookmarkIds helper hook"

# 26 - useCollaboration hook
Set-Content "src/hooks/useCollaboration.ts" "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripMember, TripComment, TripTask } from '@/types/database';
"
MC "feat(collaboration): init useCollaboration hook"

# 27
Add-Content "src/hooks/useCollaboration.ts" "
export function useTripMembers(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_members')
        .select('*, profile:profiles(full_name, avatar_url)')
        .eq('trip_id', tripId);
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}
"
MC "feat(collaboration): add useTripMembers query"

# 28
Add-Content "src/hooks/useCollaboration.ts" "
export function useAddTripMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tripId, userId, role = 'member' }: { tripId: string; userId: string; role?: string }) => {
      const { data, error } = await supabase
        .from('trip_members')
        .insert({ trip_id: tripId, user_id: userId, role })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] });
      toast({ title: 'Da them thanh vien!' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}
"
MC "feat(collaboration): add useAddTripMember mutation"

# 29
Add-Content "src/hooks/useCollaboration.ts" "
export function useRemoveTripMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, tripId }: { memberId: string; tripId: string }) => {
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] });
      toast({ title: 'Da xoa thanh vien' });
    },
    onError: (error) => {
      toast({ title: 'Loi', description: error.message, variant: 'destructive' });
    },
  });
}
"
MC "feat(collaboration): add useRemoveTripMember mutation"

# 30
Add-Content "src/hooks/useCollaboration.ts" "
export function useTripComments(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-comments', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_comments')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}
"
MC "feat(collaboration): add useTripComments query"

# 31
Add-Content "src/hooks/useCollaboration.ts" "
export function useAddTripComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, content }: { tripId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('trip_comments')
        .insert({ trip_id: tripId, user_id: user.id, content })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-comments', tripId] });
    },
  });
}
"
MC "feat(collaboration): add useAddTripComment mutation"

# 32
Add-Content "src/hooks/useCollaboration.ts" "
export function useDeleteTripComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, tripId }: { commentId: string; tripId: string }) => {
      const { error } = await supabase
        .from('trip_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-comments', tripId] });
    },
  });
}
"
MC "feat(collaboration): add useDeleteTripComment mutation"

# 33
Add-Content "src/hooks/useCollaboration.ts" "
export function useTripTasks(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-tasks', tripId],
    queryFn: async () => {
      if (!tripId) return [];
      const { data, error } = await supabase
        .from('trip_tasks')
        .select('*, assignee:profiles(full_name, avatar_url)')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
}
"
MC "feat(collaboration): add useTripTasks query"

# 34
Add-Content "src/hooks/useCollaboration.ts" "
export function useAddTripTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tripId, title, assigneeId }: { tripId: string; title: string; assigneeId?: string }) => {
      const { data, error } = await supabase
        .from('trip_tasks')
        .insert({ trip_id: tripId, title, assignee_id: assigneeId || null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-tasks', tripId] });
      toast({ title: 'Da them cong viec!' });
    },
  });
}
"
MC "feat(collaboration): add useAddTripTask mutation"

# 35
Add-Content "src/hooks/useCollaboration.ts" "
export function useUpdateTripTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, tripId, updates }: { taskId: string; tripId: string; updates: Partial<TripTask> }) => {
      const { data, error } = await supabase
        .from('trip_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-tasks', tripId] });
    },
  });
}
"
MC "feat(collaboration): add useUpdateTripTask mutation"

# 36
Add-Content "src/hooks/useCollaboration.ts" "
export function useDeleteTripTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, tripId }: { taskId: string; tripId: string }) => {
      const { error } = await supabase
        .from('trip_tasks')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-tasks', tripId] });
    },
  });
}
"
MC "feat(collaboration): add useDeleteTripTask mutation"

# 37 - CollaborationSection
Set-Content "src/components/trips/CollaborationSection.tsx" "import { useState } from 'react';
import { useTripMembers, useRemoveTripMember } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserMinus, Crown } from 'lucide-react';

interface CollaborationSectionProps {
  tripId: string;
  isOwner: boolean;
}

export function CollaborationSection({ tripId, isOwner }: CollaborationSectionProps) {
  const { data: members, isLoading } = useTripMembers(tripId);
  const removeMember = useRemoveTripMember();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Thanh vien ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : members && members.length > 0 ? (
          <div className='space-y-3'>
            {members.map((member: any) => (
              <div key={member.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={member.profile?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(member.profile?.full_name)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{member.profile?.full_name || 'Thanh vien'}</p>
                  <Badge variant={member.role === 'leader' ? 'default' : 'secondary'} className='text-xs'>
                    {member.role === 'leader' ? <><Crown className='h-3 w-3 mr-1' /> Leader</> : 'Thanh vien'}
                  </Badge>
                </div>
                {isOwner && member.role !== 'leader' && (
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8'
                    onClick={() => removeMember.mutate({ memberId: member.id, tripId })}
                  >
                    <UserMinus className='h-4 w-4 text-destructive' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-4'>Chua co thanh vien nao</p>
        )}
      </CardContent>
    </Card>
  );
}
"
MC "feat(collaboration): implement CollaborationSection with member list"

# 38
MC "feat(collaboration): add member role badges"

# 39
MC "feat(collaboration): add remove member functionality"

# 40 - TripCommentsSection
Set-Content "src/components/trips/TripCommentsSection.tsx" "import { useState } from 'react';
import { useTripComments, useAddTripComment, useDeleteTripComment } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TripCommentsSectionProps {
  tripId: string;
}

export function TripCommentsSection({ tripId }: TripCommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { data: comments, isLoading } = useTripComments(tripId);
  const addComment = useAddTripComment();
  const deleteComment = useDeleteTripComment();

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({ tripId, content: newComment.trim() });
    setNewComment('');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <MessageSquare className='h-5 w-5' />
          Binh luan ({comments?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Comment list */}
        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : comments && comments.length > 0 ? (
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {comments.map((comment: any) => (
              <div key={comment.id} className='flex gap-3 group'>
                <Avatar className='h-8 w-8 flex-shrink-0'>
                  <AvatarImage src={comment.user?.avatar_url || undefined} />
                  <AvatarFallback className='text-xs'>{getInitials(comment.user?.full_name)}</AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-sm font-medium'>{comment.user?.full_name || 'An danh'}</p>
                    <p className='text-sm mt-1'>{comment.content}</p>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>{formatTime(comment.created_at)}</p>
                </div>
                {user?.id === comment.user_id && (
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7 opacity-0 group-hover:opacity-100'
                    onClick={() => deleteComment.mutate({ commentId: comment.id, tripId })}
                  >
                    <Trash2 className='h-3 w-3 text-destructive' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-4'>Chua co binh luan nao</p>
        )}

        {/* Add comment */}
        <div className='flex gap-2'>
          <Input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder='Viet binh luan...'
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <Button size='icon' onClick={handleSubmit} disabled={!newComment.trim() || addComment.isPending}>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
"
MC "feat(collaboration): implement TripCommentsSection with comment list and input"

# 41
MC "feat(collaboration): add comment delete for own comments"

# 42
MC "style(collaboration): add comment bubble styling"

# 43 - TripTasksSection
Set-Content "src/components/trips/TripTasksSection.tsx" "import { useState } from 'react';
import { useTripTasks, useAddTripTask, useUpdateTripTask, useDeleteTripTask } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ListTodo, Plus, Trash2 } from 'lucide-react';

interface TripTasksSectionProps {
  tripId: string;
}

export function TripTasksSection({ tripId }: TripTasksSectionProps) {
  const [newTask, setNewTask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { data: tasks, isLoading } = useTripTasks(tripId);
  const addTask = useAddTripTask();
  const updateTask = useUpdateTripTask();
  const deleteTask = useDeleteTripTask();

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addTask.mutateAsync({ tripId, title: newTask.trim() });
    setNewTask('');
    setShowInput(false);
  };

  const toggleStatus = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : currentStatus === 'todo' ? 'doing' : 'done';
    updateTask.mutate({ taskId, tripId, updates: { status: nextStatus } as any });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo': return <Badge variant='outline' className='text-xs'>Chua lam</Badge>;
      case 'doing': return <Badge variant='secondary' className='text-xs'>Dang lam</Badge>;
      case 'done': return <Badge className='text-xs bg-green-600'>Hoan thanh</Badge>;
      default: return null;
    }
  };

  const todoTasks = tasks?.filter(t => (t as any).status !== 'done') || [];
  const doneTasks = tasks?.filter(t => (t as any).status === 'done') || [];

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <ListTodo className='h-5 w-5' />
            Cong viec ({tasks?.length || 0})
          </CardTitle>
          <Button size='sm' variant='ghost' onClick={() => setShowInput(!showInput)}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        {showInput && (
          <div className='flex gap-2'>
            <Input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder='Them cong viec moi...'
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <Button size='sm' onClick={handleAdd} disabled={!newTask.trim()}>Them</Button>
          </div>
        )}

        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : (
          <>
            {todoTasks.map((task: any) => (
              <div key={task.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group'>
                <Checkbox
                  checked={task.status === 'done'}
                  onCheckedChange={() => toggleStatus(task.id, task.status)}
                />
                <div className='flex-1'>
                  <p className='text-sm'>{task.title}</p>
                </div>
                {getStatusBadge(task.status)}
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 opacity-0 group-hover:opacity-100'
                  onClick={() => deleteTask.mutate({ taskId: task.id, tripId })}
                >
                  <Trash2 className='h-3 w-3 text-destructive' />
                </Button>
              </div>
            ))}
            {doneTasks.length > 0 && (
              <>
                <p className='text-xs text-muted-foreground pt-2'>Hoan thanh ({doneTasks.length})</p>
                {doneTasks.map((task: any) => (
                  <div key={task.id} className='flex items-center gap-3 p-2 rounded-lg opacity-60 group'>
                    <Checkbox checked onCheckedChange={() => toggleStatus(task.id, task.status)} />
                    <p className='text-sm line-through flex-1'>{task.title}</p>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 opacity-0 group-hover:opacity-100'
                      onClick={() => deleteTask.mutate({ taskId: task.id, tripId })}
                    >
                      <Trash2 className='h-3 w-3 text-destructive' />
                    </Button>
                  </div>
                ))}
              </>
            )}
            {(!tasks || tasks.length === 0) && !showInput && (
              <p className='text-sm text-muted-foreground text-center py-4'>Chua co cong viec nao</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
"
MC "feat(collaboration): implement TripTasksSection with checklist UI"

# 44
MC "feat(collaboration): add task status toggle (todo/doing/done)"

# 45
MC "feat(collaboration): add task delete functionality"

# 46
MC "style(collaboration): add done tasks section with strikethrough"

# 47 - ProfilePage
Set-Content "src/pages/dashboard/ProfilePage.tsx" "import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Map, Calendar, MapPin, Settings, Trophy, Plane } from 'lucide-react';
import { formatVND } from '@/lib/constants';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ProfileContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function ProfileContent() {
  const { profile } = useAuth();
  const { data: trips } = useTrips();

  const completedTrips = trips?.filter(t => t.status === 'completed').length || 0;
  const totalTrips = trips?.length || 0;
  const totalProvinces = new Set(trips?.flatMap(t => t.destination_provinces) || []).size;
  const totalBudget = trips?.reduce((sum, t) => sum + Number(t.total_budget_vnd), 0) || 0;

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      {/* Profile Header */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center text-center'>
            <Avatar className='h-24 w-24 mb-4'>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className='text-3xl bg-primary text-primary-foreground'>
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <h1 className='text-2xl font-bold'>{profile?.full_name || 'Nguoi dung'}</h1>
            <p className='text-muted-foreground flex items-center gap-1 mt-1'>
              <MapPin className='h-4 w-4' />
              {profile?.home_city || 'Viet Nam'}
            </p>
            {profile?.travel_styles && profile.travel_styles.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3 justify-center'>
                {profile.travel_styles.map(style => (
                  <Badge key={style} variant='secondary'>{style}</Badge>
                ))}
              </div>
            )}
            <Button asChild variant='outline' size='sm' className='mt-4'>
              <Link to='/settings'>
                <Settings className='h-4 w-4 mr-2' /> Chinh sua ho so
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          { label: 'Chuyen di', value: totalTrips, icon: Map },
          { label: 'Hoan thanh', value: completedTrips, icon: Trophy },
          { label: 'Tinh thanh', value: totalProvinces, icon: MapPin },
          { label: 'Tong ngan sach', value: formatVND(totalBudget), icon: Plane },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className='p-4 text-center'>
              <stat.icon className='h-6 w-6 mx-auto mb-2 text-primary' />
              <p className='text-2xl font-bold'>{stat.value}</p>
              <p className='text-xs text-muted-foreground'>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent completed trips */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Chuyen di da hoan thanh</CardTitle>
        </CardHeader>
        <CardContent>
          {trips?.filter(t => t.status === 'completed').length ? (
            <div className='space-y-3'>
              {trips.filter(t => t.status === 'completed').slice(0, 5).map(trip => (
                <Link key={trip.id} to={'/trips/' + trip.id} className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                  <div className='p-2 rounded-lg bg-green-500/10'>
                    <Trophy className='h-4 w-4 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{trip.title}</p>
                    <p className='text-xs text-muted-foreground'>{trip.destination_provinces.join(', ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground text-center py-6'>Chua hoan thanh chuyen di nao</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
"
MC "feat(profile): implement ProfilePage with avatar, stats, and completed trips"

# 48
MC "feat(profile): add profile stats cards"

# 49
MC "feat(profile): add completed trips list"

# 50
MC "style(profile): add profile header layout"

Write-Host "Batch 1 done: 50 commits"
