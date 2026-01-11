'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import api from '@/lib/api'
import { Store, Filter, Search, SlidersHorizontal, ArrowRight, Package as PackageIcon } from 'lucide-react'
import { priceRanges } from '@/lib/categories'

export default function CityPage() {
  const params = useParams()
  const citySlug = params?.citySlug as string

  const [city, setCity] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (citySlug) {
      fetchData()
    }
  }, [citySlug, selectedCategory, selectedStore, priceRange, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cityRes, productsRes, categoriesRes] = await Promise.all([
        api.get(`/cities/${citySlug}`),
        api.get('/products', {
          params: {
            citySlug,
            category: selectedCategory,
            storeId: selectedStore,
            minPrice: priceRange?.min,
            maxPrice: priceRange?.max,
            search: searchQuery,
          },
        }),
        api.get(`/products/categories/${citySlug}`),
      ])

      setCity(cityRes.data)
      setProducts(productsRes.data.products)
      setCategories(categoriesRes.data)
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
            <p className="text-neutral-600">Loading collection...</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (!city) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-4">City Not Found</h2>
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
      {/* City Hero */}
      <section className="relative h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=1920"
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white w-full">
          <p className="text-sm uppercase tracking-widest text-neutral-300 mb-2">Premium Collection</p>
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-4">{city.name}</h1>
          <div className="flex items-center gap-6 text-neutral-200">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>{city.stores?.length || 0} Stores</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-5 h-5" />
              <span>{city._count?.products || 0} Products</span>
            </div>
          </div>
        </div>
      </section>

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
                      placeholder="Find products..."
                    />
                  </div>
                </div>

                {/* Stores */}
                {city.stores && city.stores.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wider">Stores</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          checked={!selectedStore}
                          onChange={() => setSelectedStore(null)}
                          className="mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">All Stores</span>
                      </label>
                      {city.stores.map((store: any) => (
                        <label key={store.id} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            checked={selectedStore === store.id}
                            onChange={() => setSelectedStore(store.id)}
                            className="mr-3 w-4 h-4"
                          />
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{store.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

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
                {(selectedCategory || selectedStore || priceRange || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedStore(null)
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
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </h2>
                <p className="text-neutral-600">
                  Curated selection from {city.name}'s finest furniture stores
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-neutral-500 text-lg mb-4">No products match your filters</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedStore(null)
                      setPriceRange(null)
                      setSearchQuery('')
                    }}
                    className="text-neutral-900 hover:text-neutral-700 font-medium"
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
    <Link href={`/product/${product.id}`} className="group">
      <div className="aspect-square relative overflow-hidden bg-neutral-100 mb-4">
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
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
          {product.store.name}
        </p>
        <h3 className="font-medium text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-semibold text-neutral-900">
            €{product.price}
          </span>
          {product.category && (
            <span className="text-xs text-neutral-500">{product.category}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
