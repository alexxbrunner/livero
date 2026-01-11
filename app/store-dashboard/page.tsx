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
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-medium text-neutral-900 mb-3 tracking-tight">Dashboard</h1>
          <p className="text-lg text-neutral-600 font-light">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link href="/store-dashboard/products" className="group bg-white border border-neutral-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-neutral-300">
            <Package className="w-12 h-12 text-neutral-900 mb-6 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-medium text-neutral-900 mb-3">Manage Products</h3>
            <p className="text-neutral-600 font-light mb-4">{store._count?.products || 0} products synced</p>
            <span className="text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 group-hover:border-neutral-900 transition-colors">
              View Products →
            </span>
          </Link>
          
          <Link href="/store-dashboard/analytics" className="group bg-white border border-neutral-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-neutral-300">
            <TrendingUp className="w-12 h-12 text-green-600 mb-6 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-medium text-neutral-900 mb-3">View Analytics</h3>
            <p className="text-neutral-600 font-light mb-4">Detailed performance metrics</p>
            <span className="text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 group-hover:border-neutral-900 transition-colors">
              View Analytics →
            </span>
          </Link>
          
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="group bg-white border border-neutral-200 p-8 hover:shadow-lg transition-all duration-300 text-left disabled:opacity-50 hover:border-neutral-300"
          >
            <RefreshCw className={`w-12 h-12 text-blue-600 mb-6 stroke-[1.5] ${syncing ? 'animate-spin' : ''}`} />
            <h3 className="font-serif text-xl font-medium text-neutral-900 mb-3">Sync Products</h3>
            <p className="text-neutral-600 font-light mb-4">{syncing ? 'Syncing...' : 'Update your catalog'}</p>
            <span className="text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 group-hover:border-neutral-900 transition-colors">
              {syncing ? 'Syncing...' : 'Sync Now →'}
            </span>
          </button>
        </div>

        {/* Stats Overview */}
        {analytics && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-8 tracking-tight">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white border border-neutral-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-medium text-neutral-900">Recent Sync Activity</h2>
            <Link href="/store-dashboard/products" className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-1 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {syncLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-6 bg-neutral-50 border border-neutral-100">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {log.status === 'SUCCESS' ? '✓' : log.status === 'FAILED' ? '✗' : '⏳'}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {log.message || 'Sync completed'}
                    </p>
                    <p className="text-sm text-neutral-600 font-light">
                      {new Date(log.startedAt).toLocaleString()}
                      {log.itemsSynced > 0 && ` · ${log.itemsSynced} items`}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${
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
              <p className="text-center text-neutral-500 py-12 font-light">No sync history yet</p>
            )}
          </div>
        </div>

        {/* Store Status */}
        <div className="bg-white border border-neutral-200 p-8">
          <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-6">Store Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Current Status</p>
              <span
                className={`inline-flex px-4 py-2 text-xs font-medium uppercase tracking-wider ${
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
                <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Last Sync</p>
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
    <div className="bg-white border border-neutral-200 p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">{label}</p>
      <p className="text-4xl font-light text-neutral-900">{value}</p>
    </div>
  )
}
