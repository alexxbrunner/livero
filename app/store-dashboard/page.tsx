'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { 
  Store, Package, BarChart3, LogOut, RefreshCw, TrendingUp, TrendingDown,
  Eye, MousePointerClick, Mail, Euro, Users, Calendar, Target, Award
} from 'lucide-react'

export default function StoreDashboard() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [syncLogs, setSyncLogs] = useState<any[]>([])
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<string>('30')

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [token, period])

  const fetchData = async () => {
    try {
      const [storeRes, analyticsRes, syncLogsRes] = await Promise.all([
        api.get('/stores/me'),
        api.get(`/analytics/store?period=${period}`),
        api.get('/stores/me/sync-logs'),
      ])

      setStore(storeRes.data)
      setAnalytics(analyticsRes.data)
      setSyncLogs(syncLogsRes.data)

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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!store) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-gray-900">Livero</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href={`/store/${store.slug}`} className="text-gray-600 hover:text-gray-900 text-sm">
                View Public Page
              </Link>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              {store.logoUrl && (
                <img src={store.logoUrl} alt={store.name} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
              )}
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">{store.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  {store.city.name} · {store._count.products} products
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSync}
                disabled={syncing || store.status !== 'ACTIVE'}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Products'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                store.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : store.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {store.status}
            </span>
            {store.lastSyncAt && (
              <span className="ml-4 text-sm text-gray-600">
                Last synced: {new Date(store.lastSyncAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {store.status === 'ACTIVE' && analytics && (
          <>
            {/* Period Selector */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Performance Overview</h2>
              <div className="flex gap-2">
                {[
                  { label: '7 Days', value: '7' },
                  { label: '30 Days', value: '30' },
                  { label: '90 Days', value: '90' },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      period === p.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Eye className="w-6 h-6" />}
                label="Total Views"
                value={analytics.traffic.views.toLocaleString()}
                change="+12.5%"
                changeType="up"
                color="blue"
              />
              <StatCard
                icon={<MousePointerClick className="w-6 h-6" />}
                label="Total Clicks"
                value={analytics.traffic.clicks.toLocaleString()}
                change="+8.2%"
                changeType="up"
                color="green"
              />
              <StatCard
                icon={<Mail className="w-6 h-6" />}
                label="Info Requests"
                value={analytics.traffic.requests.toLocaleString()}
                change="+5.7%"
                changeType="up"
                color="purple"
              />
              <StatCard
                icon={<Target className="w-6 h-6" />}
                label="Conversion Rate"
                value={`${analytics.traffic.conversionRate.toFixed(1)}%`}
                change="-0.3%"
                changeType="down"
                color="orange"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Estimated Reach</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {(analytics.traffic.views * 2.5).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Estimated unique visitors</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Click-Through Rate</h3>
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.traffic.conversionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                  {analytics.traffic.conversionRate > 3 ? 'Above' : 'Below'} industry average (3%)
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Engagement Score</h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {Math.min(100, Math.round((analytics.traffic.clicks + analytics.traffic.requests * 2) / analytics.traffic.views * 100))}
                </p>
                <p className="text-sm text-gray-600">Out of 100</p>
              </div>
            </div>

            {/* Billing Information */}
            <div className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-white border border-primary-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Billing & Marketing Fund</h2>
                  <p className="text-gray-600">Your contribution to collective growth</p>
                </div>
                <Euro className="w-8 h-8 text-primary-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                  <p className="text-3xl font-bold text-gray-900">€{analytics.billing.monthlyFee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Marketing Share</p>
                  <p className="text-3xl font-bold text-primary-600">€{analytics.billing.yourContribution}</p>
                  <p className="text-xs text-gray-500 mt-1">80% of fee</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">City Marketing Pool</p>
                  <p className="text-3xl font-bold text-green-600">€{analytics.billing.cityMarketingFund}</p>
                  <p className="text-xs text-gray-500 mt-1">Total for {store.city.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Platform Fee</p>
                  <p className="text-3xl font-bold text-gray-900">€{analytics.billing.platformFee}</p>
                  <p className="text-xs text-gray-500 mt-1">20% of fee</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Your ROI:</strong> With {analytics.traffic.clicks} clicks this period, your cost per click is{' '}
                  <strong className="text-primary-600">
                    €{analytics.traffic.clicks > 0 ? (Number(analytics.billing.monthlyFee) / analytics.traffic.clicks).toFixed(2) : '0.00'}
                  </strong>
                </p>
              </div>
            </div>

            {/* Top Products */}
            {analytics.topProducts && analytics.topProducts.length > 0 && (
              <div className="card p-6 mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Top Performing Products</h2>
                <div className="space-y-4">
                  {analytics.topProducts.map((product: any, index: number) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {product.images?.urls?.[0] && (
                        <img
                          src={product.images.urls[0]}
                          alt={product.title}
                          className="w-20 h-20 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600">€{product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">{product.views}</p>
                        <p className="text-xs text-gray-600">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Sync History */}
        <div className="card p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Sync History</h2>
          <div className="space-y-3">
            {syncLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {log.status === 'SUCCESS' ? '✓' : log.status === 'FAILED' ? '✗' : '⏳'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.message || 'Sync completed'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.startedAt).toLocaleString()}
                        {log.itemsSynced > 0 && ` · ${log.itemsSynced} items synced`}
                      </p>
                    </div>
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
              <p className="text-center text-gray-500 py-8">No sync history yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, change, changeType, color }: any) {
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
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className={`flex items-center text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </div>
        )}
      </div>
    </div>
  )
}
