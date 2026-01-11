'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function FavoriteButton({ productId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  // Size classes
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
    if (user?.role === 'CUSTOMER') {
      checkFavoriteStatus()
    }
  }, [productId, user])

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
      toast.error('Please login to save favorites')
      router.push('/login')
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
      console.error('Error toggling favorite:', error)
      toast.error(error.response?.data?.error || 'Failed to update favorites')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        rounded-full
        bg-white/90 backdrop-blur-sm
        border border-neutral-200
        hover:bg-white hover:border-neutral-300
        transition-all duration-200
        group
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-neutral-600 group-hover:text-red-500 group-hover:scale-110'
          }
        `}
      />
    </button>
  )
}
