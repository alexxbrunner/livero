'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import StoreLayout from '@/components/StoreLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {  Package, Search, Edit2, Save, X, Euro, Tag, Eye } from 'lucide-react'

export default function ProductsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      const [storeRes, productsRes] = await Promise.all([
        api.get('/stores/me'),
        api.get('/stores/me/products'),
      ])

      setStore(storeRes.data)
      setProducts(productsRes.data)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPrice = (product: any) => {
    setEditingProduct(product.id)
    setEditPrice(product.price.toString())
  }

  const handleSavePrice = async (productId: string) => {
    try {
      await api.patch(`/stores/me/products/${productId}`, {
        price: parseFloat(editPrice),
      })
      
      // Update local state
      setProducts(products.map(p => 
        p.id === productId ? { ...p, price: parseFloat(editPrice) } : p
      ))
      
      setEditingProduct(null)
      toast.success('Price updated successfully')
    } catch (error) {
      toast.error('Failed to update price')
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setEditPrice('')
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading products...</p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  if (!store) return null

  return (
    <StoreLayout storeName={store.name} storeSlug={store.slug}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Products</h1>
          <p className="text-neutral-600">Manage your product catalog and pricing</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Products</p>
                <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Available</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {products.filter(p => p.availability).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Categories</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {new Set(products.map(p => p.category).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-900">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-900">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-900">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-900">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-900">SKU</th>
                  <th className="text-right p-4 text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {product.images?.urls?.[0] && (
                          <img
                            src={product.images.urls[0]}
                            alt={product.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="max-w-xs">
                          <p className="font-medium text-neutral-900 truncate">{product.title}</p>
                          <p className="text-sm text-neutral-500 truncate">{product.description?.substring(0, 60)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4">
                      {editingProduct === product.id ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Euro className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-32 pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                              step="0.01"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="font-semibold text-neutral-900">€{product.price}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          product.availability
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-neutral-600">{product.sku || '-'}</p>
                    </td>
                    <td className="p-4 text-right">
                      {editingProduct === product.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSavePrice(product.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditPrice(product)}
                          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit price"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">
                {searchTerm ? 'No products found matching your search' : 'No products synced yet'}
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Product prices can be adjusted here for the Livero platform. Changes won't affect your store's original pricing. Other product details are synced from your store.
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}

