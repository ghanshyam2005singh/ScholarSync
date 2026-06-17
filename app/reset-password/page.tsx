'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPasswordForm = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to reset password. Please try again.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <CheckCircle size={56} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#2e3192] mb-3">Password Updated!</h2>
        <p className="text-gray-600 mb-2">Your password has been changed successfully.</p>
        <p className="text-sm text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 rounded w-64 mx-auto" />
        </div>
        <p className="text-gray-500 text-sm mt-6">Verifying your reset link...</p>
        <p className="text-xs text-gray-400 mt-2">
          If this takes too long,{' '}
          <a href="/forgot-password" className="text-[#2e3192] underline">
            request a new link
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-[#e0e7ff] flex items-center justify-center">
          <Lock size={28} className="text-[#2e3192]" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center text-[#2e3192] mb-2">
        Set New Password
      </h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Choose a strong password for your ScholarSync account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e0e0e0] px-4 py-3 pr-11 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white transition"
              required
              autoFocus
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#e0e0e0] px-4 py-3 pr-11 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] text-gray-900 bg-white transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
          className="w-full bg-[#2e3192] text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-[#1b1f5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </>
  );
};

const ResetPasswordFallback = () => (
  <div className="text-center py-8 animate-pulse">
    <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-4" />
    <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
    <div className="h-4 bg-gray-100 rounded w-64 mx-auto" />
  </div>
);

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="flex items-center justify-center pt-16 pb-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#e0e0e0]">
          <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
