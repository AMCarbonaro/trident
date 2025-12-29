import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2 font-mono">
            trident
          </h1>
          <p className="text-red-400/70 font-mono">
            &gt; Create your account
          </p>
        </div>

        <Card className="p-8">
          <SignupForm />

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-red-400 hover:text-red-300 font-mono underline"
            >
              &gt; Log in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

