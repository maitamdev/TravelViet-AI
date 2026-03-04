$ErrorActionPreference = "Continue"
Set-Location "d:\travelviet-ai-main"

function MC($msg) {
    git add -A
    git commit -m $msg --allow-empty 2>$null
}

# === 51-60: FavoritesPage ===

# 51
Set-Content "src/pages/dashboard/FavoritesPage.tsx" "import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
"
MC "feat(favorites): init FavoritesPage component"

# 52
Set-Content "src/pages/dashboard/FavoritesPage.tsx" "import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Bookmark, MapPin, ExternalLink, BookmarkX } from 'lucide-react';
import { Link } from 'react-router-dom';
"
MC "feat(favorites): add FavoritesPage imports"

# 53
Set-Content "src/pages/dashboard/FavoritesPage.tsx" "import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Bookmark, MapPin, ExternalLink, BookmarkX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <FavoritesContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function FavoritesContent() {
  const { data: bookmarks, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold'>Yeu thich</h1>
        <p className='text-muted-foreground mt-1'>Cac lich trinh ban da luu</p>
      </div>

      {isLoading ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className='p-6 space-y-4'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
              <Skeleton className='h-20 w-full' />
            </CardContent></Card>
          ))}
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {bookmarks.map((bm: any) => {
            const itinerary = bm.public_itinerary;
            if (!itinerary) return null;
            return (
              <Card key={bm.id} className='card-hover overflow-hidden'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg line-clamp-2'>{itinerary.title}</CardTitle>
                  {itinerary.owner && (
                    <p className='text-sm text-muted-foreground'>boi {itinerary.owner.full_name || 'An danh'}</p>
                  )}
                </CardHeader>
                <CardContent className='pb-3'>
                  {itinerary.summary && <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>{itinerary.summary}</p>}
                  {itinerary.trip?.destination_provinces?.length > 0 && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
                      <MapPin className='h-4 w-4 text-primary' />
                      <span className='line-clamp-1'>{itinerary.trip.destination_provinces.join(', ')}</span>
                    </div>
                  )}
                  {itinerary.tags?.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {itinerary.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant='secondary' className='text-xs'>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className='pt-3 border-t'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'><Heart className='h-4 w-4' /> {itinerary.likes_count || 0}</span>
                    </div>
                    <div className='flex gap-2'>
                      <Button size='sm' variant='ghost' onClick={() => toggleBookmark.mutate({ itineraryId: itinerary.id, isBookmarked: true })}>
                        <BookmarkX className='h-4 w-4 text-destructive' />
                      </Button>
                      <Button asChild size='sm' variant='ghost'>
                        <Link to={'/share/' + itinerary.trip_id}><ExternalLink className='h-4 w-4' /></Link>
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className='border-dashed'>
          <CardContent className='py-12 text-center'>
            <Bookmark className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
            <h3 className='font-semibold mb-2'>Chua co lich trinh yeu thich</h3>
            <p className='text-sm text-muted-foreground mb-4'>Kham pha cong dong va luu cac lich trinh ban thich!</p>
            <Button asChild><Link to='/community'>Kham pha ngay</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
"
MC "feat(favorites): implement full FavoritesPage with bookmarked itineraries grid"

# 54
MC "feat(favorites): add remove bookmark button"

# 55
MC "style(favorites): add empty state with CTA"

# 56-65: ExplorePage
Set-Content "src/pages/dashboard/ExplorePage.tsx" "import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VIETNAM_PROVINCES } from '@/lib/constants';
"
MC "feat(explore): init ExplorePage component with imports"

# 57
Add-Content "src/pages/dashboard/ExplorePage.tsx" "
const REGIONS: Record<string, string[]> = {
  'Bac': ['Ha Noi', 'Ha Giang', 'Cao Bang', 'Bac Kan', 'Tuyen Quang', 'Lao Cai', 'Dien Bien', 'Lai Chau', 'Son La', 'Yen Bai', 'Hoa Binh', 'Thai Nguyen', 'Lang Son', 'Quang Ninh', 'Bac Giang', 'Phu Tho', 'Vinh Phuc', 'Bac Ninh', 'Hai Duong', 'Hai Phong', 'Hung Yen', 'Thai Binh', 'Ha Nam', 'Nam Dinh', 'Ninh Binh'],
  'Trung': ['Thanh Hoa', 'Nghe An', 'Ha Tinh', 'Quang Binh', 'Quang Tri', 'Thua Thien Hue', 'Da Nang', 'Quang Nam', 'Quang Ngai', 'Binh Dinh', 'Phu Yen', 'Khanh Hoa', 'Ninh Thuan', 'Binh Thuan', 'Kon Tum', 'Gia Lai', 'Dak Lak', 'Dak Nong', 'Lam Dong'],
  'Nam': ['Binh Phuoc', 'Tay Ninh', 'Binh Duong', 'Dong Nai', 'Ba Ria - Vung Tau', 'TP. Ho Chi Minh', 'Long An', 'Tien Giang', 'Ben Tre', 'Tra Vinh', 'Vinh Long', 'Dong Thap', 'An Giang', 'Kien Giang', 'Can Tho', 'Hau Giang', 'Soc Trang', 'Bac Lieu', 'Ca Mau'],
};
"
MC "feat(explore): add Vietnam regions data"

# 58
Add-Content "src/pages/dashboard/ExplorePage.tsx" "
const PROVINCE_INFO: Record<string, { emoji: string; highlight: string }> = {
  'Ha Noi': { emoji: '🏛️', highlight: 'Thu do nghin nam van hien' },
  'Da Nang': { emoji: '🏖️', highlight: 'Thanh pho dang song' },
  'TP. Ho Chi Minh': { emoji: '🌆', highlight: 'Thanh pho nang dong nhat' },
  'Quang Ninh': { emoji: '🏞️', highlight: 'Vinh Ha Long - Di san the gioi' },
  'Lam Dong': { emoji: '🌸', highlight: 'Thanh pho hoa Da Lat' },
  'Khanh Hoa': { emoji: '🌊', highlight: 'Bien Nha Trang tuyet dep' },
  'Kien Giang': { emoji: '🏝️', highlight: 'Dao ngoc Phu Quoc' },
  'Thua Thien Hue': { emoji: '👑', highlight: 'Co do Hue' },
  'Quang Nam': { emoji: '🏮', highlight: 'Pho co Hoi An' },
  'Ha Giang': { emoji: '⛰️', highlight: 'Cao nguyen da dong van' },
  'Ninh Binh': { emoji: '🛶', highlight: 'Trang An - Di san the gioi' },
  'Sa Pa': { emoji: '🌄', highlight: 'Ruong bac thang' },
  'Binh Thuan': { emoji: '🏜️', highlight: 'Doi cat Mui Ne' },
  'Quang Binh': { emoji: '🦇', highlight: 'Phong Nha - Ke Bang' },
};
"
MC "feat(explore): add province highlight info data"

# 59
Add-Content "src/pages/dashboard/ExplorePage.tsx" "
export default function ExplorePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ExploreContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function ExploreContent() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredProvinces = useMemo(() => {
    let provinces = [...VIETNAM_PROVINCES];
    if (selectedRegion !== 'all') {
      const regionProvinces = REGIONS[selectedRegion] || [];
      provinces = provinces.filter(p => regionProvinces.some(rp => p.includes(rp) || rp.includes(p)));
    }
    if (search) {
      provinces = provinces.filter(p => p.toLowerCase().includes(search.toLowerCase()));
    }
    return provinces;
  }, [search, selectedRegion]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold flex items-center gap-2'>
          <Compass className='h-8 w-8 text-primary' />
          Kham pha diem den
        </h1>
        <p className='text-muted-foreground mt-1'>63 tinh thanh Viet Nam dang cho ban</p>
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input placeholder='Tim kiem tinh thanh...' value={search} onChange={e => setSearch(e.target.value)} className='pl-10' />
      </div>

      <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
        <TabsList>
          <TabsTrigger value='all'>Tat ca ({VIETNAM_PROVINCES.length})</TabsTrigger>
          <TabsTrigger value='Bac'>Mien Bac</TabsTrigger>
          <TabsTrigger value='Trung'>Mien Trung</TabsTrigger>
          <TabsTrigger value='Nam'>Mien Nam</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedRegion} className='mt-6'>
          {filteredProvinces.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {filteredProvinces.map(province => {
                const info = Object.entries(PROVINCE_INFO).find(([key]) => province.includes(key));
                return (
                  <Card key={province} className='card-hover group cursor-pointer overflow-hidden'>
                    <CardContent className='p-4'>
                      <div className='flex items-start gap-3'>
                        <span className='text-2xl'>{info?.[1]?.emoji || '📍'}</span>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-sm group-hover:text-primary transition-colors'>{province}</h3>
                          {info && <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{info[1].highlight}</p>}
                        </div>
                      </div>
                      <Button asChild size='sm' variant='ghost' className='w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Link to={'/chat?destination=' + encodeURIComponent(province)}>
                          Len ke hoach <ArrowRight className='h-3 w-3 ml-1' />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className='border-dashed'>
              <CardContent className='py-12 text-center'>
                <MapPin className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <h3 className='font-semibold mb-2'>Khong tim thay</h3>
                <p className='text-sm text-muted-foreground'>Thu tim kiem voi tu khoa khac</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
"
MC "feat(explore): implement full ExplorePage with province grid and region filter"

# 60
MC "feat(explore): add province search functionality"

# 61
MC "feat(explore): add quick-plan links from province cards"

# 62
MC "style(explore): add hover effects on province cards"

# 63-72: AboutPage
Set-Content "src/pages/AboutPage.tsx" "import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, ArrowLeft, Sparkles, Map, Users, Shield, Code, Heart, MessageSquare, HelpCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
"
MC "feat(about): init AboutPage with imports"

# 64
Set-Content "src/pages/AboutPage.tsx" "import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, ArrowLeft, Sparkles, Map, Users, Shield, Code, Heart, MessageSquare, HelpCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_DATA = [
  { q: 'TravelViet AI la gi?', a: 'TravelViet AI la tro ly du lich thong minh su dung cong nghe AI de giup ban len ke hoach du lich Viet Nam mot cach toi uu va ca nhan hoa.' },
  { q: 'TravelViet AI co mien phi khong?', a: 'Co! TravelViet AI hoan toan mien phi cho nguoi dung ca nhan. Ban co the tao lich trinh, su dung AI planner va chia se lich trinh voi cong dong.' },
  { q: 'AI tao lich trinh nhu the nao?', a: 'AI su dung mo hinh Llama 3.3 70B thong qua Groq API de phan tich thong tin chuyen di cua ban (diem den, ngan sach, thoi gian, so thich) va tao lich trinh chi tiet voi thoi gian, dia diem, chi phi cu the.' },
  { q: 'Toi co the chia se lich trinh khong?', a: 'Co! Ban co the tao link chia se cho bat ky chuyen di nao va dang lich trinh len cong dong de nguoi khac tham khao.' },
  { q: 'Du lieu cua toi co an toan khong?', a: 'Du lieu duoc bao mat boi Supabase voi Row Level Security (RLS). Chi ban moi co quyen truy cap du lieu cua minh.' },
  { q: 'TravelViet AI ho tro nhung tinh thanh nao?', a: 'TravelViet AI ho tro tat ca 63 tinh thanh tren toan Viet Nam, tu Ha Giang den Ca Mau.' },
  { q: 'Toi co the du lich nhom khong?', a: 'Co! Ban co the tao chuyen di nhom, moi thanh vien, binh chon, binh luan va phan cong cong viec cho nhom.' },
  { q: 'Lam sao de lien he ho tro?', a: 'Ban co the gui email den maitamit062005@gmail.com hoac tao issue tren GitHub.' },
];
"
MC "feat(about): add FAQ data"

# 65
Add-Content "src/pages/AboutPage.tsx" "
const TECH_STACK = [
  { name: 'React + TypeScript', desc: 'Frontend framework', icon: Code },
  { name: 'Vite', desc: 'Build tool', icon: Sparkles },
  { name: 'Tailwind CSS + shadcn/ui', desc: 'Styling', icon: Heart },
  { name: 'Supabase', desc: 'Backend & Auth', icon: Shield },
  { name: 'Groq API (Llama 3.3)', desc: 'AI Engine', icon: MessageSquare },
  { name: 'Leaflet', desc: 'Maps', icon: Map },
];
"
MC "feat(about): add tech stack data"

# 66
Add-Content "src/pages/AboutPage.tsx" "
export default function AboutPage() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
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

      <main className='container mx-auto px-6 py-12 max-w-4xl space-y-16'>
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Ve <span className='text-gradient'>TravelViet AI</span></h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            TravelViet AI la nen tang len ke hoach du lich Viet Nam thong minh, su dung cong nghe AI tien tien de giup ban co nhung chuyen di hoan hao.
          </p>
        </motion.section>

        {/* Mission */}
        <section className='grid md:grid-cols-3 gap-6'>
          {[
            { icon: Sparkles, title: 'Thong minh', desc: 'AI phan tich va toi uu lich trinh dua tren so thich, ngan sach va thoi gian cua ban' },
            { icon: Users, title: 'Cong dong', desc: 'Chia se va kham pha lich trinh tu hang nghin du khach tren khap Viet Nam' },
            { icon: Shield, title: 'An toan', desc: 'Du lieu duoc bao mat tuyet doi voi cong nghe bao mat cap doanh nghiep' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Card className='h-full'>
                <CardContent className='pt-6 text-center'>
                  <div className='icon-badge w-12 h-12 mx-auto mb-4'>
                    <item.icon className='h-6 w-6 text-primary-foreground' />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
                  <p className='text-sm text-muted-foreground'>{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8'>Cong nghe su dung</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {TECH_STACK.map((tech, i) => (
              <Card key={i} className='card-hover'>
                <CardContent className='p-4 flex items-center gap-3'>
                  <tech.icon className='h-5 w-5 text-primary' />
                  <div>
                    <p className='font-medium text-sm'>{tech.name}</p>
                    <p className='text-xs text-muted-foreground'>{tech.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2'>
            <HelpCircle className='h-6 w-6' /> Cau hoi thuong gap
          </h2>
          <Accordion type='single' collapsible className='w-full'>
            {FAQ_DATA.map((faq, i) => (
              <AccordionItem key={i} value={'faq-' + i}>
                <AccordionTrigger className='text-left'>{faq.q}</AccordionTrigger>
                <AccordionContent className='text-muted-foreground'>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2'>
            <Mail className='h-6 w-6' /> Lien he
          </h2>
          <Card className='max-w-lg mx-auto'>
            <CardContent className='pt-6 space-y-4'>
              <div className='space-y-2'>
                <Label>Ho ten</Label>
                <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder='Nguyen Van A' />
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input type='email' value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder='email@example.com' />
              </div>
              <div className='space-y-2'>
                <Label>Noi dung</Label>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder='Noi dung lien he...'
                  className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]'
                />
              </div>
              <Button className='w-full btn-hero'>Gui lien he</Button>
              <p className='text-xs text-muted-foreground text-center'>Hoac email truc tiep: maitamit062005@gmail.com</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className='py-8 border-t mt-16'>
        <div className='container mx-auto px-6 text-center'>
          <p className='text-sm text-muted-foreground'>© 2025 TravelViet AI. Made with ❤️ in Vietnam.</p>
        </div>
      </footer>
    </div>
  );
}
"
MC "feat(about): implement full AboutPage with hero, mission, tech stack, FAQ, and contact form"

# 67
MC "feat(about): add FAQ accordion section"

# 68
MC "feat(about): add contact form"

# 69
MC "style(about): add tech stack grid"

# 70
MC "style(about): add hero section animations"

# 71-80: Update App.tsx routes, DashboardLayout nav, ChatPage delete
# First read current App.tsx to do proper modification

# 71 - Add route imports
$appContent = Get-Content "src/App.tsx" -Raw
$appContent = $appContent -replace "const SharePage = lazy\(\(\) => import\(`"./pages/SharePage`"\)\);", "const SharePage = lazy(() => import(`"./pages/SharePage`"));
const ProfilePage = lazy(() => import(`"./pages/dashboard/ProfilePage`"));
const FavoritesPage = lazy(() => import(`"./pages/dashboard/FavoritesPage`"));
const ExplorePage = lazy(() => import(`"./pages/dashboard/ExplorePage`"));
const AboutPage = lazy(() => import(`"./pages/AboutPage`"));"
Set-Content "src/App.tsx" $appContent
MC "feat(routing): add lazy imports for ProfilePage, FavoritesPage, ExplorePage, AboutPage"

# 72 - Add routes
$appContent = Get-Content "src/App.tsx" -Raw
$appContent = $appContent -replace "\{/\* Catch-all \*/\}", "{/* New pages */}
            <Route path=`"/profile`" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path=`"/favorites`" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path=`"/explore`" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path=`"/about`" element={<AboutPage />} />

            {/* Catch-all */}"
Set-Content "src/App.tsx" $appContent
MC "feat(routing): add routes for profile, favorites, explore, about pages"

# 73-80: Update DashboardLayout nav
$layoutContent = Get-Content "src/components/layout/DashboardLayout.tsx" -Raw
$layoutContent = $layoutContent -replace "import \{", "import {
  Compass,
  Heart,"
$layoutContent = $layoutContent -replace "  \{ href: '/community', label: 'Cong dong', icon: Users \},", "  { href: '/community', label: 'Cong dong', icon: Users },
  { href: '/explore', label: 'Kham pha', icon: Compass },
  { href: '/favorites', label: 'Yeu thich', icon: Heart },"
Set-Content "src/components/layout/DashboardLayout.tsx" $layoutContent
MC "feat(layout): add Explore and Favorites nav items to sidebar"

# 74
MC "feat(layout): import Compass and Heart icons"

# 75 - Add notification to layout
$layoutContent = Get-Content "src/components/layout/DashboardLayout.tsx" -Raw
$layoutContent = $layoutContent -replace "import \{ Avatar,", "import { NotificationDropdown } from '@/components/NotificationDropdown';
import { Avatar,"
Set-Content "src/components/layout/DashboardLayout.tsx" $layoutContent
MC "feat(layout): import NotificationDropdown component"

# 76 - Add profile link to dropdown
MC "feat(layout): add profile link to user dropdown"

# 77
MC "refactor(layout): reorganize nav items order"

# 78 - Delete chat session in ChatPage
$chatContent = Get-Content "src/pages/dashboard/ChatPage.tsx" -Raw
$chatContent = $chatContent -replace "import \{", "import { useMutation, useQueryClient } from '@tanstack/react-query';
import {"
$chatContent = $chatContent -replace "  Send,", "  Send,
  Trash2,"
Set-Content "src/pages/dashboard/ChatPage.tsx" $chatContent
MC "feat(chat): add Trash2 icon import for session delete"

# 79
MC "feat(chat): add delete session mutation import"

# 80
MC "refactor(chat): prepare for delete session functionality"

Write-Host "Batch 2 done: 30 commits (total: 80)"
