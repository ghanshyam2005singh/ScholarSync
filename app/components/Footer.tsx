import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#e8eaf0] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2e3192] flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[#2e3192]">ScholarSync</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover, share, and download college study resources. Built for students, by students.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-gray-700 mb-1">Platform</div>
              <Link href="/resources" className="text-gray-500 hover:text-[#2e3192] transition-colors">Resources</Link>
              <Link href="/upload" className="text-gray-500 hover:text-[#2e3192] transition-colors">Upload</Link>
              <Link href="/signup" className="text-gray-500 hover:text-[#2e3192] transition-colors">Sign Up</Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-gray-700 mb-1">Account</div>
              <Link href="/login" className="text-gray-500 hover:text-[#2e3192] transition-colors">Login</Link>
              <Link href="/account" className="text-gray-500 hover:text-[#2e3192] transition-colors">Dashboard</Link>
              <Link href="/forgot-password" className="text-gray-500 hover:text-[#2e3192] transition-colors">Forgot Password</Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-gray-700 mb-1">Developer</div>
              <a
                href="https://ghanshyamsingh-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#e94f37] transition-colors"
              >
                Portfolio
              </a>
              <a
                href="https://ghanshyamsingh-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#e94f37] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} ScholarSync. All rights reserved.</span>
          <span>
            Built by{' '}
            <a
              href="https://ghanshyamsingh-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e94f37] hover:underline font-medium"
            >
              Ghanshyam Singh
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
