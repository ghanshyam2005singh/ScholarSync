'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

const SignupPage = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }

    try {
      // Create Supabase Auth user (no email link verification)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            userType,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Insert user profile into Supabase table
      await supabase.from('users').insert([{
        id: data.user?.id,
        name,
        email,
        userType,
        isVerified: false,
        isSuspicious: false,
        createdAt: new Date().toISOString()
      }]);

      setSignupSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setUserType('student');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Signup failed. Try again.');
      } else {
        setError('Signup failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-xl justify-center items-center mx-auto mt-10 border border-[#e0e0e0]">
        <h1 className="text-4xl font-extrabold text-center text-[#2e3192] mb-8">Create Your Account</h1>

        {signupSuccess ? (
          <div className="text-center">
            <p className="text-green-600 text-lg font-semibold mb-4">
              Account created! You can now log in.
            </p>
            <button
              className="bg-[#2e3192] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#1b1f5e] transition"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:outline-none transition-all"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:outline-none transition-all"
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:outline-none transition-all"
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2e3192] focus:outline-none transition-all"
            >
              <option value="student">Student</option>
              <option value="uploader">Uploader</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2e3192] text-white rounded-lg shadow-xl hover:bg-[#1b1f5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-[#e94f37] hover:underline font-semibold"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;