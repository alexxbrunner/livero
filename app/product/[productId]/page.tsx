'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import FavoriteButton from '@/components/FavoriteButton'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store, ArrowLeft, ExternalLink, Phone, Mail, Award, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import { trackProductView, trackProductClick } from '@/lib/analytics'
import { fbViewContent } from '@/lib/facebook-pixel'

export default function ProductPage() {
  const { t } = useI18n()
  const params = useParams()
  const router = useRouter()
  const productId = params?.productId as string

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    specifications: false,
    shipping: false,
    returns: false,
  })

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${productId}`)
      setProduct(data)
      
      // Track product view in Google Analytics
      trackProductView({
        id: data.id,
        name: data.title,
        price: data.price,
        category: data.category || 'Uncategorized',
        brand: data.brand || data.store?.name,
      })
      
      // Track product view in Facebook Pixel
      fbViewContent({
        id: data.id,
        name: data.title,
        price: data.price,
        category: data.category,
        brand: data.brand || data.store?.name,
      })
      
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
      toast.error(t('product.productNotFound'))
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
      toast.success(t('product.requestSent'))
    } catch (error) {
      console.error('Error tracking request:', error)
      toast.error(t('product.requestError'))
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">{t('product.loading')}</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (!product) {
    return null
  }

  // Get product images (support both array and object format)
  const productImages = product.images?.urls || [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
  ]
  
  const selectedImage = productImages[selectedImageIndex] || productImages[0]
  
  // Extract brand from product metadata or use store name
  const brandName = product.brand || product.store.name
  const brandDescription = product.brandDescription || t('product.defaultBrandDescription')

  return (
    <DefaultLayout>
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-xs uppercase tracking-widest text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">{t('product.home')}</Link>
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
          {/* Product Images - Left Side (Larger) */}
          <div className="lg:col-span-8">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-4 rounded-lg">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-neutral-100 overflow-hidden rounded-lg transition-all ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-neutral-900 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-neutral-300 hover:ring-offset-2'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
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
                    <span className="text-xs uppercase tracking-wider font-medium text-neutral-900">{t('product.flexiblePayments')}</span>
                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] uppercase tracking-widest">{t('product.new')}</span>
                  </div>
                  <p className="text-sm text-neutral-600 font-light">
                    {t('product.installmentText', { amount: `€${(product.price / 3).toFixed(2)}` })}
                  </p>
                </div>

                <div className="prose prose-neutral text-neutral-600 font-light leading-relaxed mb-8">
                  <p className="line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {product.description || t('product.defaultDescription')}
                  </p>
                </div>

                {/* Brand Information */}
                <div className="mb-8 p-5 bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {product.store.logoUrl ? (
                        <img
                          src={product.store.logoUrl}
                          alt={brandName}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Award className="w-7 h-7 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm uppercase tracking-widest font-semibold text-neutral-900">
                          {brandName}
                        </h4>
                        <Tag className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                        {brandDescription}
                      </p>
                      <Link
                        href={`/store/${product.store.slug}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-900 hover:text-neutral-600 font-medium transition-colors group"
                      >
                        {t('product.exploreBrand')}
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleClickToStore}
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800 py-4 px-6 text-sm uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {t('product.visitStore')}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRequestInfo}
                    className="w-full bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900 py-4 px-6 text-sm uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {t('product.requestInfo')}
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Information Sections */}
              <div className="mb-8 border border-neutral-200 rounded-lg overflow-hidden">
                {/* Description Section */}
                <div className="border-b border-neutral-200 last:border-b-0">
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <span className="font-medium text-neutral-900 uppercase tracking-wider text-sm">
                      {t('product.productDetails')}
                    </span>
                    {expandedSections.description ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                  {expandedSections.description && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {product.description || t('product.defaultProductDetails')}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-neutral-500 mt-4">
                          {t('product.spec.sku')}: {product.sku}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Specifications Section */}
                <div className="border-b border-neutral-200 last:border-b-0">
                  <button
                    onClick={() => toggleSection('specifications')}
                    className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <span className="font-medium text-neutral-900 uppercase tracking-wider text-sm">
                      {t('product.specifications')}
                    </span>
                    {expandedSections.specifications ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                  {expandedSections.specifications && (
                    <div className="px-5 pb-5">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">{t('product.spec.category')}</span>
                          <span className="text-neutral-900 font-medium">{product.category || 'Furniture'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">{t('product.spec.brand')}</span>
                          <span className="text-neutral-900 font-medium">{brandName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">{t('product.spec.material')}</span>
                          <span className="text-neutral-900 font-medium">{t('product.spec.materialValue')}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">{t('product.spec.availability')}</span>
                          <span className="text-green-600 font-medium">{t('product.spec.inStock')}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-neutral-500">{t('product.spec.origin')}</span>
                          <span className="text-neutral-900 font-medium">{product.city?.name || t('product.spec.originValue')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Section */}
                <div className="border-b border-neutral-200 last:border-b-0">
                  <button
                    onClick={() => toggleSection('shipping')}
                    className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <span className="font-medium text-neutral-900 uppercase tracking-wider text-sm">
                      {t('product.shippingDelivery')}
                    </span>
                    {expandedSections.shipping ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                  {expandedSections.shipping && (
                    <div className="px-5 pb-5">
                      <div className="space-y-3 text-sm text-neutral-600">
                        <p>
                          <strong className="text-neutral-900">{t('product.shipping.deliveryTime')}</strong> {t('product.shipping.deliveryTimeText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.shipping.shippingCosts')}</strong> {t('product.shipping.shippingCostsText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.shipping.whiteGlove')}</strong> {t('product.shipping.whiteGloveText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.shipping.inStorePickup')}</strong> {t('product.shipping.inStorePickupText', { store: product.store.name, city: product.city?.name || '' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Returns Section */}
                <div>
                  <button
                    onClick={() => toggleSection('returns')}
                    className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <span className="font-medium text-neutral-900 uppercase tracking-wider text-sm">
                      {t('product.returnsWarranty')}
                    </span>
                    {expandedSections.returns ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                  {expandedSections.returns && (
                    <div className="px-5 pb-5">
                      <div className="space-y-3 text-sm text-neutral-600">
                        <p>
                          <strong className="text-neutral-900">{t('product.returns.returnPolicy')}</strong> {t('product.returns.returnPolicyText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.returns.returnShipping')}</strong> {t('product.returns.returnShippingText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.returns.warranty')}</strong> {t('product.returns.warrantyText')}
                        </p>
                        <p>
                          <strong className="text-neutral-900">{t('product.returns.damageClaims')}</strong> {t('product.returns.damageClaimsText')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Info Card */}
              <div className="bg-neutral-50 p-6 border border-neutral-100">
                <h3 className="font-serif text-lg font-medium mb-4">{t('product.soldBy', { store: product.store.name })}</h3>
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
                      {product.store.description || t('product.defaultStoreDescription')}
                    </div>
                    {product.store.city && (
                      <div className="text-xs text-neutral-500 uppercase tracking-wider">
                        {t('product.basedIn', { city: product.store.city.name })}
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
                    {t('product.viewStoreProfile')}
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
              {t('product.youMayAlsoLike')}
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

