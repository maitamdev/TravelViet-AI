import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Bell, Shield, X } from 'lucide-react';
import { VIETNAM_PROVINCES, TRAVEL_STYLES } from '@/lib/constants';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function SettingsContent() {
  const { profile, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    home_city: profile?.home_city || '',
    travel_styles: profile?.travel_styles || [],
    budget_min_vnd: profile?.budget_min_vnd || 0,
    budget_max_vnd: profile?.budget_max_vnd || 10000000,
    crowd_tolerance: profile?.crowd_tolerance || 3,
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(formData);
    setSaving(false);

    if (error) {
      toast({
        title: 'Lỗi cập nhật',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Đã lưu thay đổi',
        description: 'Thông tin cá nhân đã được cập nhật.',
      });
    }
  };

  const toggleStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      travel_styles: prev.travel_styles.includes(style)
        ? prev.travel_styles.filter(s => s !== style)
        : [...prev.travel_styles, style],
    }));
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và tùy chọn của bạn
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Sở thích
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ảnh đại diện được lấy từ tài khoản email của bạn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="home_city">Thành phố bạn đang sống</Label>
                <select
                  id="home_city"
                  value={formData.home_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, home_city: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Chọn thành phố</option>
                  {VIETNAM_PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          {/* Travel Styles */}
          <Card>
            <CardHeader>
              <CardTitle>Phong cách du lịch</CardTitle>
              <CardDescription>Chọn các phong cách du lịch bạn yêu thích</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map(style => (
                  <Badge
                    key={style}
                    variant={formData.travel_styles.includes(style) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleStyle(style)}
                  >
                    {style}
                    {formData.travel_styles.includes(style) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Ngân sách mặc định</CardTitle>
              <CardDescription>Đặt khoảng ngân sách du lịch ưa thích của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tối thiểu (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.budget_min_vnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min_vnd: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tối đa (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.budget_max_vnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max_vnd: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crowd Tolerance */}
          <Card>
            <CardHeader>
              <CardTitle>Mức độ chịu đựng đông đúc</CardTitle>
              <CardDescription>
                1 = Thích vắng vẻ, 5 = Không ngại đông đúc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[formData.crowd_tolerance]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, crowd_tolerance: value }))}
                  min={1}
                  max={5}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Thích vắng vẻ</span>
                  <span className="font-medium text-foreground">{formData.crowd_tolerance}/5</span>
                  <span>Không ngại đông</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="btn-hero" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
