'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/upload';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (!data.user?.email_confirmed_at) {
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else if (msg.includes('Email not confirmed')) {
          setError('Please verify your email before logging in.');
        } else {
          setError(msg || 'Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#2e3192] flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2e3192]">ScholarSync</span>
          </Link>
          <h2 className="text-gray-500 text-sm mt-2">Sign in to your account</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e8eaf0]">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#e0e0e0] px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white transition"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#e0e0e0] px-4 py-3 pr-11 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2e3192] text-white py-3 rounded-lg shadow-lg hover:bg-[#1b1f5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#f0f0f0]">
            <Link
              href="/forgot-password"
              className="text-sm text-[#2e3192] hover:underline font-medium"
            >
              Forgot password?
            </Link>
            <span className="text-sm text-gray-500">
              No account?{' '}
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                className="text-[#e94f37] font-semibold hover:underline"
              >
                Sign up free
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginFormFallback = () => (
  <div className="flex items-center justify-center py-16 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#e8eaf0] animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-40 mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-11 bg-gray-100 rounded-lg" />
        <div className="h-11 bg-gray-100 rounded-lg" />
        <div className="h-11 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
