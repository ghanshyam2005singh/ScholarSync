'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Optionally fetch user profile from Supabase table
        const { data: profile } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();
        setUserName(
          profile?.name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Account'
        );
      } else {
        setUserName('');
      }
      setLoading(false);
    };
    getUser();
    // Optionally, subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
  };

  const isActive = (path: string) =>
    pathname === path ? 'text-[#2e3192] font-semibold' : 'text-gray-700';

  return (
    <nav className="bg-white border-b border-[#e0e0e0] shadow-sm px-4 md:px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#2e3192] tracking-tight">
          Padh-le-Bhai
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-auto p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#2e3192]"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen
            ? <X size={28} className="text-[#2e3192]" />
            : <Menu size={28} className="text-[#2e3192]" />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-row gap-6 text-base items-center flex-wrap justify-end">
          <Link href="/resources" className={isActive('/resources')}>
            Resources
          </Link>
          <Link href="/upload" className={isActive('/upload')}>
            Upload
          </Link>
          {!user && !loading && (
            <>
              <Link href="/login" className={isActive('/login')}>
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-[#2e3192] text-white px-4 py-1.5 rounded hover:bg-[#1b1f5e] text-sm transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          {user && !loading && (
            <>
              <Link href="/account" className="flex items-center gap-2">
                <UserCircle size={28} className="text-[#2e3192]" />
                <span className="hidden md:inline text-gray-700 text-sm">{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm transition"
              >
                Logout
              </button>
            </>
          )}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="animate-pulse">
                <div className="h-7 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          )}
          <Link href="https://iron-industry.tech/" target="_blank">
            <button
              className="flex items-center gap-2 bg-[#e94f37] text-white px-4 py-1.5 rounded hover:bg-[#2e3192] hover:text-white text-sm shadow-md transition-all"
            >
              <MessageCircle size={16} />
              Contact Us
            </button>
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden absolute left-0 top-full bg-white shadow-lg rounded-b-lg flex flex-col gap-4 py-4 px-6 z-50 animate-fade-in w-full">
            <Link
              href="/resources"
              className={isActive('/resources')}
              onClick={() => setOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/upload"
              className={isActive('/upload')}
              onClick={() => setOpen(false)}
            >
              Upload
            </Link>
            {!user && !loading && (
              <>
                <Link
                  href="/login"
                  className={isActive('/login')}
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <button className="bg-[#2e3192] text-white px-4 py-1.5 rounded hover:bg-[#1b1f5e] text-sm w-full text-left transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            {user && !loading && (
              <>
                <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <UserCircle size={28} className="text-[#2e3192]" />
                  <span className="text-gray-700 text-sm">{userName}</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="mt-2 bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm w-full text-left transition"
                >
                  Logout
                </button>
              </>
            )}
            {loading && (
              <div className="animate-pulse">
                <div className="h-7 w-20 bg-gray-300 rounded"></div>
              </div>
            )}
            <Link href="https://iron-industry.tech/" target="_blank" onClick={() => setOpen(false)}>
              <button
                className="flex items-center gap-2 bg-[#e94f37] text-white px-4 py-1.5 rounded hover:bg-[#2e3192] hover:text-white text-sm shadow-md transition-all w-full text-left"
              >
                <MessageCircle size={16} />
                Contact Us
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;