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
