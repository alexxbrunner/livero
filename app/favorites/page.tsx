'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  imageUrl: string
  store: {
    name: string
    slug: string
  }
  city: {
    name: string
    currency: string
  }
}

interface Favorite {
  id: string
  createdAt: string
  product: Product
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'CUSTOMER') {
      router.push('/')
      toast.error('Only customers can access favorites')
      return
    }

    fetchFavorites()
  }, [user, router])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/customer/favorites')
      setFavorites(data.favorites)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await api.delete(`/customer/favorites/${productId}`)
      setFavorites(favorites.filter(f => f.product.id !== productId))
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to remove favorite')
    }
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
              <h1 className="text-4xl font-serif font-medium text-neutral-900">My Favorites</h1>
            </div>
            <p className="text-lg text-neutral-600">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-3">
                No favorites yet
              </h2>
              <p className="text-neutral-600 mb-8">
                Start exploring and save items you love
              </p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="group card overflow-hidden hover:shadow-xl transition-shadow">
                  <Link href={`/product/${favorite.product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      <img
                        src={favorite.product.imageUrl}
                        alt={favorite.product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <Link href={`/product/${favorite.product.id}`}>
                      <h3 className="font-medium text-neutral-900 line-clamp-2 mb-2 group-hover:text-neutral-600 transition-colors">
                        {favorite.product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-500 mb-3">
                      {favorite.product.store.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-neutral-900">
                        {favorite.product.city.currency} {favorite.product.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove from favorites"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}

