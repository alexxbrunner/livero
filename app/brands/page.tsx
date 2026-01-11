'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import api from '@/lib/api'
import { Search, Store, MapPin, Package } from 'lucide-react'

export default function BrandsPage() {
  const [stores, setStores] = useState<any[]>([])
  const [filteredStores, setFilteredStores] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterStores()
  }, [selectedCity, searchQuery, stores])

  const fetchData = async () => {
    try {
      const [storesRes, citiesRes] = await Promise.all([
        api.get('/stores'),
        api.get('/cities'),
      ])
      setStores(storesRes.data)
      setCities(citiesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterStores = () => {
    let filtered = [...stores]

    if (selectedCity) {
      filtered = filtered.filter(store => store.cityId === selectedCity)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.description?.toLowerCase().includes(query)
      )
    }

    setFilteredStores(filtered)
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading brands...</p>
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
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">Our Partners</p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            Featured Brands & Stores
          </h1>
          <div className="w-16 h-px bg-neutral-900 mx-auto mb-8"></div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the finest local furniture retailers and design boutiques across Europe.
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between border-b border-neutral-100 pb-8">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSelectedCity(null)}
                className={`px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-medium transition-all ${
                  !selectedCity
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-medium transition-all ${
                    selectedCity === city.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
                placeholder="Search brands..."
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-8 text-neutral-500 text-sm uppercase tracking-wider">
            Showing {filteredStores.length} {filteredStores.length === 1 ? 'Brand' : 'Brands'}
          </div>

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <Link
                key={store.id}
                href={`/store/${store.slug}`}
                className="group border border-neutral-100 hover:border-neutral-300 transition-all duration-300 bg-white"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    {store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <Store className="w-8 h-8" />
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-end gap-1">
                        <MapPin className="w-3 h-3" />
                        {store.city?.name}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-neutral-500 flex items-center justify-end gap-1">
                        <Package className="w-3 h-3" />
                        {store._count?.products || 0} Products
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-medium text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-neutral-600 font-light text-sm line-clamp-3 mb-6 leading-relaxed">
                    {store.description || 'Premium furniture retailer offering a curated selection of high-quality pieces.'}
                  </p>
                  
                  <span className="text-sm uppercase tracking-widest font-medium border-b border-neutral-900 pb-0.5 group-hover:text-neutral-600 group-hover:border-neutral-600 transition-colors">
                    View Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-24 bg-neutral-50 border border-neutral-100">
              <p className="text-neutral-500 text-lg mb-4 font-light">No brands match your search.</p>
              <button
                onClick={() => {
                  setSelectedCity(null)
                  setSearchQuery('')
                }}
                className="text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors uppercase tracking-widest text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  )
}

