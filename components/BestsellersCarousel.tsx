'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function BestsellersCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemsPerView, setItemsPerView] = useState(4)

  useEffect(() => {
    fetchBestsellers()
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const updateItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }
  }

  const fetchBestsellers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/products/bestsellers`)
      if (!response.ok) {
        throw new Error('Failed to fetch bestsellers')
      }
      const data = await response.json()
      setProducts(data.products || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching bestsellers:', err)
      setError('Failed to load bestsellers')
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= products.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    )
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex + itemsPerView < products.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    )
  }

  if (error || products.length === 0) {
    return null
  }

  return (
    <div className="relative px-12">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Link href={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Bestseller
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-neutral-500">{product.store.name}</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {product.city.currency} {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/3 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all z-10 ${
              canGoPrev 
                ? 'hover:bg-neutral-100 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </button>
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/3 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all z-10 ${
              canGoNext 
                ? 'hover:bg-neutral-100 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-neutral-900" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, Math.ceil((products.length - itemsPerView + 1))) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

