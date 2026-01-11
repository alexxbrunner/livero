'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      setLoading(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data } = await api.get(`/auth/verify-reset-token/${token}`);
      setEmail(data.email);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 font-light">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
          <div className="relative h-full flex flex-col justify-between p-12">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-medium text-white tracking-tight">Livero</h1>
            </Link>

            <div className="text-white">
              <h2 className="text-5xl font-serif font-medium mb-6 tracking-tight leading-tight">
                Password<br />Reset Complete
              </h2>
              <p className="text-xl text-neutral-300 font-light max-w-md">
                Your password has been successfully reset. You can now log in with your new credentials.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-10">
              <div className="grid grid-cols-3 gap-4 h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 mb-8">
              <CheckCircle className="w-10 h-10 text-green-600 stroke-[1.5]" />
            </div>
            
            <h1 className="text-3xl font-serif font-medium text-neutral-900 mb-4 tracking-tight">
              Password Reset Successful
            </h1>
            
            <p className="text-neutral-600 font-light mb-8">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-all text-sm uppercase tracking-wider font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
          <div className="relative h-full flex flex-col justify-between p-12">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-medium text-white tracking-tight">Livero</h1>
            </Link>

            <div className="text-white">
              <h2 className="text-5xl font-serif font-medium mb-6 tracking-tight leading-tight">
                Invalid<br />Reset Link
              </h2>
              <p className="text-xl text-neutral-300 font-light max-w-md">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-10">
              <div className="grid grid-cols-3 gap-4 h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Error Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 mb-8">
              <AlertCircle className="w-10 h-10 text-red-600 stroke-[1.5]" />
            </div>
            
            <h1 className="text-3xl font-serif font-medium text-neutral-900 mb-4 tracking-tight">
              Invalid Reset Link
            </h1>
            
            <p className="text-neutral-600 font-light mb-8">{error}</p>
            
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-3 border border-neutral-300 text-neutral-900 hover:bg-neutral-50 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif font-medium text-white tracking-tight">Livero</h1>
          </Link>

          <div className="text-white">
            <h2 className="text-5xl font-serif font-medium mb-6 tracking-tight leading-tight">
              Set New<br />Password
            </h2>
            <p className="text-xl text-neutral-300 font-light max-w-md">
              Choose a strong password to secure your account and keep your information safe.
            </p>
          </div>

          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-10">
            <div className="grid grid-cols-3 gap-4 h-full">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1 className="text-3xl font-serif font-medium text-neutral-900 tracking-tight">Livero</h1>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-medium text-neutral-900 mb-2 tracking-tight">
              Set New Password
            </h1>
            <p className="text-neutral-600 font-light">
              Enter a new password for <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 border border-red-200 bg-red-50">
                <p className="text-sm text-red-600 font-light">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider font-medium"
            >
              {verifying ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 font-light">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

