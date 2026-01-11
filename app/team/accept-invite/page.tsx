'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DefaultLayout from '@/components/DefaultLayout';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setAuth } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid invite link');
      setLoading(false);
      return;
    }

    fetchInviteData();
  }, [token]);

  const fetchInviteData = async () => {
    try {
      const { data } = await api.get(`/team/invite/${token}`);
      setInviteData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load invite');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const { data } = await api.post('/team/accept-invite', {
        token,
        password,
      });

      // Log the user in
      setAuth(data.user, data.token);

      // Redirect to store dashboard
      router.push('/store-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to accept invite');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Loading invite...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error && !inviteData) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
              INVALID INVITE
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 border border-gray-300 text-gray-900 uppercase text-xs tracking-wider hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="border border-gray-200 p-8 bg-white">
          {/* Store Logo */}
          {inviteData?.storeLogoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={inviteData.storeLogoUrl}
                alt={inviteData.storeName}
                className="h-16 object-contain"
              />
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-2">
              TEAM INVITATION
            </h1>
            <p className="text-gray-600">
              You've been invited to join <span className="font-medium">{inviteData?.storeName}</span> as a{' '}
              <span className="font-medium uppercase text-sm">{inviteData?.role}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">{inviteData?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAccept} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">
                Create Password
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
              disabled={accepting}
              className="w-full py-3 bg-gray-900 text-white uppercase text-xs tracking-wider hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {accepting ? 'Accepting...' : 'Accept Invitation & Create Account'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By accepting this invitation, you'll get access to the store dashboard based on your role permissions.
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DefaultLayout>
    }>
      <AcceptInviteForm />
    </Suspense>
  );
}

