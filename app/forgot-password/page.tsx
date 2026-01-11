'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DefaultLayout from '@/components/DefaultLayout';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

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
              CHECK YOUR EMAIL
            </h1>
            
            <p className="text-gray-600 mb-6">
              If an account exists with <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Please check your spam folder if you don't see the email within a few minutes.
            </p>
            
            <Link
              href="/login"
              className="inline-block px-6 py-2 border border-gray-300 text-gray-900 uppercase text-xs tracking-wider hover:bg-gray-50 transition-colors"
            >
              Back to Login
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
              RESET PASSWORD
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                placeholder="your@email.com"
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
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white uppercase text-xs tracking-wider hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

