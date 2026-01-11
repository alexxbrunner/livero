import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import BestsellersCarousel from '@/components/BestsellersCarousel'
import { categories } from '@/lib/categories'
import { Store, TrendingUp, Users, Heart, ArrowRight, MapPin } from 'lucide-react'

const cities = [
  {
    name: 'Vienna',
    slug: 'vienna',
    country: 'Austria',
    stores: 3,
    products: 27,
    image: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800',
    description: 'Imperial elegance meets modern design'
  },
  {
    name: 'Munich',
    slug: 'munich',
    country: 'Germany',
    stores: 0,
    products: 0,
    image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800',
    description: 'Bavarian craftsmanship and contemporary style',
    comingSoon: true
  },
  {
    name: 'Berlin',
    slug: 'berlin',
    country: 'Germany',
    stores: 0,
    products: 0,
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    description: 'Urban chic and avant-garde interiors',
    comingSoon: true
  },
  {
    name: 'Bratislava',
    slug: 'bratislava',
    country: 'Slovakia',
    stores: 0,
    products: 0,
    image: 'https://images.unsplash.com/photo-1598258128610-ae1b6aef9f6a?w=800',
    description: 'Eastern European charm and modern luxury',
    comingSoon: true
  },
  {
    name: 'Košice',
    slug: 'kosice',
    country: 'Slovakia',
    stores: 0,
    products: 0,
    image: 'https://images.unsplash.com/photo-1598258128610-ae1b6aef9f6a?w=800',
    description: 'Historic beauty meets contemporary design',
    comingSoon: true
  },
  {
    name: 'Zurich',
    slug: 'zurich',
    country: 'Switzerland',
    stores: 0,
    products: 0,
    image: 'https://images.unsplash.com/photo-1568948856944-e64bf1acc5cd?w=800',
    description: 'Swiss precision and timeless elegance',
    comingSoon: true
  },
]

export default function HomePage() {
  return (
    <DefaultLayout>
      {/* Hero Section - Luxury Style */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920"
            alt="Luxury interior"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/90 mb-8 font-medium">
            The World of Premium Interiors
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-medium mb-10 leading-[1.1] tracking-tight">
            Curated Luxury<br />for Your Home
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            Discover exquisite furniture from Europe's finest interior boutiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/city/vienna" className="bg-white text-neutral-900 hover:bg-neutral-100 px-10 py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300 min-w-[200px]">
              Explore Vienna
            </Link>
            <Link href="/categories" className="bg-transparent border border-white text-white hover:bg-white/10 px-10 py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300 min-w-[200px]">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900 mb-6">Our Cities</h2>
            <div className="w-24 h-1 bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
              Bringing together the finest furniture stores in Europe's most beautiful cities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>

          <div className="mt-24 text-center p-16 bg-neutral-50 border border-neutral-100">
            <h3 className="text-3xl font-serif font-medium text-neutral-900 mb-4">
              Don't See Your City?
            </h3>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto font-light">
              We're expanding to new cities every month. Request your city and be the first to know when we launch.
            </p>
            <Link href="/request-city" className="inline-flex items-center text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors uppercase tracking-widest text-sm font-medium">
              Request Your City
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900 mb-6">Bestsellers</h2>
            <div className="w-24 h-1 bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
              Discover the most loved pieces from our curated collection.
            </p>
          </div>
          
          <BestsellersCarousel />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900 mb-6">Shop by Category</h2>
            <div className="w-24 h-1 bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
              Handpicked collections from Europe's most prestigious furniture stores.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-white block"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h3 className="font-serif text-2xl font-medium text-white mb-2">{category.name}</h3>
                  <div className="h-px w-0 group-hover:w-12 bg-white mx-auto transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/categories" className="btn-primary inline-flex items-center">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Livero */}
      <section className="py-32 bg-white text-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-medium mb-6">The Livero Standard</h2>
            <div className="w-24 h-1 bg-neutral-900 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 border border-neutral-200 rounded-full group-hover:border-neutral-900 transition-colors duration-300">
                <Store className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-4">Curated Selection</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Only the finest stores and artisans, handpicked for their exceptional quality and design philosophy.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 border border-neutral-200 rounded-full group-hover:border-neutral-900 transition-colors duration-300">
                <Heart className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-4">Local Excellence</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Support your city's finest furniture makers while discovering pieces you'll cherish for years.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 border border-neutral-200 rounded-full group-hover:border-neutral-900 transition-colors duration-300">
                <Users className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-4">Expert Service</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Connect directly with store owners who bring decades of expertise and passion to every piece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Owners CTA */}
      <section className="py-32 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8">
            Partner with Livero
          </h2>
          <p className="text-xl text-neutral-300 mb-12 leading-relaxed font-light">
            Join our exclusive network of premium retailers and reach discerning customers who appreciate exceptional quality.
          </p>
          <Link href="/register" className="bg-white text-neutral-900 hover:bg-neutral-100 px-10 py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300">
            Apply for Partnership
          </Link>
        </div>
      </section>
    </DefaultLayout>
  )
}

function CityCard({ city }: { city: any }) {
  return (
    <Link 
      href={city.comingSoon ? '#' : `/city/${city.slug}`} 
      className={`group card overflow-hidden hover:shadow-2xl transition-all duration-300 ${city.comingSoon ? 'cursor-default' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!city.comingSoon && 'group-hover:scale-110'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {city.comingSoon && (
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">{city.country}</span>
          </div>
          <h3 className="text-3xl font-serif font-semibold mb-2">{city.name}</h3>
          <p className="text-sm text-neutral-200 mb-3">{city.description}</p>
          
          {!city.comingSoon && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Store className="w-4 h-4" />
                <span>{city.stores} stores</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{city.products} products</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!city.comingSoon && (
        <div className="p-6 bg-white">
          <div className="flex items-center text-neutral-900 font-medium group-hover:text-neutral-700">
            <span className="uppercase tracking-wider text-sm">Explore {city.name}</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}
      
      {city.comingSoon && (
        <div className="p-6 bg-neutral-50">
          <p className="text-sm text-neutral-600">
            Be the first to know when we launch in {city.name}
          </p>
        </div>
      )}
    </Link>
  )
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />
    </svg>
  )
}
