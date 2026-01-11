'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DefaultLayout from '@/components/DefaultLayout';
import api from '@/lib/api';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

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
                Check Your<br />Email
              </h2>
              <p className="text-xl text-neutral-300 font-light max-w-md">
                We've sent you a secure link to reset your password.
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
              Check Your Email
            </h1>
            
            <p className="text-neutral-600 font-light mb-6">
              If an account exists with <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
            </p>
            
            <p className="text-sm text-neutral-500 font-light mb-8">
              Please check your spam folder if you don't see the email within a few minutes.
            </p>
            
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 hover:bg-neutral-50 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
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
              Forgot Your<br />Password?
            </h2>
            <p className="text-xl text-neutral-300 font-light max-w-md">
              No worries. Enter your email address and we'll send you a link to reset your password.
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
              Reset Password
            </h1>
            <p className="text-neutral-600 font-light">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="your@email.com"
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
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider font-medium"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-light"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

