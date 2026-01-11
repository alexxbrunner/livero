'use client'

import { useState } from 'react'
import DefaultLayout from '@/components/DefaultLayout'
import { MapPin, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RequestCityPage() {
  const [formData, setFormData] = useState({
    cityName: '',
    country: '',
    name: '',
    email: '',
    reason: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      toast.success('Request submitted successfully!')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-medium text-neutral-900 mb-4">
              Request Received!
            </h1>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Thank you for your interest in expanding Livero to <span className="font-medium text-neutral-900">{formData.cityName}</span>. We'll notify you as soon as we launch in your city.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ cityName: '', country: '', name: '', email: '', reason: '' })
              }}
              className="btn-primary"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            Request Your City
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Don't see your city on Livero yet? Let us know where you'd like to discover premium furniture, and we'll prioritize bringing Livero to your location.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                    City Name *
                  </label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Prague"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Czech Republic"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
                <p className="text-xs text-neutral-500 mt-2">
                  We'll use this to notify you when we launch in your city
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                  Why This City? (Optional)
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell us why we should prioritize your city..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-serif font-medium text-neutral-900 mb-4">
              What Happens Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-semibold text-neutral-900">1</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">We Review</h4>
                <p className="text-sm text-neutral-600">
                  Our team evaluates city requests based on demand and local furniture market
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-semibold text-neutral-900">2</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">Partner Search</h4>
                <p className="text-sm text-neutral-600">
                  We connect with premium furniture stores in your requested city
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-semibold text-neutral-900">3</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">You Get Notified</h4>
                <p className="text-sm text-neutral-600">
                  Be the first to know when Livero launches in your city
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

