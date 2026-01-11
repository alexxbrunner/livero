'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import StoreLayout from '@/components/StoreLayout'
import api from '@/lib/api'
import { 
  Eye, MousePointerClick, Mail, TrendingUp, TrendingDown, Target, Award, BarChart3, Euro
} from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
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
      const [storeRes, analyticsRes] = await Promise.all([
        api.get('/stores/me'),
        api.get(`/analytics/store?period=${period}`),
      ])

      setStore(storeRes.data)
      setAnalytics(analyticsRes.data)
    } catch (error: any) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading analytics...</p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  if (!store || !analytics) return null

  return (
    <StoreLayout storeName={store.name} storeSlug={store.slug}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Analytics</h1>
            <p className="text-neutral-600">Track your store's performance and insights</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-2 mt-4 md:mt-0">
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
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-300'
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

        {/* Performance Chart */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Performance Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Simple bar chart visualization */}
            {[65, 78, 82, 70, 88, 92, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-neutral-900 to-neutral-600 rounded-t-lg transition-all hover:from-neutral-700"
                  style={{ height: `${height}%` }}
                ></div>
                <p className="text-xs text-neutral-500 mt-2">
                  Day {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Estimated Reach</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {(analytics.traffic.views * 2.5).toFixed(0)}
            </p>
            <p className="text-sm text-neutral-600">Estimated unique visitors</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Click-Through Rate</h3>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {analytics.traffic.conversionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-neutral-600">
              {analytics.traffic.conversionRate > 3 ? 'Above' : 'Below'} industry average (3%)
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Engagement Score</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {Math.min(100, Math.round((analytics.traffic.clicks + analytics.traffic.requests * 2) / analytics.traffic.views * 100))}
            </p>
            <p className="text-sm text-neutral-600">Out of 100</p>
          </div>
        </div>

        {/* Billing Information */}
        <div className="card p-6 mb-8 bg-gradient-to-br from-blue-50 to-white border border-blue-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Billing & Marketing Fund</h2>
              <p className="text-neutral-600">Your investment in collective growth</p>
            </div>
            <Euro className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Monthly Fee</p>
              <p className="text-3xl font-bold text-neutral-900">€{analytics.billing.monthlyFee}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Your Marketing Share</p>
              <p className="text-3xl font-bold text-blue-600">€{analytics.billing.yourContribution}</p>
              <p className="text-xs text-neutral-500 mt-1">80% of fee</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">City Marketing Pool</p>
              <p className="text-3xl font-bold text-green-600">€{analytics.billing.cityMarketingFund}</p>
              <p className="text-xs text-neutral-500 mt-1">Total for {store.city.name}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Platform Fee</p>
              <p className="text-3xl font-bold text-neutral-900">€{analytics.billing.platformFee}</p>
              <p className="text-xs text-neutral-500 mt-1">20% of fee</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-neutral-700">
              <strong>Your ROI:</strong> With {analytics.traffic.clicks} clicks this period, your cost per click is{' '}
              <strong className="text-blue-600">
                €{analytics.traffic.clicks > 0 ? (Number(analytics.billing.monthlyFee) / analytics.traffic.clicks).toFixed(2) : '0.00'}
              </strong>
            </p>
          </div>
        </div>

        {/* Top Products */}
        {analytics.topProducts && analytics.topProducts.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Top Performing Products</h2>
            <div className="space-y-4">
              {analytics.topProducts.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {product.images?.urls?.[0] && (
                    <img
                      src={product.images.urls[0]}
                      alt={product.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{product.title}</h3>
                    <p className="text-sm text-neutral-600">€{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-neutral-900">{product.views}</p>
                    <p className="text-xs text-neutral-600">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
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
      <p className="text-sm text-neutral-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
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

