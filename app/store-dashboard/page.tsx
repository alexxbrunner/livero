'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import StoreLayout from '@/components/StoreLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { 
  Package, Eye, MousePointerClick, Mail, TrendingUp, TrendingDown, RefreshCw, Target
} from 'lucide-react'

export default function StoreDashboardHome() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [syncLogs, setSyncLogs] = useState<any[]>([])
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      const [storeRes, analyticsRes, syncLogsRes] = await Promise.all([
        api.get('/stores/me'),
        api.get('/analytics/store?period=7'),
        api.get('/stores/me/sync-logs'),
      ])

      setStore(storeRes.data)
      setAnalytics(analyticsRes.data)
      setSyncLogs(syncLogsRes.data.slice(0, 5))

      if (!storeRes.data || storeRes.data.status === 'PENDING') {
        router.push('/store-onboarding')
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/store-onboarding')
      }
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await api.post('/stores/me/sync')
      toast.success('Sync started! This may take a few minutes.')
      setTimeout(fetchData, 2000)
    } catch (error) {
      toast.error('Failed to start sync')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!store) return null

  return (
    <StoreLayout storeName={store.name} storeSlug={store.slug}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/store-dashboard/products" className="card p-6 hover:shadow-lg transition-shadow">
            <Package className="w-10 h-10 text-neutral-900 mb-4" />
            <h3 className="font-semibold text-neutral-900 mb-2">Manage Products</h3>
            <p className="text-sm text-neutral-600">{store._count?.products || 0} products synced</p>
          </Link>
          
          <Link href="/store-dashboard/analytics" className="card p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="font-semibold text-neutral-900 mb-2">View Analytics</h3>
            <p className="text-sm text-neutral-600">Detailed performance metrics</p>
          </Link>
          
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="card p-6 hover:shadow-lg transition-shadow text-left disabled:opacity-50"
          >
            <RefreshCw className={`w-10 h-10 text-blue-600 mb-4 ${syncing ? 'animate-spin' : ''}`} />
            <h3 className="font-semibold text-neutral-900 mb-2">Sync Products</h3>
            <p className="text-sm text-neutral-600">{syncing ? 'Syncing...' : 'Update your catalog'}</p>
          </button>
        </div>

        {/* Stats Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Eye className="w-6 h-6" />}
              label="Views (7 days)"
              value={analytics.traffic.views.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={<MousePointerClick className="w-6 h-6" />}
              label="Clicks (7 days)"
              value={analytics.traffic.clicks.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={<Mail className="w-6 h-6" />}
              label="Info Requests"
              value={analytics.traffic.requests.toLocaleString()}
              color="purple"
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              label="Conversion Rate"
              value={`${analytics.traffic.conversionRate.toFixed(1)}%`}
              color="orange"
            />
          </div>
        )}

        {/* Recent Activity */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Sync Activity</h2>
            <Link href="/store-dashboard/products" className="text-sm text-neutral-600 hover:text-neutral-900">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {syncLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {log.status === 'SUCCESS' ? '✓' : log.status === 'FAILED' ? '✗' : '⏳'}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {log.message || 'Sync completed'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {new Date(log.startedAt).toLocaleString()}
                      {log.itemsSynced > 0 && ` · ${log.itemsSynced} items`}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-800'
                      : log.status === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
            {syncLogs.length === 0 && (
              <p className="text-center text-neutral-500 py-8">No sync history yet</p>
            )}
          </div>
        </div>

        {/* Store Status */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Store Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Current Status</p>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                  store.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : store.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {store.status}
              </span>
            </div>
            {store.lastSyncAt && (
              <div className="text-right">
                <p className="text-sm text-neutral-600 mb-1">Last Sync</p>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(store.lastSyncAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}

function StatCard({ icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="card p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-neutral-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  )
}
