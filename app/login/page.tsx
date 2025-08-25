'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

// Separate component for the login form that uses useSearchParams
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/upload';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

      // Check if email is verified
      if (!data.user?.email_confirmed_at) {
        setError('Please verify your email before logging in.');
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid email or password. Please try again.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetSent(false);

    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch {
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  return (
    <div className="flex items-center justify-center pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 mx-4 border border-[#e0e0e0]">
        <h1 className="text-3xl font-bold text-center text-[#2e3192] mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#e0e0e0] p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e0e0e0] p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {resetSent && (
            <p className="text-green-600 text-sm">
              Password reset email sent! Please check your inbox.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e3192] text-white py-3 rounded-lg shadow-lg hover:bg-[#1b1f5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#2e3192] hover:underline text-sm font-semibold"
          >
            Forgot Password?
          </button>
          <span className="text-sm text-gray-600">
            Don&#39;t have an account?{' '}
            <a href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-[#e94f37] font-semibold hover:underline">
              Signup
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

// Loading fallback component
const LoginFormFallback = () => (
  <div className="flex items-center justify-center pt-20">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 mx-4 border border-[#e0e0e0]">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-6 mx-auto w-48"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Main component
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