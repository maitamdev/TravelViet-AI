import { AuthForm } from '@/components/auth/AuthForm';
import { GuestGuard } from '@/components/auth/AuthGuard';

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <AuthForm mode="login" />
      </div>
    </GuestGuard>
  );
}
