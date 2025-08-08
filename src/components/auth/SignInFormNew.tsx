'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Make sure you have this utility file.
import { supabase } from '@/utils/supabase/client';

// --- SVG Icons ---
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeCloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);


// --- MAIN LOGIN COMPONENT (Updated) ---
export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // --- Updated Form Submission Handler ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Step 1: Attempt to sign in the user.
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Step 2: After successful authentication, fetch the user's profile to check their status.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        setError("Could not verify your account status. Please try again.");
        await supabase.auth.signOut(); // Sign out to prevent a partial login state.
        setLoading(false);
        return;
      }

      // Step 3: Check the user's status and handle each case.
      switch (profile.status) {
        case 'active':
          // If active, proceed to the dashboard.
          router.push('/dashboard');
          break;
        case 'banned':
          setError("Your account has been banned. You are not permitted to log in.");
          await supabase.auth.signOut();
          setLoading(false);
          break;
        case 'inactive':
          setError("Your account is currently inactive. Please contact the support team for assistance.");
          await supabase.auth.signOut();
          setLoading(false);
          break;
        case 'under_review':
            setError("Your account is still under review. Please wait for admin approval before logging in.");
            await supabase.auth.signOut();
            setLoading(false);
            break;
        default:
          setError("An unknown account status was found. Please contact support.");
          await supabase.auth.signOut();
          setLoading(false);
          break;
      }
    } else {
        setError("An unexpected error occurred during login.");
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-3xl dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeCloseIcon className="text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#08d9b3] hover:text-[#07c0a0]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 font-semibold text-white bg-[#08d9b3] rounded-lg hover:bg-[#07c0a0] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    {loading ? 'Signing In...' : 'Sign in'}
                  </button>
                </div>
              </div>
            </form>

            {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/#register"
                  className="font-medium text-[#08d9b3] hover:text-[#07c0a0]"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
