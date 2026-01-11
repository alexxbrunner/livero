'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface FavoriteButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function FavoriteButton({ productId, size = 'md', showText = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuthStore()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  useEffect(() => {
    if (user?.role === 'CUSTOMER' && token) {
      checkFavoriteStatus()
    }
  }, [productId, user, token])

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await api.get(`/customer/favorites/check/${productId}`)
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to save favorites')
      return
    }

    if (user.role !== 'CUSTOMER') {
      toast.error('Only customers can save favorites')
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        await api.delete(`/customer/favorites/${productId}`)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await api.post(`/customer/favorites/${productId}`)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update favorites')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== 'CUSTOMER') {
    return null
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} ${
        showText ? 'px-4 w-auto' : ''
      } flex items-center justify-center gap-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={iconSizes[size]}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}

