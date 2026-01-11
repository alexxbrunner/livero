'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import api from '@/lib/api'
import { Store, Filter, Search, SlidersHorizontal, ArrowRight, Package } from 'lucide-react'
import { priceRanges } from '@/lib/categories'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params?.categorySlug as string

  const [products, setProducts] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categorySlug) {
      fetchData()
    }
  }, [categorySlug, selectedCity, priceRange, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, citiesRes] = await Promise.all([
        api.get('/products', {
          params: {
            category: decodeURIComponent(categorySlug).replace(/-/g, ' '),
            citySlug: selectedCity,
            minPrice: priceRange?.min,
            maxPrice: priceRange?.max,
            search: searchQuery,
          },
        }),
        api.get('/cities'),
      ])
      
      setProducts(productsRes.data.products)
      setCities(citiesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryName = decodeURIComponent(categorySlug).replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

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

  return (
    <DefaultLayout>
      {/* Hero */}
      <section className="py-24 bg-[#faf9f8] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">Collection</p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            {categoryName}
          </h1>
          <div className="w-16 h-px bg-neutral-900 mx-auto mb-8"></div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our curated selection of {categoryName.toLowerCase()} furniture from Europe's finest stores.
          </p>
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

                {/* Cities */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wider">Cities</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        checked={!selectedCity}
                        onChange={() => setSelectedCity(null)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900">All Cities</span>
                    </label>
                    {cities.map((city) => (
                      <label key={city.id} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          checked={selectedCity === city.slug}
                          onChange={() => setSelectedCity(city.slug)}
                          className="mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{city.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

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
                {(selectedCity || priceRange || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCity(null)
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
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-neutral-900 mb-2">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                  </h2>
                  <p className="text-neutral-600">
                    Showing results for {categoryName.toLowerCase()}
                  </p>
                </div>
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
                      setSelectedCity(null)
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
    <Link href={`/product/${product.id}`} className="group">
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

