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
