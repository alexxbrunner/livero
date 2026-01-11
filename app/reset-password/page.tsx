'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DefaultLayout from '@/components/DefaultLayout';
import api from '@/lib/api';

export default function ResetPasswordPage() {
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
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Verifying reset link...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (success) {
    return (
      <DefaultLayout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="border border-gray-200 p-8 bg-white text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
              PASSWORD RESET SUCCESSFUL
            </h1>
            
            <p className="text-gray-600 mb-8">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-gray-900 text-white uppercase text-xs tracking-wider hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error && !email) {
    return (
      <DefaultLayout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="border border-gray-200 p-8 bg-white text-center">
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
              INVALID RESET LINK
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-2 border border-gray-300 text-gray-900 uppercase text-xs tracking-wider hover:bg-gray-50 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="border border-gray-200 p-8 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-2">
              SET NEW PASSWORD
            </h1>
            <p className="text-gray-600">
              Enter a new password for <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="Re-enter password"
                required
              />
            </div>

            {error && (
              <div className="p-4 border border-red-200 bg-red-50">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 bg-gray-900 text-white uppercase text-xs tracking-wider hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {verifying ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

