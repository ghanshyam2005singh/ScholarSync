'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, UserCircle, LogOut } from 'lucide-react';
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
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    setOpen(false);
  };

  const isActive = (path: string) =>
    pathname === path
      ? 'text-[#2e3192] font-semibold border-b-2 border-[#2e3192] pb-0.5'
      : 'text-gray-600 hover:text-[#2e3192] transition-colors';

  const isMobileActive = (path: string) =>
    pathname === path
      ? 'text-[#2e3192] font-semibold bg-[#f0f4ff] rounded-lg px-3 py-2'
      : 'text-gray-600 hover:text-[#2e3192] hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors';

  return (
    <nav className="bg-white border-b border-[#e8eaf0] shadow-sm px-4 md:px-8 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#2e3192] flex items-center justify-center group-hover:bg-[#1b1f5e] transition-colors">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#2e3192] tracking-tight group-hover:text-[#1b1f5e] transition-colors">
            ScholarSync
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-row gap-6 text-sm items-center">
          <Link href="/resources" className={isActive('/resources')}>
            Resources
          </Link>
          <Link href="/upload" className={isActive('/upload')}>
            Upload
          </Link>

          {loading && (
            <div className="animate-pulse flex items-center gap-3">
              <div className="h-4 w-14 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded-lg" />
            </div>
          )}

          {!user && !loading && (
            <>
              <Link href="/login" className={isActive('/login')}>
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-[#2e3192] text-white px-4 py-2 rounded-lg hover:bg-[#1b1f5e] text-sm transition-colors font-medium">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {user && !loading && (
            <>
              <Link href="/account" className="flex items-center gap-2 group">
                <UserCircle size={26} className="text-[#2e3192] group-hover:text-[#1b1f5e] transition-colors" />
                <span className="text-gray-700 text-sm font-medium group-hover:text-[#2e3192] transition-colors">
                  {userName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 text-sm transition-colors font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          <a
            href="https://ghanshyamsingh-dev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#e94f37] text-white px-4 py-2 rounded-lg hover:bg-[#c73d29] text-sm font-medium shadow-sm transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2e3192] transition-colors"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen
            ? <X size={24} className="text-[#2e3192]" />
            : <Menu size={24} className="text-[#2e3192]" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-[#e8eaf0] pt-3 flex flex-col gap-1">
          <Link href="/resources" className={isMobileActive('/resources')} onClick={() => setOpen(false)}>
            Resources
          </Link>
          <Link href="/upload" className={isMobileActive('/upload')} onClick={() => setOpen(false)}>
            Upload
          </Link>

          {!user && !loading && (
            <>
              <Link href="/login" className={isMobileActive('/login')} onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <button className="w-full text-left bg-[#2e3192] text-white px-3 py-2 rounded-lg hover:bg-[#1b1f5e] text-sm transition-colors font-medium mt-1">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {user && !loading && (
            <>
              <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                <UserCircle size={24} className="text-[#2e3192]" />
                <span className="text-gray-700 text-sm font-medium">{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-left text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition-colors font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {loading && (
            <div className="animate-pulse px-3 py-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          )}

          <a
            href="https://ghanshyamsingh-dev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-[#e94f37] text-white px-3 py-2 rounded-lg hover:bg-[#c73d29] text-sm font-medium transition-colors mt-2"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
