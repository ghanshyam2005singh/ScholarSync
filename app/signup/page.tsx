'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import { Eye, EyeOff, BookOpen, CheckCircle, Mail } from 'lucide-react';

const SignupPage = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim(), userType },
        },
      });

      if (signUpError) throw signUpError;

      await supabase.from('users').insert([{
        id: data.user?.id,
        name: name.trim(),
        email: email.trim(),
        userType,
        isVerified: false,
        isSuspicious: false,
        createdAt: new Date().toISOString(),
      }]);

      setSignupSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('already registered')) {
          setError('An account with this email already exists. Try logging in.');
        } else {
          setError(msg || 'Signup failed. Please try again.');
        }
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo mark */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#2e3192] flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-[#2e3192]">ScholarSync</span>
            </Link>
            <h2 className="text-gray-500 text-sm mt-2">Create your free account</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e8eaf0]">
            {signupSuccess ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Account Created!</h3>
                <p className="text-gray-500 text-sm mb-4">
                  We sent a verification link to
                </p>
                <div className="inline-flex items-center gap-2 bg-[#f0f4ff] text-[#2e3192] px-4 py-2 rounded-lg text-sm font-semibold mb-6">
                  <Mail size={16} />
                  {email}
                </div>
                <p className="text-gray-400 text-xs mb-8">
                  Please verify your email before logging in. Check your spam folder if you don&apos;t see it.
                </p>
                <button
                  className="w-full bg-[#2e3192] text-white py-3 rounded-lg shadow-lg hover:bg-[#1b1f5e] transition font-semibold"
                  onClick={() => router.push('/login')}
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-[#e0e0e0] px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] focus:outline-none text-gray-900 bg-white transition"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#e0e0e0] px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] focus:outline-none text-gray-900 bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-[#e0e0e0] px-4 py-3 pr-11 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] focus:outline-none text-gray-900 bg-white transition"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full border border-[#e0e0e0] px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:border-[#2e3192] focus:outline-none text-gray-700 bg-white transition"
                  >
                    <option value="student">Student</option>
                    <option value="uploader">Uploader / Contributor</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#2e3192] text-white rounded-lg shadow-lg hover:bg-[#1b1f5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-500 pt-2 border-t border-[#f0f0f0]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#e94f37] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
