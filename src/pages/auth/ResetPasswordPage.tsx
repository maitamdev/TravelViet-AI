import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Lỗi', description: 'Mật khẩu xác nhận không khớp', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Lỗi', description: 'Mật khẩu phải có ít nhất 8 ký tự', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast({ title: 'Thành công', description: 'Mật khẩu đã được cập nhật' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toast({ title: 'Lỗi', description: err.message || 'Không thể đặt lại mật khẩu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Đặt lại mật khẩu thành công!</h2>
            <p className="text-muted-foreground">Đang chuyển hướng về trang đăng nhập...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-lantern">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Nhập mật khẩu mới cho tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới" required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Đang xử lý...</> : 'Đặt lại mật khẩu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}