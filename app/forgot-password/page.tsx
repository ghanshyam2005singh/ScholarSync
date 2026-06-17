'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send reset email. Please try again.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="flex items-center justify-center pt-16 pb-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#e0e0e0]">
          {sent ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle size={56} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2e3192] mb-3">Check Your Email</h2>
              <p className="text-gray-600 mb-2">
                We sent a password reset link to
              </p>
              <p className="font-semibold text-gray-800 mb-6">{email}</p>
              <p className="text-sm text-gray-500 mb-8">
                Click the link in the email to reset your password. The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-[#2e3192] hover:underline text-sm font-semibold"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#e0e7ff] flex items-center justify-center">
                  <Mail size={28} className="text-[#2e3192]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-[#2e3192] mb-2">
                Forgot Password?
              </h1>
              <p className="text-center text-gray-500 text-sm mb-6">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#2e3192] transition font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
