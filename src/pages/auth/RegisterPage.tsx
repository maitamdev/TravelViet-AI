import { AuthForm } from '@/components/auth/AuthForm';
import { GuestGuard } from '@/components/auth/AuthGuard';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center p-4 pattern-lantern">
        <AuthForm mode="register" />
      </div>
    </GuestGuard>
  );
}
