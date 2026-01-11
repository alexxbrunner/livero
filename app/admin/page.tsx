'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { Store, BarChart3, Package, Users, Settings, LogOut, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchDashboard()
  }, [token, user])

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard')
      setDashboard(data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-gray-900">Livero</span>
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded font-medium ml-2">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/admin/cities" className="text-gray-600 hover:text-gray-900">
                Cities
              </Link>
              <Link href="/admin/stores" className="text-gray-600 hover:text-gray-900">
                Stores
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 flex items-center">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        {dashboard && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Store className="w-6 h-6" />}
                label="Total Cities"
                value={dashboard.overview.totalCities}
                color="blue"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                label="Active Stores"
                value={dashboard.overview.activeStores}
                color="green"
              />
              <StatCard
                icon={<Package className="w-6 h-6" />}
                label="Total Products"
                value={dashboard.overview.totalProducts}
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Total Views"
                value={dashboard.overview.totalViews}
                color="orange"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Stores</h3>
                <p className="text-3xl font-bold text-yellow-600">{dashboard.overview.pendingStores}</p>
                <Link href="/admin/stores?status=PENDING" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  Review pending →
                </Link>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clicks</h3>
                <p className="text-3xl font-bold text-gray-900">{dashboard.overview.totalClicks}</p>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-green-600">
                  {dashboard.overview.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Recent Syncs */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sync Activity</h2>
              <div className="space-y-3">
                {dashboard.recentSyncs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{log.store.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.startedAt).toLocaleString()}
                        {log.itemsSynced > 0 && ` · ${log.itemsSynced} items`}
                      </p>
                      {log.message && <p className="text-sm text-gray-500">{log.message}</p>}
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
                {dashboard.recentSyncs.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent sync activity</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
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
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

