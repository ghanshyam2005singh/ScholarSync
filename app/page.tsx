import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { BookOpen, UploadCloud, TrendingUp, Users, FileText, Download } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7f8fa] text-gray-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#eef0ff] via-[#f7f8fa] to-[#fff5f4] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#e0e7ff] text-[#2e3192] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Users size={14} />
            Trusted by 1,000+ students
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-[#2e3192] leading-tight tracking-tight">
            Study Smarter,{" "}
            <span className="text-[#e94f37]">Together</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600 leading-relaxed">
            Discover, share, and download college study resources — notes, assignments, and more. Built for students, by students.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/resources">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#2e3192] text-white font-semibold shadow-lg hover:bg-[#1b1f5e] hover:shadow-xl transition-all duration-200">
                <BookOpen size={18} /> Browse Resources
              </button>
            </Link>
            <Link href="/upload">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#2e3192] font-semibold shadow-md border border-[#e0e0e0] hover:border-[#2e3192] hover:shadow-lg transition-all duration-200">
                <UploadCloud size={18} /> Upload & Earn
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-[#e8eaf0]">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-[#2e3192]">1,000+</div>
            <div className="text-sm text-gray-500 mt-1">Students</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#e94f37]">500+</div>
            <div className="text-sm text-gray-500 mt-1">Resources</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#7b2ff2]">50+</div>
            <div className="text-sm text-gray-500 mt-1">Colleges</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#f7f8fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2e3192] mb-3">
              How ScholarSync Works
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Three simple steps to access or contribute study resources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8eaf0] flex flex-col items-center text-center group hover:shadow-md hover:border-[#c7ceff] transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#e0e7ff] flex items-center justify-center mb-4 group-hover:bg-[#2e3192] transition-colors duration-200">
                <FileText size={26} className="text-[#2e3192] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#2e3192] mb-2">Step 1</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Discover</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Browse notes, assignments, and papers filtered by college, course, and semester.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8eaf0] flex flex-col items-center text-center group hover:shadow-md hover:border-[#ffd0c9] transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#fff0ee] flex items-center justify-center mb-4 group-hover:bg-[#e94f37] transition-colors duration-200">
                <UploadCloud size={26} className="text-[#e94f37] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#e94f37] mb-2">Step 2</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Upload</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Share your study materials and help fellow students. Quick, free, and simple.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8eaf0] flex flex-col items-center text-center group hover:shadow-md hover:border-[#dcc7ff] transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#f3eeff] flex items-center justify-center mb-4 group-hover:bg-[#7b2ff2] transition-colors duration-200">
                <TrendingUp size={26} className="text-[#7b2ff2] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#7b2ff2] mb-2">Step 3</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Earn</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Track views and downloads on your uploads. Earn rewards as your resources get used.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section className="py-20 px-6 bg-white border-t border-[#e8eaf0]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e0e7ff] flex items-center justify-center mx-auto mb-6">
            <Download size={28} className="text-[#2e3192]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2e3192]">
            About ScholarSync
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 mb-8 leading-relaxed">
            ScholarSync is a platform by{" "}
            <a
              href="https://ghanshyamsingh-dev.vercel.app/"
              target="_blank"
              className="font-semibold text-[#e94f37] hover:underline"
            >
              Ghanshyam Singh
            </a>{" "}
            built to make quality study resources accessible for every college student in India. Join the community and help each other succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/resources">
              <button className="bg-[#2e3192] text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:bg-[#1b1f5e] hover:shadow-xl transition-all">
                Browse Notes
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-white text-[#2e3192] px-8 py-3.5 rounded-xl font-semibold shadow-md border border-[#e0e0e0] hover:border-[#2e3192] hover:shadow-lg transition-all">
                Join Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
