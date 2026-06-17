'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Navbar from '@/app/components/Navbar';
import Image from 'next/image';
import { Download, Eye, Trash2, ExternalLink, FileText, User, Shield, Calendar } from 'lucide-react';

interface Upload {
  id: string;
  title: string;
  college: string;
  course: string;
  semester: string;
  subject: string;
  drive_link: string;
  download_count: number;
  read_count?: number;
  created_at: string | { seconds: number; nanoseconds: number };
}

interface UserProfile {
  name: string;
  email: string;
  isVerified: boolean;
  isSuspicious: boolean;
  userType: string;
  createdAt: { seconds: number; nanoseconds: number } | string;
}

const AccountPage = () => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    user_metadata?: { avatar_url?: string; name?: string };
  } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser({
        id: user.id,
        email: user.email ?? '',
        user_metadata: {
          avatar_url: user.user_metadata?.avatar_url,
          name: user.user_metadata?.name,
        },
      });
      setLoadingUser(false);

      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (userProfile) setProfile(userProfile as UserProfile);
      } catch {
        toast.error('Could not load profile.');
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingUploads(true);
    const fetchUploads = async () => {
      try {
        let { data: uploadsArr } = await supabase
          .from('resources')
          .select('*')
          .eq('uploaderId', user.id);

        if (!uploadsArr || uploadsArr.length === 0) {
          const { data: uploadsByEmail } = await supabase
            .from('resources')
            .select('*')
            .eq('uploaderId', user.email);
          uploadsArr = uploadsByEmail || [];
        }

        setUploads((uploadsArr || []) as Upload[]);
      } catch {
        toast.error('Failed to load your uploads.');
      }
      setLoadingUploads(false);
    };
    fetchUploads();
  }, [user]);

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <span>
          Delete this upload permanently?
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await supabase.from('resources').delete().eq('id', id);
                  setUploads((prev) => prev.filter((u) => u.id !== id));
                  toast.success('Upload deleted.');
                } catch {
                  toast.error('Failed to delete. Please try again.');
                }
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 8000 }
    );
  };

  function formatDate(val: string | { seconds: number; nanoseconds: number } | undefined | null) {
    if (!val) return '—';
    if (typeof val === 'string') return new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (typeof val === 'object' && val.seconds)
      return new Date(val.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return '—';
  }

  const totalDownloads = uploads.reduce((sum, u) => sum + (u.download_count || 0), 0);
  const totalViews = uploads.reduce((sum, u) => sum + (u.read_count || 0), 0);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Navbar />
        <div className="max-w-3xl mx-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8eaf0] p-8 animate-pulse mb-6">
            <div className="flex gap-5 items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-100 rounded w-56" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const initial = displayName[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8eaf0] p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#e0e7ff] flex items-center justify-center text-3xl font-bold text-[#2e3192] shrink-0 overflow-hidden shadow-sm">
              {user?.user_metadata?.avatar_url ? (
                <Image src={user.user_metadata.avatar_url} alt="Profile" width={80} height={80} className="rounded-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-bold text-xl text-gray-800">{displayName}</div>
              <div className="text-gray-500 text-sm mt-0.5">{profile?.email || user?.email}</div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${profile?.isVerified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                  <Shield size={11} />
                  {profile?.isVerified ? 'Verified' : 'Unverified'}
                </span>
                {profile?.userType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                    <User size={11} />
                    {profile.userType}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                  <Calendar size={11} />
                  Joined {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#f0f0f0]">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#2e3192]">{uploads.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Uploads</div>
            </div>
            <div className="text-center border-x border-[#f0f0f0]">
              <div className="text-2xl font-extrabold text-[#e94f37]">{totalDownloads}</div>
              <div className="text-xs text-gray-500 mt-0.5">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#7b2ff2]">{totalViews}</div>
              <div className="text-xs text-gray-500 mt-0.5">Views</div>
            </div>
          </div>
        </div>

        {/* Earnings placeholder */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#e8eaf0] shadow-sm text-center">
            <div className="text-sm font-semibold text-gray-600 mb-1">Earnings</div>
            <div className="text-lg font-bold text-gray-300">Coming Soon</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#e8eaf0] shadow-sm text-center">
            <div className="text-sm font-semibold text-gray-600 mb-1">Payment Method</div>
            <div className="text-lg font-bold text-gray-300">Coming Soon</div>
          </div>
        </div>

        {/* Uploads */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Your Uploads</h2>
          <span className="text-sm text-gray-400">{uploads.length} resource{uploads.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="space-y-3">
          {loadingUploads ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#e8eaf0] p-5 animate-pulse h-24" />
            ))
          ) : uploads.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e8eaf0] p-10 text-center shadow-sm">
              <FileText size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No uploads yet</p>
              <p className="text-gray-400 text-sm mt-1">Share your notes and help fellow students.</p>
              <a href="/upload" className="inline-block mt-4 bg-[#2e3192] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1b1f5e] transition">
                Upload Now
              </a>
            </div>
          ) : (
            uploads.map((upload) => (
              <div
                key={upload.id}
                className="bg-white rounded-xl border border-[#e8eaf0] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-base truncate">{upload.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {upload.college} · {upload.course} · Sem {upload.semester} · {upload.subject}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(upload.created_at)}
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <a
                      href={upload.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#2e3192] text-xs font-medium hover:underline"
                    >
                      <ExternalLink size={12} /> View File
                    </a>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                      <Download size={12} className="text-[#e94f37]" /> {upload.download_count || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                      <Eye size={12} className="text-[#7b2ff2]" /> {upload.read_count || 0}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(upload.id)}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 text-xs font-semibold transition-all shrink-0"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
