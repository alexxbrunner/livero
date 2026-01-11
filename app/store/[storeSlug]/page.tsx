'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import FavoriteButton from '@/components/FavoriteButton'
import api from '@/lib/api'
import { Store, ArrowLeft, ExternalLink, MapPin, Search, SlidersHorizontal, Package } from 'lucide-react'
import { priceRanges } from '@/lib/categories'

export default function StorePage() {
  const params = useParams()
  const storeSlug = params?.storeSlug as string

  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (storeSlug) {
      fetchData()
    }
  }, [storeSlug, selectedCategory, priceRange, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [storeRes, productsRes] = await Promise.all([
        api.get(`/stores/${storeSlug}`),
        api.get('/products', {
          params: {
            storeSlug,
            category: selectedCategory,
            minPrice: priceRange?.min,
            maxPrice: priceRange?.max,
            search: searchQuery,
          }
        }),
      ])

      setStore(storeRes.data)
      setProducts(productsRes.data.products)
      
      // Get unique categories from products
      // Note: Ideally we would get available categories from the API, but for now we can infer or fetch separately
      // Let's assume we can get categories from a separate endpoint or filter from all store products.
      // For this MVP, we will fetch all categories for the store
      const catsRes = await api.get(`/products/categories/${storeRes.data.city.slug}`)
      setCategories(catsRes.data) 
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading store...</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (!store) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-4">Store Not Found</h2>
            <Link href="/" className="text-neutral-600 hover:text-neutral-900">
              Return to homepage
            </Link>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      {/* Store Hero */}
      <div className="bg-[#faf9f8] border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-32 h-32 rounded-lg object-contain bg-white shadow-sm p-4"
              />
            ) : (
              <div className="w-32 h-32 bg-white shadow-sm rounded-lg flex items-center justify-center text-neutral-300">
                <Store className="w-12 h-12" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900">{store.name}</h1>
                <div className="flex items-center text-neutral-500 text-sm uppercase tracking-wider">
                  <MapPin className="w-4 h-4 mr-1" />
                  {store.city.name}, {store.city.country}
                </div>
              </div>
              
              {store.description && (
                <p className="text-neutral-600 leading-relaxed max-w-2xl mb-6 font-light">
                  {store.description}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {store.websiteUrl && (
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors uppercase tracking-widest text-xs font-medium inline-flex items-center"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
                <span className="text-neutral-500 uppercase tracking-widest text-xs inline-flex items-center">
                  <Package className="w-3 h-3 mr-1" />
                  {store._count?.products || products.length} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-4 flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Refine
                  </h3>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wider">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10"
                      placeholder="Search store..."
                    />
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wider">Categories</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          checked={!selectedCategory}
                          onChange={() => setSelectedCategory(null)}
                          className="mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">All Categories</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="mr-3 w-4 h-4"
                          />
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wider">Price</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        checked={!priceRange}
                        onChange={() => setPriceRange(null)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900">All Prices</span>
                    </label>
                    {priceRanges.map((range) => (
                      <label key={range.label} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          checked={priceRange?.label === range.label}
                          onChange={() => setPriceRange(range)}
                          className="mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                {(selectedCategory || priceRange || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange(null)
                      setSearchQuery('')
                    }}
                    className="w-full text-sm text-neutral-600 hover:text-neutral-900 font-medium uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-2">
                  Store Collection
                </h2>
                <p className="text-neutral-600">
                  Showing {products.length} products from {store.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16 bg-neutral-50 border border-neutral-100">
                  <p className="text-neutral-500 text-lg mb-4 font-light">No products match your filters</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange(null)
                      setSearchQuery('')
                    }}
                    className="text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors uppercase tracking-widest text-sm font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

function ProductCard({ product }: { product: any }) {
  const imageUrl = product.images?.urls?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 mb-4">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!product.availability && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium text-sm uppercase tracking-wider">Sold Out</span>
            </div>
          )}
          {/* Favorite Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FavoriteButton productId={product.id} size="sm" />
          </div>
        </div>
      </Link>
      
      <div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-semibold text-neutral-900">
            €{product.price}
          </span>
          {product.category && (
            <span className="text-xs text-neutral-500">{product.category}</span>
          )}
        </div>
      </div>
    </div>
  )
}

