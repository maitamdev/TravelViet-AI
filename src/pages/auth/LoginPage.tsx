import { AuthForm } from '@/components/auth/AuthForm';
import { GuestGuard } from '@/components/auth/AuthGuard';

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <AuthForm mode="login" />
      </div>
    </GuestGuard>
  );
}
