'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import collegeList from "@/public/collegeList";
import categoriesWithCourses from "@/public/courseList";
import toast from 'react-hot-toast';
import Navbar from '@/app/components/Navbar';

const UploadPage = () => {
  const [college, setCollege] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<string[]>([]);
  const [semester, setSemester] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [uploaderId, setUploaderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // College search state
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  // Legal disclaimer modal state
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // FIXED: Use useMemo to prevent recreation on every render
  const uniqueCollegeList = useMemo(() => Array.from(new Set(collegeList)), []);

  // Redirect if not logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login';
      } else {
        setUploaderId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    const found = categoriesWithCourses.find(
      (cat) => cat.category === selectedCategory
    );
    setFilteredCourses(found ? found.courses : []);
    setSelectedCourse('');
  }, [selectedCategory]);

  // FIXED: Now uniqueCollegeList is stable
  useEffect(() => {
    if (collegeSearch.trim() === '') {
      setFilteredColleges(uniqueCollegeList);
    } else {
      const filtered = uniqueCollegeList.filter(col =>
        col.toLowerCase().includes(collegeSearch.toLowerCase())
      );
      setFilteredColleges(filtered);
    }
  }, [collegeSearch, uniqueCollegeList]);

  // FIXED: Close dropdown when clicking outside
  useEffect(() => {
    if (!showCollegeDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCollegeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCollegeDropdown]);

  const isFormValid =
    title &&
    college &&
    selectedCategory &&
    selectedCourse &&
    semester &&
    file &&
    !loading &&
    agreed;

  const handleCollegeSelect = (selectedCollege: string) => {
    setCollege(selectedCollege);
    setCollegeSearch(selectedCollege);
    setShowCollegeDropdown(false);
  };

  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeSearch(value);
    setCollege(value);
    setShowCollegeDropdown(true);
  };

  const handleCollegeInputFocus = () => {
    setShowCollegeDropdown(true);
  };

 const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!agreed) {
    setShowDisclaimer(true);
    return;
  }

  if (!title || !college || !selectedCategory || !selectedCourse || !semester || !file) {
    setError('Please fill in all fields');
    toast.error('Please fill in all fields');
    return;
  }

   // Get Supabase access token for authentication
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  if (!accessToken) {
    setError('Please log in to upload');
    toast.error('Please log in to upload');
    return;
  }


    // Get Supabase user for authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please log in to upload');
      toast.error('Please log in to upload');
      return;
    }

    setError('');
    setLoading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');

    try {
      // Use Supabase access token for authentication
      const formData = new FormData();
  formData.append('title', title);
  formData.append('college', college);
  formData.append('category', selectedCategory);
  formData.append('course', selectedCourse);
  formData.append('semester', semester);
  formData.append('subject', title);
  formData.append('file', file!);
  if (uploaderId) formData.append('uploaderId', uploaderId);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload');
  xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      
      xhr.onload = () => {
        setUploadStatus('processing');
        setTimeout(() => {
          setLoading(false);
          setUploadStatus('done');
          setUploadProgress(100);
          
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              toast.success('Upload successful!');
              setTitle('');
              setCollege('');
              setCollegeSearch('');
              setSelectedCategory('');
              setSelectedCourse('');
              setSemester('');
              setFile(null);
              setAgreed(false);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              setTimeout(() => setUploadStatus('idle'), 1500);
            } else {
              setError('Upload failed');
              toast.error('Upload failed');
              setUploadStatus('idle');
            }
          } catch {
            setError('Upload failed');
            toast.error('Upload failed');
            setUploadStatus('idle');
          }
        } else if (xhr.status === 413) {
          setError('File is too large. Please upload a file smaller than 20MB.');
          toast.error('File too large. Try compressing or splitting your file.');
          setUploadStatus('idle');
        } else if (xhr.status === 504 || xhr.status === 502 || xhr.status === 503) {
          setError('Server is temporarily unavailable. Please try again later.');
          toast.error('Server error. Try again in a few minutes.');
          setUploadStatus('idle');
        } else if (xhr.status === 0) {
          setError('Network error. Please check your internet connection.');
          toast.error('Network error.');
          setUploadStatus('idle');
        } else {
          setError(`Upload failed - Status: ${xhr.status}`);
          toast.error('Upload failed');
          setUploadStatus('idle');
        }
      }, 1200);
    };

    xhr.onerror = () => {
      setLoading(false);
      setError('Network or server error - Upload failed. Supabase may be offline.');
      toast.error('Upload failed. Try again later.');
      setUploadStatus('idle');
    };

    xhr.send(formData);
  } catch (err) {
    setLoading(false);
    setError('Upload failed. Please try again later.');
    toast.error('Upload failed');
    setUploadStatus('idle');
    console.error('Upload error:', err);
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Modal for legal disclaimer
  const DisclaimerModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/30"
        style={{ zIndex: 10 }}
        onClick={() => setShowDisclaimer(false)}
      />
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative z-20 mx-4">
        <h2 className="text-xl font-bold mb-4 text-red-600">Legal Disclaimer</h2>
        <p className="text-gray-700 mb-4">
          By uploading, you agree that your file does not contain any copyrighted, illegal, harmful, or inappropriate content.
          You are solely responsible for the content you upload. Violations may result in account suspension and legal action.
        </p>
        <div className="flex items-center mb-4">
          <input
            id="agree-modal"
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="agree-modal" className="text-gray-700 text-sm">
            I have read and agree to the above disclaimer.
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setShowDisclaimer(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${agreed ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
            disabled={!agreed}
            onClick={() => setShowDisclaimer(false)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-[#2e3192] mb-6 sm:mb-8">
              Upload Study Resource
            </h1>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Subject Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Enter subject name (e.g. Database Management System)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
              </div>

              {/* College Searchable Dropdown */}
              <div className="relative" ref={collegeDropdownRef}>
                <input
                  type="text"
                  placeholder="Search and select college..."
                  value={collegeSearch}
                  onChange={handleCollegeInputChange}
                  onFocus={handleCollegeInputFocus}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                />
                {showCollegeDropdown && (
                  <div className="absolute z-[50000] w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map((col: string) => (
                        <div
                          key={col}
                          onClick={() => handleCollegeSelect(col)}
                          className="px-4 py-3 hover:bg-indigo-100 hover:text-indigo-800 border-b border-gray-200 last:border-b-0 transition-colors cursor-pointer text-gray-800 font-medium"
                        >
                          <div className="break-words whitespace-normal leading-relaxed">
                            {col}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-600 text-center font-medium">
                        No colleges found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  {categoriesWithCourses.map(cat => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Dropdown */}
              <div>
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  disabled={!selectedCategory}
                  className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none transition-all
                    ${!selectedCategory 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 focus:ring-2 focus:ring-indigo-600'}
                  `}
                  title={!selectedCategory ? 'Select a category first' : ''}
                >
                  <option value="">Select Course</option>
                  {filteredCourses.map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                >
                  <option value="">Select Semester</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>Semester {i + 1}</option>
                  ))}
                </select>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Upload File</label>
                {!file ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 border-2 border-dashed border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all"
                  >
                    Choose File
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg border border-indigo-200">
                    <span className="truncate text-indigo-700 flex-1 mr-2">{file.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="flex-shrink-0 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Legal Disclaimer Checkbox */}
              <div className="flex items-start sm:items-center">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mr-2 mt-1 sm:mt-0 flex-shrink-0"
                />
                <label htmlFor="agree" className="text-gray-700 text-xs sm:text-sm flex-1">
                  I agree that my upload does not contain any copyrighted, illegal, or inappropriate content.
                </label>
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline flex-shrink-0"
                  onClick={() => setShowDisclaimer(true)}
                >
                  Read Disclaimer
                </button>
              </div>

              {/* Upload Progress & Status */}
              {(loading || uploadStatus === 'processing') && (
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className={`h-4 rounded-full transition-all ${uploadStatus === 'processing' ? 'bg-green-400 animate-pulse' : 'bg-indigo-600'}`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="block text-center text-sm text-gray-700 mt-1">
                    {uploadStatus === 'processing'
                      ? 'Processing file...'
                      : `Uploading: ${uploadProgress}%`}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {error && (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 my-2 text-sm">
    {error.includes('File is too large') && (
      <div>
        <strong>File too large:</strong> Try compressing your file or splitting it into smaller parts.<br />
        <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Compress PDF online</a>
      </div>
    )}
    {error.includes('Server is temporarily unavailable') && (
      <div>
        <strong>Server issue:</strong> Supabase may be offline. Please try again in a few minutes.
      </div>
    )}
    {!error.includes('File is too large') && !error.includes('Server is temporarily unavailable') && (
      <span>{error}</span>
    )}
  </div>
)}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 rounded-lg shadow-lg transition-all text-sm sm:text-base ${
                  isFormValid
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading || uploadStatus === 'processing' ? 'Uploading...' : 'Upload Resource'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {showDisclaimer && <DisclaimerModal />}
    </div>
  );
};

export default UploadPage;