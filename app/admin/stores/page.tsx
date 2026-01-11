'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store as StoreIcon, LogOut, Check, X, Pause, Play } from 'lucide-react'

export default function AdminStores() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get('status')
  
  const { user, token, logout } = useAuthStore()
  const [stores, setStores] = useState<any[]>([])
  const [filteredStores, setFilteredStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'ALL')

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchStores()
  }, [token, user])

  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setFilteredStores(stores)
    } else {
      setFilteredStores(stores.filter((s) => s.status === selectedStatus))
    }
  }, [selectedStatus, stores])

  const fetchStores = async () => {
    try {
      const { data } = await api.get('/admin/stores')
      setStores(data)
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStoreStatus = async (storeId: string, status: string) => {
    try {
      await api.patch(`/admin/stores/${storeId}/status`, { status })
      toast.success(`Store ${status.toLowerCase()}`)
      fetchStores()
    } catch (error) {
      toast.error('Failed to update store status')
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
              <StoreIcon className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-gray-900">Livero</span>
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded font-medium ml-2">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/cities" className="text-gray-600 hover:text-gray-900">
                Cities
              </Link>
              <Link href="/admin/stores" className="text-gray-900 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'ACTIVE', 'PAUSED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {store.logoUrl && (
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          store.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : store.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : store.status === 'PAUSED'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {store.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">City:</span>
                        <p className="font-medium">{store.city.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Platform:</span>
                        <p className="font-medium">{store.platform}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Products:</span>
                        <p className="font-medium">{store._count.products}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <p className="font-medium text-sm">{store.user.email}</p>
                      </div>
                    </div>

                    {store.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{store.description}</p>
                    )}

                    {store.lastSyncAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last synced: {new Date(store.lastSyncAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {store.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStoreStatus(store.id, 'ACTIVE')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateStoreStatus(store.id, 'REJECTED')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {store.status === 'ACTIVE' && (
                    <button
                      onClick={() => updateStoreStatus(store.id, 'PAUSED')}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Pause"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  )}
                  {store.status === 'PAUSED' && (
                    <button
                      onClick={() => updateStoreStatus(store.id, 'ACTIVE')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Activate"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  {store.websiteUrl && (
                    <a
                      href={store.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 ml-2"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stores found with status: {selectedStatus}</p>
          </div>
        )}
      </div>
    </div>
  )
}

