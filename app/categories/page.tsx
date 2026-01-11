import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import { Store, ArrowRight } from 'lucide-react'
import { categories } from '@/lib/categories'

export default function CategoriesPage() {
  return (
    <DefaultLayout>

      {/* Hero */}
      <section className="py-24 bg-[#faf9f8] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">Collections</p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            Browse by Category
          </h1>
          <div className="w-16 h-px bg-neutral-900 mx-auto mb-8"></div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Find exactly what you're looking for from our curated selection of Europe's best local furniture stores.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group block"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100 mb-6">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-medium text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-500 font-light tracking-wide uppercase">
                    View Collection
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="mt-32 text-center bg-neutral-50 p-16 border border-neutral-100">
            <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-4">
              Looking for something specific?
            </h2>
            <p className="text-neutral-600 mb-8 max-w-xl mx-auto font-light">
              Explore our city collections to find unique pieces available near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/city/vienna" className="inline-block border-b border-neutral-900 pb-1 text-sm uppercase tracking-widest font-medium hover:text-neutral-600 hover:border-neutral-600 transition-colors">
                Explore Vienna
              </Link>
              <Link href="/" className="inline-block border-b border-neutral-900 pb-1 text-sm uppercase tracking-widest font-medium hover:text-neutral-600 hover:border-neutral-600 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

