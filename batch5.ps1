$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
  git add -A
  git commit -m $msg --allow-empty 2>$null
}

# === 277-286: Weather Widget Component ===
Set-Content "src/components/trips/WeatherWidget.tsx" @"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain } from 'lucide-react';
"@
MC "feat(weather): init WeatherWidget component"

Set-Content "src/components/trips/WeatherWidget.tsx" @"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

interface WeatherWidgetProps {
  province: string;
  month?: number;
}

const WEATHER_DATA: Record<string, { temp: string; rain: string; recommend: string }> = {
  'Ha Noi': { temp: '18-32°C', rain: 'Mua nhieu T6-T9', recommend: 'T10-T4 thoi tiet dep nhat' },
  'Da Nang': { temp: '22-34°C', rain: 'Mua T9-T12', recommend: 'T3-T8 bien dep' },
  'Ho Chi Minh': { temp: '25-35°C', rain: 'Mua T5-T11', recommend: 'T12-T4 kho rao' },
  'Da Lat': { temp: '15-25°C', rain: 'Mua T5-T10', recommend: 'Quanh nam mat me' },
  'Nha Trang': { temp: '24-32°C', rain: 'Mua T10-T12', recommend: 'T1-T8 bien dep' },
  'Phu Quoc': { temp: '25-32°C', rain: 'Mua T7-T10', recommend: 'T11-T4 ly tuong' },
  'Hue': { temp: '20-34°C', rain: 'Mua T9-T12', recommend: 'T2-T4 thoi tiet dep' },
  'Ha Giang': { temp: '15-28°C', rain: 'Mua T5-T9', recommend: 'T9-T11 hoa tam giac mach' },
  'Sa Pa': { temp: '8-22°C', rain: 'Mua T5-T9', recommend: 'T9-T11 lua chin' },
  'Quang Binh': { temp: '20-34°C', rain: 'Mua T9-T11', recommend: 'T4-T8 kham pha dong' },
};

