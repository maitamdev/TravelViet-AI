import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Map English error messages to Vietnamese
  const getErrorMessage = (message: string): string => {
    const errorMap: Record<string, string> = {
      'Failed to fetch': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      'Invalid login credentials': 'Email hoặc mật khẩu không đúng.',
      'User already registered': 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.',
      'Email not confirmed': 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.',
      'Invalid email or password': 'Email hoặc mật khẩu không hợp lệ.',
      'Signup requires a valid password': 'Mật khẩu không hợp lệ.',
      'Email rate limit exceeded': 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
      'For security purposes, you can only request this once every 60 seconds': 'Vui lòng đợi 60 giây trước khi thử lại.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key)) return value;
    }
    return message;
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: getErrorMessage(error.message),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Đăng nhập thành công!',
        description: 'Chào mừng bạn quay lại TravelViet',
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'Đăng ký thất bại',
        description: getErrorMessage(error.message),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Đăng ký thành công!',
        description: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
      });
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    const { error } = await resetPassword(data.email);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'Gửi email thất bại',
        description: getErrorMessage(error.message),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Email đã được gửi!',
        description: 'Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.',
      });
    }
  };

  const titles = {
    login: { title: 'Đăng nhập', description: 'Chào mừng bạn quay lại TravelViet' },
    register: { title: 'Đăng ký', description: 'Tạo tài khoản mới để bắt đầu hành trình' },
    'forgot-password': { title: 'Quên mật khẩu', description: 'Nhập email để đặt lại mật khẩu' },
  };

  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl shadow-purple-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-2xl relative z-10">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 animate-in fade-in zoom-in duration-500">
          <img
            src="/logo.png"
            alt="TravelViet Logo"
            className="h-16 w-auto mx-auto"
          />
        </div>
        <CardTitle className="text-3xl font-bold mb-2">
          <span className="text-gradient">{titles[mode].title}</span>
        </CardTitle>
        <CardDescription className="text-base">{titles[mode].description}</CardDescription>
      </CardHeader>

      <CardContent>
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10"
                  {...loginForm.register('email')}
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...loginForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="btn-hero w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Đăng nhập
            </Button>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-11">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline" className="h-11">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="pl-10"
                  {...registerForm.register('fullName')}
                />
              </div>
              {registerForm.formState.errors.fullName && (
                <p className="text-sm text-destructive">{registerForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10"
                  {...registerForm.register('email')}
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...registerForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {registerForm.watch('password') && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${registerForm.watch('password').length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${registerForm.watch('password').length >= 10 && /[A-Z]/.test(registerForm.watch('password')) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${registerForm.watch('password').length >= 12 && /[A-Z]/.test(registerForm.watch('password')) && /[0-9]/.test(registerForm.watch('password')) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {registerForm.watch('password').length < 8 && 'Mật khẩu yếu'}
                    {registerForm.watch('password').length >= 8 && registerForm.watch('password').length < 10 && 'Mật khẩu trung bình'}
                    {registerForm.watch('password').length >= 10 && /[A-Z]/.test(registerForm.watch('password')) && 'Mật khẩu mạnh'}
                    {registerForm.watch('password').length >= 12 && /[A-Z]/.test(registerForm.watch('password')) && /[0-9]/.test(registerForm.watch('password')) && 'Mật khẩu rất mạnh'}
                  </p>
                </div>
              )}

              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10"
                  {...registerForm.register('confirmPassword')}
                />
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="btn-hero w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Đăng ký
            </Button>
          </form>
        )}

        {mode === 'forgot-password' && (
          <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10"
                  {...forgotForm.register('email')}
                />
              </div>
              {forgotForm.formState.errors.email && (
                <p className="text-sm text-destructive">{forgotForm.formState.errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="btn-hero w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Gửi email đặt lại mật khẩu
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {mode === 'login' && (
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        )}
        {mode === 'register' && (
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Đăng nhập
            </Link>
          </p>
        )}
        {mode === 'forgot-password' && (
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline font-medium">
              ← Quay lại đăng nhập
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
