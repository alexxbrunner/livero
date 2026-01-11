'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import FavoriteButton from '@/components/FavoriteButton'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store, ArrowLeft, ExternalLink, Phone, Mail } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.productId as string

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${productId}`)
      setProduct(data)
      
      // Fetch related products (same category or city)
      if (data.city?.slug) {
        const relatedRes = await api.get('/products', {
          params: {
            citySlug: data.city.slug,
            limit: 3,
          }
        })
        // Filter out current product
        setRelatedProducts(relatedRes.data.products.filter((p: any) => p.id !== data.id).slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleClickToStore = async () => {
    try {
      await api.post(`/products/${productId}/click`)
      if (product.url) {
        window.open(product.url, '_blank')
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  const handleRequestInfo = async () => {
    try {
      await api.post(`/products/${productId}/request`, {
        metadata: { timestamp: new Date().toISOString() },
      })
      toast.success('Request sent! The store will contact you soon.')
    } catch (error) {
      console.error('Error tracking request:', error)
      toast.error('Failed to send request')
    }
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading product...</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (!product) {
    return null
  }

  const imageUrl = product.images?.urls?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'

  return (
    <DefaultLayout>
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-xs uppercase tracking-widest text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span className="mx-4 text-neutral-300">/</span>
            <Link href={`/city/${product.city.slug}`} className="hover:text-neutral-900 transition-colors">{product.city.name}</Link>
            {product.category && (
              <>
                <span className="mx-4 text-neutral-300">/</span>
                <Link href={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-neutral-900 transition-colors">{product.category}</Link>
              </>
            )}
            <span className="mx-4 text-neutral-300">/</span>
            <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Product Image - Left Side (Larger) */}
          <div className="lg:col-span-8">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-4">
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info - Right Side (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="mb-8 border-b border-neutral-100 pb-8">
                <div className="flex items-start justify-between mb-4">
                  <Link
                    href={`/store/${product.store.slug}`}
                    className="text-sm uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
                  >
                    {product.store.name}
                  </Link>
                  <FavoriteButton productId={productId} size="md" />
                </div>
                <h1 className="text-4xl font-serif font-medium text-neutral-900 mb-4 leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-light text-neutral-900">
                    €{product.price}
                  </span>
                  {product.category && (
                    <span className="text-sm text-neutral-500 uppercase tracking-wider">{product.category}</span>
                  )}
                </div>

                {/* Installment Payment Info */}
                <div className="mb-8 p-4 bg-neutral-50 border border-neutral-100 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs uppercase tracking-wider font-medium text-neutral-900">Flexible Payments</span>
                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] uppercase tracking-widest">New</span>
                  </div>
                  <p className="text-sm text-neutral-600 font-light">
                    Pay in 3 interest-free installments of <span className="font-medium text-neutral-900">€{(product.price / 3).toFixed(2)}</span> with Klarna or PayPal.
                  </p>
                </div>

                <div className="prose prose-neutral text-neutral-600 font-light leading-relaxed mb-8">
                  <p className="line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {product.description || 'Experience the perfect blend of form and function with this exquisite piece. Meticulously crafted to enhance your living space, it represents the finest in contemporary European design.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleClickToStore}
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800 py-4 px-6 text-sm uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Visit Online Store
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRequestInfo}
                    className="w-full bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900 py-4 px-6 text-sm uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Request Information
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Store Info Card */}
              <div className="bg-neutral-50 p-6 border border-neutral-100">
                <h3 className="font-serif text-lg font-medium mb-4">Sold by {product.store.name}</h3>
                <div className="flex items-start gap-4 mb-4">
                  {product.store.logoUrl ? (
                    <img
                      src={product.store.logoUrl}
                      alt={product.store.name}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                      <Store className="w-6 h-6 text-neutral-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-neutral-600 font-light leading-relaxed mb-2">
                      {product.store.description || 'Premium furniture retailer offering a curated selection of high-quality pieces.'}
                    </div>
                    {product.store.city && (
                      <div className="text-xs text-neutral-500 uppercase tracking-wider">
                        Based in {product.store.city.name}
                      </div>
                    )}
                  </div>
                </div>
                {product.store.websiteUrl && (
                  <a
                    href={product.store.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest text-neutral-900 hover:text-neutral-600 border-b border-neutral-300 hover:border-neutral-600 pb-0.5 transition-colors inline-flex items-center gap-1"
                  >
                    View Store Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Also Viewed Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-neutral-100 pt-16">
            <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-12 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/product/${related.id}`} className="group">
                  <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 mb-4">
                    <img
                      src={related.images?.urls?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                      {related.store.name}
                    </p>
                    <h3 className="font-medium text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-600 transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-lg font-light text-neutral-900">
                      €{related.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}

