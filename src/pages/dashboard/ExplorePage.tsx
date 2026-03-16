import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, ArrowRight, Compass, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VIETNAM_PROVINCES } from '@/lib/constants';

const REGIONS: Record<string, string[]> = {
  'Miền Bắc': ['Hà Nội', 'Hạ Long', 'Sapa', 'Ninh Bình', 'Mai Châu', 'Hà Giang', 'Cao Bằng', 'Tam Đảo'],
  'Miền Trung': ['Đà Nẵng', 'Hội An', 'Huế', 'Phong Nha', 'Quy Nhơn', 'Nha Trang', 'Đà Lạt', 'Bà Nà Hills'],
  'Miền Nam': ['TP. Hồ Chí Minh', 'Phú Quốc', 'Vũng Tàu', 'Cần Thơ', 'Mũi Né', 'Côn Đảo', 'Long An', 'Châu Đốc'],
};

const TOP_DESTINATIONS = [
  { name: 'Đà Nẵng', province: 'Đà Nẵng', rating: 4.8, reviews: 2450, image: '🏖️', description: 'Thành phố biển xinh đẹp với Bà Nà Hills và cầu Vàng nổi tiếng' },
  { name: 'Hội An', province: 'Quảng Nam', rating: 4.9, reviews: 3200, image: '🏮', description: 'Phố cổ đèn lồng, ẩm thực đường phố tuyệt vời' },
  { name: 'Sapa', province: 'Lào Cai', rating: 4.7, reviews: 1890, image: '🏔️', description: 'Ruộng bậc thang hùng vĩ và văn hóa dân tộc đặc sắc' },
  { name: 'Phú Quốc', province: 'Kiên Giang', rating: 4.8, reviews: 2100, image: '🌴', description: 'Đảo ngọc với bãi biển trong xanh và hải sản tươi sống' },
  { name: 'Hạ Long', province: 'Quảng Ninh', rating: 4.9, reviews: 4500, image: '🛶', description: 'Di sản UNESCO với hàng nghìn đảo đá vôi kỳ vĩ' },
  { name: 'Đà Lạt', province: 'Lâm Đồng', rating: 4.7, reviews: 2800, image: '🌸', description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm' },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('all');

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return TOP_DESTINATIONS;
    const q = searchQuery.toLowerCase();
    return TOP_DESTINATIONS.filter(
      d => d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredProvinces = useMemo(() => {
    if (activeRegion === 'all') return VIETNAM_PROVINCES;
    const regionNames = REGIONS[activeRegion] || [];
    return VIETNAM_PROVINCES.filter(p =>
      regionNames.some(r => p.toLowerCase().includes(r.toLowerCase()))
    );
  }, [activeRegion]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Compass className="h-8 w-8 text-primary" />
                Khám phá Việt Nam
              </h1>
              <p className="text-muted-foreground mt-1">Tìm kiếm điểm đến hoàn hảo cho chuyến đi tiếp theo</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm điểm đến..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Điểm đến phổ biến
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDestinations.map((dest) => (
                <Card key={dest.name} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{dest.image}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{dest.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{dest.province}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dest.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{dest.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({dest.reviews.toLocaleString()} đánh giá)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Theo vùng miền</h2>
            <Tabs defaultValue="all" onValueChange={setActiveRegion}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                {Object.keys(REGIONS).map((region) => (
                  <TabsTrigger key={region} value={region}>{region}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeRegion} className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {filteredProvinces.map((province) => (
                    <Badge key={province} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {province}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}