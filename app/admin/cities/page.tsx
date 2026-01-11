'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store, LogOut, Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminCities() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    currency: 'EUR',
    monthlyFee: 500,
  })

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchCities()
  }, [token, user])

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/admin/cities')
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/admin/cities', formData)
      toast.success('City created successfully!')
      setShowModal(false)
      setFormData({ name: '', slug: '', country: '', currency: 'EUR', monthlyFee: 500 })
      fetchCities()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create city')
    }
  }

  const toggleCityStatus = async (cityId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/cities/${cityId}`, { isActive: !currentStatus })
      toast.success('City status updated')
      fetchCities()
    } catch (error) {
      toast.error('Failed to update city status')
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
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/cities" className="text-gray-900 font-medium">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cities</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add City
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div key={city.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.country}</p>
                </div>
                <button
                  onClick={() => toggleCityStatus(city.id, city.isActive)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {city.isActive ? (
                    <ToggleRight className="w-8 h-8 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stores:</span>
                  <span className="font-medium">{city._count.stores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{city._count.products}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Fee:</span>
                  <span className="font-medium">{city.currency} {city.monthlyFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      city.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {city.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <Link
                href={`/city/${city.slug}`}
                className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Public Page →
              </Link>
            </div>
          ))}
        </div>

        {cities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cities yet. Add your first city to get started!</p>
          </div>
        )}
      </div>

      {/* Create City Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New City</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Vienna"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  className="input"
                  placeholder="vienna"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input"
                  placeholder="Austria"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fee</label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="input"
                  min="0"
                  step="50"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Create City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

