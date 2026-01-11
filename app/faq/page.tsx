'use client'

import { useState } from 'react'
import DefaultLayout from '@/components/DefaultLayout'
import { HelpCircle, ChevronDown, ChevronUp, Package, CreditCard, Truck, RefreshCw, Shield, Store } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    category: 'Shopping',
    question: 'How does Livero work?',
    answer: 'Livero is a curated platform that connects you with premium furniture stores across Europe. Browse products from multiple stores in one place, then purchase directly from your chosen store. We make it easy to discover and buy from the finest furniture retailers in your city.',
  },
  {
    category: 'Shopping',
    question: 'Can I buy products directly on Livero?',
    answer: 'Livero is a discovery platform. When you find something you love, you\'ll be directed to the store\'s website or can request information from them directly. This ensures you get the best service and the most accurate product and pricing information.',
  },
  {
    category: 'Shopping',
    question: 'How do I know if a product is available?',
    answer: 'All products displayed on Livero are marked as available by the stores. However, we recommend contacting the store directly or clicking through to their website to confirm availability before visiting or making a purchase.',
  },
  {
    category: 'Pricing & Payment',
    question: 'Are prices shown final?',
    answer: 'Prices shown on Livero are provided by the stores and are generally accurate. However, final pricing, including any applicable taxes or delivery fees, should be confirmed directly with the store before purchase.',
  },
  {
    category: 'Pricing & Payment',
    question: 'Do you offer payment plans?',
    answer: 'Payment options vary by store. Many of our partner stores offer flexible payment plans through services like Klarna or PayPal. Check the product page or contact the store directly to learn about available payment options.',
  },
  {
    category: 'Delivery',
    question: 'How does delivery work?',
    answer: 'Each store manages its own delivery and shipping. Delivery options, costs, and timeframes vary depending on the store, your location, and the product. You\'ll receive detailed delivery information when you purchase from a store.',
  },
  {
    category: 'Delivery',
    question: 'Can I pick up products in-store?',
    answer: 'Yes! Many of our partner stores offer in-store pickup. This is often the fastest way to get your furniture and allows you to inspect items before taking them home. Contact the store to arrange pickup.',
  },
  {
    category: 'Returns',
    question: 'What is the return policy?',
    answer: 'Return policies are set by individual stores. Most stores offer a 30-day return period, but terms may vary. Always check the store\'s specific return policy before making a purchase, or contact them with questions.',
  },
  {
    category: 'Returns',
    question: 'How do I return a product?',
    answer: 'Contact the store you purchased from directly to initiate a return. They will guide you through their return process and arrange pickup or return shipping if applicable.',
  },
  {
    category: 'For Stores',
    question: 'How can my store join Livero?',
    answer: 'We\'re always looking for premium furniture stores to join our platform. Click "Register" and select "Store" as your account type. Our team will review your application and guide you through the onboarding process.',
  },
  {
    category: 'For Stores',
    question: 'What does it cost to join as a store?',
    answer: 'Livero charges a monthly city-based membership fee. Pricing varies by location and market. Contact our team for specific pricing information for your city.',
  },
  {
    category: 'For Stores',
    question: 'How are products synced to Livero?',
    answer: 'We automatically sync products from your e-commerce platform (Shopify, WooCommerce, or Shopware). Products are updated regularly to ensure accuracy. You maintain full control of your inventory through your existing store management system.',
  },
  {
    category: 'Account',
    question: 'Do I need an account to browse?',
    answer: 'No account is needed to browse products and stores. However, creating a free customer account allows you to save favorite products and receive personalized recommendations.',
  },
  {
    category: 'Account',
    question: 'How do I save favorite products?',
    answer: 'Create a free customer account, then click the heart icon on any product to save it to your favorites. Access your saved items anytime from the heart icon in the navigation bar.',
  },
  {
    category: 'Cities',
    question: 'Which cities are available on Livero?',
    answer: 'Livero currently operates in Vienna, with more European cities launching soon. Don\'t see your city? Request it through our "Request Your City" page and be notified when we launch in your area.',
  },
]

const categories = [...new Set(faqs.map(faq => faq.category))]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const categoryIcons: Record<string, any> = {
    'Shopping': Package,
    'Pricing & Payment': CreditCard,
    'Delivery': Truck,
    'Returns': RefreshCw,
    'For Stores': Store,
    'Account': Shield,
    'Cities': HelpCircle,
  }

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about shopping on Livero. Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Questions
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || HelpCircle
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2 block">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-medium text-neutral-900">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-neutral-900" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-500" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center p-12 bg-neutral-50 rounded-lg border border-neutral-100">
            <h3 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <a href="/contact" className="btn-primary inline-flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

