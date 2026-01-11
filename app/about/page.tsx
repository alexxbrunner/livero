import Link from 'next/link'
import DefaultLayout from '@/components/DefaultLayout'
import { Store, Users, Target, TrendingUp, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <DefaultLayout>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            About Livero
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're building the future of local furniture retail by connecting cities, stores, and customers
            through collective marketing and shared success.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Traditional furniture retail is fragmented. Each store fights alone for visibility, spending
                heavily on advertising while competing against e-commerce giants.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Livero changes this. We believe local furniture stores are stronger together. By pooling
                marketing budgets and creating city-wide marketplaces, we give customers a better shopping
                experience while helping stores thrive.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform creates network effects: each new store makes the marketplace more valuable for
                everyone—stores, customers, and cities.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"
                alt="Our mission"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Users className="w-10 h-10" />}
              title="Local First"
              description="We believe in the power of local businesses and communities working together for mutual benefit."
            />
            <ValueCard
              icon={<Heart className="w-10 h-10" />}
              title="Fair & Transparent"
              description="Fixed pricing, clear terms, and shared success. No hidden fees, no surprises."
            />
            <ValueCard
              icon={<TrendingUp className="w-10 h-10" />}
              title="Growth Together"
              description="When one store succeeds, everyone benefits. We're building collective prosperity."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, effective, and beneficial for everyone</p>
          </div>
          
          <div className="space-y-16">
            <StepCard
              number="1"
              title="Stores Join the City Network"
              description="Furniture stores in a city pay a fixed monthly fee (€500). No individual advertising spend needed."
              image="https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800"
            />
            <StepCard
              number="2"
              title="80% Goes to Marketing Fund"
              description="Most of the fee (€400) goes into a shared city marketing pool. This creates a powerful collective budget."
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
              reverse
            />
            <StepCard
              number="3"
              title="Automated Inventory Sync"
              description="Stores connect their e-commerce platform (Shopify, WooCommerce, Shopware) and products sync automatically."
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
            />
            <StepCard
              number="4"
              title="Customers Discover & Shop"
              description="City residents browse all furniture in one place, discover new stores, and shop local effortlessly."
              image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
              reverse
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="1" label="City Live" />
            <StatCard number="3" label="Active Stores" />
            <StatCard number="28" label="Products Listed" />
            <StatCard number="€1,200" label="Monthly Marketing Fund" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Livero was founded with a simple vision: help local furniture stores compete in the digital age
              by working together instead of fighting alone. We're a team passionate about supporting local
              businesses and building stronger communities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're a store owner or a furniture shopper, there's a place for you on Livero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Join as Store Owner
            </Link>
            <Link href="/cities" className="btn-secondary text-lg px-8 py-4">
              Explore Cities
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

function ValueCard({ icon, title, description }: any) {
  return (
    <div className="card p-8 text-center hover:shadow-xl transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description, image, reverse = false }: any) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mr-4">
            {number}
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed pl-16">{description}</p>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        <img src={image} alt={title} className="rounded-lg shadow-lg" />
      </div>
    </div>
  )
}

function StatCard({ number, label }: any) {
  return (
    <div>
      <div className="text-5xl font-serif font-bold mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  )
}