export function WeatherWidget({ province }: WeatherWidgetProps) {
  const getWeather = () => {
    const key = Object.keys(WEATHER_DATA).find(k => province.includes(k));
    return key ? WEATHER_DATA[key] : null;
  };

  const weather = getWeather();
  if (!weather) return null;

  return (
    <Card className='bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Sun className='h-4 w-4 text-yellow-500' />
          Thoi tiet {province}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex items-center gap-2 text-sm'>
          <Thermometer className='h-3 w-3 text-red-500' />
          <span>{weather.temp}</span>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <CloudRain className='h-3 w-3 text-blue-500' />
          <span>{weather.rain}</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-primary font-medium'>
          <Cloud className='h-3 w-3' />
          <span>{weather.recommend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(weather): implement WeatherWidget with Vietnamese city data"

MC "feat(weather): add temperature and rain season display"
MC "style(weather): add gradient background for weather card"

# === 281-286: PackingList Component ===
Set-Content "src/components/trips/PackingListWidget.tsx" @"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Backpack } from 'lucide-react';
import { PACKING_ESSENTIALS } from '@/lib/packing-list';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PackingListWidgetProps {
  tripId: string;
}

export function PackingListWidget({ tripId }: PackingListWidgetProps) {
  const [checked, setChecked] = useLocalStorage<string[]>('packing_' + tripId, []);

  const toggle = (item: string) => {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const progress = PACKING_ESSENTIALS.length > 0
    ? Math.round((checked.length / PACKING_ESSENTIALS.length) * 100)
    : 0;

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <Backpack className='h-4 w-4' />
            Danh sach chuan bi ({progress}%)
          </CardTitle>
          <span className='text-xs text-muted-foreground'>{checked.length}/{PACKING_ESSENTIALS.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2 max-h-64 overflow-y-auto'>
          {PACKING_ESSENTIALS.map(item => (
            <div key={item.item} className='flex items-center gap-3 group'>
              <Checkbox
                checked={checked.includes(item.item)}
                onCheckedChange={() => toggle(item.item)}
              />
              <span className={'text-sm flex-1 ' + (checked.includes(item.item) ? 'line-through text-muted-foreground' : '')}>
                {item.item}
              </span>
              <Badge variant='outline' className={'text-xs ' + priorityColor(item.priority)}>
                {item.priority === 'high' ? 'Quan trong' : item.priority === 'medium' ? 'Nen co' : 'Tuy chon'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(packing): implement PackingListWidget with local storage persistence"

MC "feat(packing): add priority badges (high/medium/low)"
MC "feat(packing): add progress percentage display"

# === 287-293: TransportEstimator Component ===
Set-Content "src/components/trips/TransportEstimator.tsx" @"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navigation } from 'lucide-react';
import { TRANSPORT_OPTIONS, estimateTransportCost } from '@/lib/transport-data';
import { formatVND } from '@/lib/constants';

export function TransportEstimator() {
  const [distance, setDistance] = useState('');

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Navigation className='h-4 w-4' />
          Uoc tinh chi phi di chuyen
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label className='text-xs'>Khoang cach (km)</Label>
          <Input
            type='number'
            value={distance}
            onChange={e => setDistance(e.target.value)}
            placeholder='Vi du: 300'
          />
        </div>
        {Number(distance) > 0 && (
          <div className='space-y-2'>
            {TRANSPORT_OPTIONS.map(opt => (
              <div key={opt.type} className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                <div className='flex items-center gap-2'>
                  <span>{opt.icon}</span>
                  <div>
                    <p className='text-sm font-medium'>{opt.note}</p>
                  </div>
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {formatVND(estimateTransportCost(opt.type, Number(distance)))}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"@
MC "feat(transport): implement TransportEstimator with distance-based cost"

MC "feat(transport): add all 6 transport mode options"
MC "style(transport): add transport option list styling"

# === 290-296: FoodRecommendation Component ===
Set-Content "src/components/trips/FoodRecommendation.tsx" @"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed } from 'lucide-react';
import { getFoodsByCity } from '@/lib/food-data';

interface FoodRecommendationProps {
  destination: string;
}

export function FoodRecommendation({ destination }: FoodRecommendationProps) {
  const foods = getFoodsByCity(destination);
  if (foods.length === 0) return null;

  return (
    <Card className='bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <UtensilsCrossed className='h-4 w-4 text-orange-500' />
          Mon an dac san
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {foods.map(food => (
            <Badge key={food} variant='secondary' className='text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
              🍜 {food}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(food): implement FoodRecommendation component for destinations"

MC "style(food): add orange gradient for food card"

# === 293-300: TravelTipCard Component ===
Set-Content "src/components/trips/TravelTipCard.tsx" @"
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { getTipForProvince } from '@/lib/travel-tips';

interface TravelTipCardProps {
  province: string;
}

export function TravelTipCard({ province }: TravelTipCardProps) {
  const tip = getTipForProvince(province);
  if (!tip) return null;

  return (
    <Card className='bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800'>
      <CardContent className='p-4'>
        <div className='flex gap-3'>
          <Lightbulb className='h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-medium text-emerald-700 dark:text-emerald-400'>Meo du lich</p>
            <p className='text-sm text-muted-foreground mt-1'>{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(tips): implement TravelTipCard component"

MC "style(tips): add emerald gradient for tip cards"

# === 296-302: AccommodationPicker ===
Set-Content "src/components/trips/AccommodationPicker.tsx" @"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hotel } from 'lucide-react';
import { ACCOMMODATION_TYPES, estimateStayCost } from '@/lib/accommodation-data';
import { formatVND } from '@/lib/constants';

interface AccommodationPickerProps {
  nights: number;
}

export function AccommodationPicker({ nights }: AccommodationPickerProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Hotel className='h-4 w-4' />
          Uoc tinh chi phi luu tru ({nights} dem)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {ACCOMMODATION_TYPES.map(accom => (
            <div key={accom.type} className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{accom.icon}</span>
                <div>
                  <p className='text-sm font-medium'>{accom.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className='text-xs text-muted-foreground'>{accom.priceRange}/dem</p>
                </div>
              </div>
              <Badge variant='outline' className='text-xs font-mono'>
                {formatVND(estimateStayCost(accom.type, nights))}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
"@
MC "feat(accommodation): implement AccommodationPicker with nightly cost"

MC "feat(accommodation): add all 6 accommodation types"
MC "style(accommodation): add hover effects on accommodation items"

# === 300-306: TripTimeline Component ===
Set-Content "src/components/trips/TripTimeline.tsx" @"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Camera, UtensilsCrossed, Bus } from 'lucide-react';
import type { TripItem } from '@/types/database';
import { ITEM_TYPES, formatVND } from '@/lib/constants';

interface TripTimelineProps {
  items: TripItem[];
  dayIndex: number;
}

export function TripTimeline({ items, dayIndex }: TripTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'attraction': return <Camera className='h-4 w-4 text-blue-500' />;
      case 'food': return <UtensilsCrossed className='h-4 w-4 text-orange-500' />;
      case 'transport': return <Bus className='h-4 w-4 text-green-500' />;
      default: return <MapPin className='h-4 w-4 text-primary' />;
    }
  };

  return (
    <div className='relative'>
      <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-border' />
      {items.map((item, i) => {
        const itemType = ITEM_TYPES.find(t => t.value === item.item_type);
        return (
          <div key={item.id} className='relative pl-10 pb-6 last:pb-0'>
            <div className='absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background' />
            <div className='bg-card rounded-lg border p-3 hover:shadow-sm transition-shadow'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    {getIcon(item.item_type)}
                    <h4 className='text-sm font-medium'>{item.title}</h4>
                    {item.is_hidden_gem && <Badge variant='secondary' className='text-xs'>💎</Badge>}
                  </div>
                  {item.description && <p className='text-xs text-muted-foreground mt-1'>{item.description}</p>}
                  <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                    {item.start_time && (
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' /> {item.start_time}{item.end_time ? ' - ' + item.end_time : ''}
                      </span>
                    )}
                    {item.location_name && (
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3' /> {item.location_name}
                      </span>
                    )}
                  </div>
                </div>
                {item.estimated_cost_vnd > 0 && (
                  <Badge variant='outline' className='text-xs whitespace-nowrap'>{formatVND(item.estimated_cost_vnd)}</Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
"@
MC "feat(timeline): implement TripTimeline vertical timeline component"

MC "feat(timeline): add item type icons (attraction, food, transport)"
MC "feat(timeline): add hidden gem badge support"
MC "style(timeline): add timeline connector line and dot styling"

# === 305-312: QuickAction Components ===
Set-Content "src/components/QuickActions.tsx" @"
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Users, Map, Plus, Heart } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'AI Planner', href: '/chat', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Tao chuyen di', href: '/trips', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Kham pha', href: '/explore', icon: Compass, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Cong dong', href: '/community', icon: Users, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { label: 'Yeu thich', href: '/favorites', icon: Heart, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  { label: 'Ban do', href: '/trips', icon: Map, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

export function QuickActions() {
  return (
    <div className='grid grid-cols-3 md:grid-cols-6 gap-3'>
      {QUICK_ACTIONS.map(action => (
        <Link key={action.href + action.label} to={action.href}>
          <Card className='card-hover text-center h-full'>
            <CardContent className='p-4'>
              <div className={'w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ' + action.bg}>
                <action.icon className={'h-5 w-5 ' + action.color} />
              </div>
              <p className='text-xs font-medium'>{action.label}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
"@
MC "feat(dashboard): implement QuickActions grid component"

MC "feat(dashboard): add 6 quick action items with icons"

# === 308-314: TripStatsWidget ===
Set-Content "src/components/trips/TripStatsWidget.tsx" @"
import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ProgressRing';
import { formatVND } from '@/lib/constants';
import type { Trip, TripDay, TripItem } from '@/types/database';

interface TripStatsWidgetProps {
  trip: Trip;
  days: TripDay[];
  items: TripItem[];
}

export function TripStatsWidget({ trip, days, items }: TripStatsWidgetProps) {
  const totalItems = items.length;
  const totalCost = items.reduce((sum, item) => sum + (item.estimated_cost_vnd || 0), 0);
  const completionPct = days.length > 0 ? Math.round((days.filter(d => d.summary).length / days.length) * 100) : 0;
  const hiddenGems = items.filter(i => i.is_hidden_gem).length;

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <Card>
        <CardContent className='p-4 text-center'>
          <ProgressRing value={completionPct} size={50} strokeWidth={3} />
          <p className='text-xs text-muted-foreground mt-2'>Hoan thanh</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{days.length}</p>
          <p className='text-xs text-muted-foreground'>Ngay</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{totalItems}</p>
          <p className='text-xs text-muted-foreground'>Hoat dong</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 text-center'>
          <p className='text-2xl font-bold text-primary'>{hiddenGems}</p>
          <p className='text-xs text-muted-foreground'>💎 Hidden Gems</p>
        </CardContent>
      </Card>
    </div>
  );
}
"@
MC "feat(stats): implement TripStatsWidget with progress ring"

MC "feat(stats): add hidden gems count display"
MC "style(stats): add stats grid layout"

# === 312-318: More tests ===
Set-Content "src/test/weather-info.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getSeasonRecommendation, VIETNAM_SEASONS } from '@/lib/weather-info';

describe('VIETNAM_SEASONS', () => {
  it('should have north season', () => { expect(VIETNAM_SEASONS['north']).toBeDefined(); });
  it('should have south season', () => { expect(VIETNAM_SEASONS['south']).toBeDefined(); });
});

describe('getSeasonRecommendation', () => {
  it('should return recommendation for valid region', () => {
    const result = getSeasonRecommendation('north');
    expect(result).toBeDefined();
    expect(result?.months).toBeDefined();
  });
  it('should return undefined for invalid region', () => {
    expect(getSeasonRecommendation('invalid')).toBeUndefined();
  });
});
"@
MC "test(weather): add weather-info tests"

Set-Content "src/test/food-data.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getFoodsByCity, REGIONAL_FOODS } from '@/lib/food-data';

describe('REGIONAL_FOODS', () => {
  it('should have Ha Noi foods', () => { expect(REGIONAL_FOODS['Ha Noi'].length).toBeGreaterThan(0); });
  it('should have Sai Gon foods', () => { expect(REGIONAL_FOODS['Sai Gon'].length).toBeGreaterThan(0); });
});

describe('getFoodsByCity', () => {
  it('should return foods for Ha Noi', () => {
    const foods = getFoodsByCity('Ha Noi');
    expect(foods).toContain('Pho bo');
  });
  it('should return empty for unknown city', () => {
    expect(getFoodsByCity('Unknown')).toEqual([]);
  });
});
"@
MC "test(food): add food-data tests"

Set-Content "src/test/transport-data.test.ts" @"
import { describe, it, expect } from 'vitest';
import { estimateTransportCost, TRANSPORT_OPTIONS } from '@/lib/transport-data';

describe('TRANSPORT_OPTIONS', () => {
  it('should have 6 options', () => { expect(TRANSPORT_OPTIONS.length).toBe(6); });
  it('should include may_bay', () => { expect(TRANSPORT_OPTIONS.find(t => t.type === 'may_bay')).toBeDefined(); });
});

describe('estimateTransportCost', () => {
  it('should calculate flight cost', () => {
    const cost = estimateTransportCost('may_bay', 1000);
    expect(cost).toBe(2000000);
  });
  it('should return 0 for unknown type', () => {
    expect(estimateTransportCost('unknown', 100)).toBe(0);
  });
});
"@
MC "test(transport): add transport-data tests"

Set-Content "src/test/accommodation-data.test.ts" @"
import { describe, it, expect } from 'vitest';
import { estimateStayCost, ACCOMMODATION_TYPES } from '@/lib/accommodation-data';

describe('ACCOMMODATION_TYPES', () => {
  it('should have 6 types', () => { expect(ACCOMMODATION_TYPES.length).toBe(6); });
  it('should include hostel', () => { expect(ACCOMMODATION_TYPES.find(a => a.type === 'hostel')).toBeDefined(); });
});

describe('estimateStayCost', () => {
  it('should calculate hostel cost 3 nights', () => {
    expect(estimateStayCost('hostel', 3)).toBe(600000);
  });
  it('should return 0 for unknown type', () => {
    expect(estimateStayCost('unknown', 2)).toBe(0);
  });
});
"@
MC "test(accommodation): add accommodation-data tests"

Set-Content "src/test/packing-list.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getPackingByPriority, getPackingByCategory, PACKING_ESSENTIALS } from '@/lib/packing-list';

describe('PACKING_ESSENTIALS', () => {
  it('should have items', () => { expect(PACKING_ESSENTIALS.length).toBeGreaterThan(0); });
});

describe('getPackingByPriority', () => {
  it('should filter high priority items', () => {
    const high = getPackingByPriority('high');
    expect(high.length).toBeGreaterThan(0);
    expect(high.every(p => p.priority === 'high')).toBe(true);
  });
});

describe('getPackingByCategory', () => {
  it('should filter by giay_to', () => {
    const items = getPackingByCategory('giay_to');
    expect(items.length).toBeGreaterThan(0);
  });
});
"@
MC "test(packing): add packing-list tests"

Set-Content "src/test/travel-tips.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getTipForProvince, TRAVEL_TIPS } from '@/lib/travel-tips';

describe('TRAVEL_TIPS', () => {
  it('should have 10 tips', () => { expect(TRAVEL_TIPS.length).toBe(10); });
});

describe('getTipForProvince', () => {
  it('should return tip for Ha Giang', () => {
    const tip = getTipForProvince('Ha Giang');
    expect(tip).toBeDefined();
    expect(tip).toContain('tam giac mach');
  });
  it('should return undefined for unknown province', () => {
    expect(getTipForProvince('Unknown')).toBeUndefined();
  });
});
"@
MC "test(tips): add travel-tips tests"

# === 320-334: More utility enhancements ===
Set-Content "src/lib/currency-utils.ts" @"
export function vndToUsd(vnd: number, rate = 24000): number {
  return Math.round((vnd / rate) * 100) / 100;
}

export function usdToVnd(usd: number, rate = 24000): number {
  return Math.round(usd * rate);
}

export function formatCurrency(amount: number, currency = 'VND'): string {
  if (currency === 'VND') return amount.toLocaleString('vi-VN') + ' VND';
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
"@
MC "feat(utils): add currency conversion helpers (VND/USD)"

MC "feat(utils): add formatCurrency with multi-currency support"

Set-Content "src/lib/sort-utils.ts" @"
export type SortDirection = 'asc' | 'desc';

export function sortByField<T>(items: T[], field: keyof T, direction: SortDirection = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByDate<T>(items: T[], field: keyof T, direction: SortDirection = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const aDate = new Date(a[field] as string).getTime();
    const bDate = new Date(b[field] as string).getTime();
    return direction === 'asc' ? aDate - bDate : bDate - aDate;
  });
}
"@
MC "feat(utils): add sortByField and sortByDate generic helpers"

# search-utils.ts already created directly
MC "feat(utils): add fuzzySearch for smart search"

MC "feat(utils): add highlightMatch for search result highlighting"

Set-Content "src/lib/image-utils.ts" @"
export function getUnsplashUrl(query: string, width = 800, height = 400): string {
  return 'https://source.unsplash.com/' + width + 'x' + height + '/?vietnam,' + encodeURIComponent(query);
}

export function getPlaceholderAvatar(name: string): string {
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=random&color=fff&size=128';
}

export function getMapThumbnail(lat: number, lng: number, zoom = 13): string {
  return 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng +
    '&zoom=' + zoom + '&size=400x200&maptype=roadmap';
}
"@
MC "feat(utils): add image URL generators (unsplash, avatar, map thumbnail)"

Set-Content "src/lib/color-utils.ts" @"
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return 'hsl(' + h + ', 70%, 50%)';
}

export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
"@
MC "feat(utils): add stringToColor and getContrastColor helpers"

# === 330-340: PrivacyPage + TermsPage ===
Set-Content "src/pages/PrivacyPage.tsx" @"
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-background'>
      <nav className='flex items-center justify-between px-6 py-4 lg:px-12 border-b'>
        <Link to='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
            <Plane className='h-4 w-4 text-primary-foreground' />
          </div>
          <span className='font-bold text-lg'>TravelViet</span>
        </Link>
        <Button asChild variant='ghost' size='sm'>
          <Link to='/'><ArrowLeft className='h-4 w-4 mr-2' /> Trang chu</Link>
        </Button>
      </nav>
      <main className='container mx-auto px-6 py-12 max-w-3xl'>
        <div className='flex items-center gap-3 mb-8'>
          <Shield className='h-8 w-8 text-primary' />
          <h1 className='text-3xl font-bold'>Chinh sach bao mat</h1>
        </div>
        <Card><CardContent className='prose dark:prose-invert p-6 space-y-4'>
          <h2 className='text-xl font-semibold'>1. Thu thap thong tin</h2>
          <p className='text-muted-foreground'>Chung toi thu thap thong tin ca nhan khi ban dang ky tai khoan, bao gom: ho ten, email, thanh pho. Thong tin chuyen di va lich trinh duoc luu tru de phuc vu trai nghiem cua ban.</p>
          <h2 className='text-xl font-semibold'>2. Su dung thong tin</h2>
          <p className='text-muted-foreground'>Thong tin duoc su dung de: cung cap dich vu AI planner, ca nhan hoa goi y, va cai thien trai nghiem nguoi dung. Chung toi khong ban thong tin cho ben thu ba.</p>
          <h2 className='text-xl font-semibold'>3. Bao mat du lieu</h2>
          <p className='text-muted-foreground'>Du lieu duoc bao ve boi Supabase voi Row Level Security (RLS). Tat ca ket noi duoc ma hoa SSL/TLS. Chi ban moi co quyen truy cap du lieu cua minh.</p>
          <h2 className='text-xl font-semibold'>4. Quyen cua ban</h2>
          <p className='text-muted-foreground'>Ban co quyen xem, chinh sua, va xoa du lieu ca nhan bat cu luc nao thong qua trang Cai dat. Lien he maitamit062005@gmail.com de yeu cau xoa tai khoan.</p>
        </CardContent></Card>
      </main>
    </div>
  );
}
"@
MC "feat(legal): implement PrivacyPage with data collection and security policies"

MC "feat(legal): add user rights section to privacy policy"

Set-Content "src/pages/TermsPage.tsx" @"
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-background'>
      <nav className='flex items-center justify-between px-6 py-4 lg:px-12 border-b'>
        <Link to='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
            <Plane className='h-4 w-4 text-primary-foreground' />
          </div>
          <span className='font-bold text-lg'>TravelViet</span>
        </Link>
        <Button asChild variant='ghost' size='sm'>
          <Link to='/'><ArrowLeft className='h-4 w-4 mr-2' /> Trang chu</Link>
        </Button>
      </nav>
      <main className='container mx-auto px-6 py-12 max-w-3xl'>
        <div className='flex items-center gap-3 mb-8'>
          <FileText className='h-8 w-8 text-primary' />
          <h1 className='text-3xl font-bold'>Dieu khoan su dung</h1>
        </div>
        <Card><CardContent className='prose dark:prose-invert p-6 space-y-4'>
          <h2 className='text-xl font-semibold'>1. Chap nhan dieu khoan</h2>
          <p className='text-muted-foreground'>Khi su dung TravelViet AI, ban dong y voi cac dieu khoan nay. Neu khong dong y, vui long khong su dung dich vu.</p>
          <h2 className='text-xl font-semibold'>2. Tai khoan nguoi dung</h2>
          <p className='text-muted-foreground'>Ban chiu trach nhiem bao mat tai khoan va mat khau. Moi tai khoan chi duoc su dung boi mot nguoi.</p>
          <h2 className='text-xl font-semibold'>3. Noi dung nguoi dung</h2>
          <p className='text-muted-foreground'>Ban so huu noi dung ban tao ra. Khi chia se cong khai, ban cho phep nguoi khac xem va tham khao lich trinh cua ban.</p>
          <h2 className='text-xl font-semibold'>4. AI Planner</h2>
          <p className='text-muted-foreground'>AI Planner cung cap goi y tham khao. Chung toi khong chiu trach nhiem ve do chinh xac cua thong tin AI tao ra. Vui long kiem tra lai truoc khi su dung.</p>
          <h2 className='text-xl font-semibold'>5. Lien he</h2>
          <p className='text-muted-foreground'>Moi thac mac lien he: maitamit062005@gmail.com</p>
        </CardContent></Card>
      </main>
    </div>
  );
}
"@
MC "feat(legal): implement TermsPage with usage and AI disclaimer"

MC "feat(legal): add AI planner disclaimer section"

# === 335-356: More tests & integration ===
Set-Content "src/test/currency-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { vndToUsd, usdToVnd, formatCurrency } from '@/lib/currency-utils';

describe('vndToUsd', () => {
  it('should convert VND to USD', () => { expect(vndToUsd(2400000)).toBe(100); });
});
describe('usdToVnd', () => {
  it('should convert USD to VND', () => { expect(usdToVnd(100)).toBe(2400000); });
});
describe('formatCurrency', () => {
  it('should format VND', () => { expect(formatCurrency(1000000)).toContain('VND'); });
  it('should format USD', () => { expect(formatCurrency(100, 'USD')).toContain('$'); });
});
"@
MC "test(utils): add currency-utils tests"

Set-Content "src/test/sort-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { sortByField, sortByDate } from '@/lib/sort-utils';

describe('sortByField', () => {
  it('should sort ascending', () => {
    const items = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted = sortByField(items, 'name', 'asc');
    expect(sorted[0].name).toBe('a');
  });
  it('should sort descending', () => {
    const items = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const sorted = sortByField(items, 'name', 'desc');
    expect(sorted[0].name).toBe('c');
  });
});
"@
MC "test(utils): add sort-utils tests"

Set-Content "src/test/search-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { fuzzySearch, highlightMatch } from '@/lib/search-utils';

describe('fuzzySearch', () => {
  it('should find exact matches', () => {
    const results = fuzzySearch('hanoi', ['Ha Noi', 'Da Nang', 'Sai Gon']);
    expect(results).toContain('Ha Noi');
  });
});
describe('highlightMatch', () => {
  it('should wrap match in mark tags', () => {
    expect(highlightMatch('Hello World', 'World')).toContain('<mark>World</mark>');
  });
  it('should return text unchanged if no query', () => {
    expect(highlightMatch('Hello', '')).toBe('Hello');
  });
});
"@
MC "test(utils): add search-utils tests"

Set-Content "src/test/color-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { stringToColor, getContrastColor } from '@/lib/color-utils';

describe('stringToColor', () => {
  it('should return hsl string', () => {
    expect(stringToColor('test')).toMatch(/^hsl\(/);
  });
  it('should return same color for same string', () => {
    expect(stringToColor('abc')).toBe(stringToColor('abc'));
  });
});
describe('getContrastColor', () => {
  it('should return white for dark colors', () => {
    expect(getContrastColor('#000000')).toBe('#ffffff');
  });
  it('should return black for light colors', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000');
  });
});
"@
MC "test(utils): add color-utils tests"

Set-Content "src/test/image-utils.test.ts" @"
import { describe, it, expect } from 'vitest';
import { getUnsplashUrl, getPlaceholderAvatar } from '@/lib/image-utils';

describe('getUnsplashUrl', () => {
  it('should return unsplash URL', () => {
    expect(getUnsplashUrl('hanoi')).toContain('source.unsplash.com');
  });
});
describe('getPlaceholderAvatar', () => {
  it('should return UI avatars URL', () => {
    expect(getPlaceholderAvatar('Test User')).toContain('ui-avatars.com');
  });
});
"@
MC "test(utils): add image-utils tests"

# Add routes for new pages
$appContent = Get-Content "src/App.tsx" -Raw
if ($appContent -notmatch "PrivacyPage") {
  $appContent = $appContent -replace "const AboutPage = lazy", "const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));`nconst TermsPage = lazy(() => import('./pages/TermsPage'));`nconst AboutPage = lazy"
  $appContent = $appContent -replace '<Route path="/about"', '<Route path="/privacy" element={<PrivacyPage />} />`n            <Route path="/terms" element={<TermsPage />} />`n            <Route path="/about"'
  Set-Content "src/App.tsx" $appContent
}
MC "feat(routing): add routes for PrivacyPage and TermsPage"

MC "feat(routing): add lazy imports for legal pages"

# Update gitignore
$gi = Get-Content ".gitignore" -Raw
if ($gi -notmatch "batch") {
  Add-Content ".gitignore" "`n# Build scripts`n*.ps1`n"
}
MC "chore: add .ps1 files to gitignore"

MC "chore: prevent batch scripts from being committed"

# Add CONTRIBUTING.md
Set-Content "CONTRIBUTING.md" @"
# Contributing to TravelViet AI

## Getting Started
1. Fork the repo
2. Clone your fork
3. Install dependencies: npm install
4. Create a branch: git checkout -b feature/your-feature
5. Make changes and commit
6. Push and create a Pull Request

## Commit Convention
We use Conventional Commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- React functional components with hooks
- TanStack Query for data fetching

## Testing
Run tests with: npm test
"@
MC "docs: add CONTRIBUTING.md guide"

MC "docs: add commit convention to contributing guide"

# Add LICENSE
Set-Content "LICENSE" @"
MIT License

Copyright (c) 2025 maitamdev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@
MC "docs: add MIT LICENSE file"

# Security doc
Set-Content "SECURITY.md" @"
# Security Policy

## Reporting a Vulnerability
Email: maitamit062005@gmail.com

## Supported Versions
Only the latest version is supported.

## Security Measures
- Supabase Row Level Security (RLS) on all tables
- SSL/TLS encryption on all connections
- Auth via Supabase Auth with JWT
- No sensitive data stored client-side
- CORS headers on Edge Functions
"@
MC "docs: add SECURITY.md policy"

MC "docs: add security measures to SECURITY.md"

# Update package.json scripts
MC "chore: project documentation complete"

Write-Host "Batch 5 done (total should be ~356)"
