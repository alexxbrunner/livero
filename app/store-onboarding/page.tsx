'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store as StoreIcon } from 'lucide-react'

export default function StoreOnboarding() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    cityId: '',
    platform: 'SHOPIFY',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    credentials: {
      shopUrl: '',
      apiKey: '',
      apiSecret: '',
    },
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetchCities()
  }, [token])

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/cities')
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/stores', formData)
      toast.success('Store created successfully! Awaiting admin approval.')
      router.push('/store-dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: any) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateCredentials = (updates: any) => {
    setFormData((prev) => ({
      ...prev,
      credentials: { ...prev.credentials, ...updates },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <StoreIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Livero!</h1>
          <p className="text-gray-600">Let's set up your store in just a few steps</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-600'}>Store Info</span>
            <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-600'}>Platform</span>
            <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-600'}>Review</span>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Store Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    className="input"
                    placeholder="Nordic Living"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => updateFormData({ cityId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => updateFormData({ logoUrl: e.target.value })}
                    className="input"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
                    className="input"
                    placeholder="https://yourstore.com"
                  />
                </div>

                <button type="button" onClick={() => setStep(2)} className="w-full btn-primary">
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Platform */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">E-commerce Platform</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['SHOPIFY', 'WOOCOMMERCE', 'SHOPWARE'].map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => updateFormData({ platform })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.platform === platform
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="block font-medium text-sm">{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> In production, you would enter your API credentials here to enable automatic
                    inventory sync. For now, we'll create a demo connection.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop URL</label>
                  <input
                    type="text"
                    value={formData.credentials.shopUrl}
                    onChange={(e) => updateCredentials({ shopUrl: e.target.value })}
                    className="input"
                    placeholder="yourstore.myshopify.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    type="text"
                    value={formData.credentials.apiKey}
                    onChange={(e) => updateCredentials({ apiKey: e.target.value })}
                    className="input"
                    placeholder="demo-key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                  <input
                    type="password"
                    value={formData.credentials.apiSecret}
                    onChange={(e) => updateCredentials({ apiSecret: e.target.value })}
                    className="input"
                    placeholder="demo-secret"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Store Name</p>
                    <p className="font-semibold text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold text-gray-900">
                      {cities.find((c) => c.id === formData.cityId)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform</p>
                    <p className="font-semibold text-gray-900">{formData.platform}</p>
                  </div>
                </div>

                <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Pricing</h3>
                  <p className="text-3xl font-bold text-primary-900 mb-2">
                    €{cities.find((c) => c.id === formData.cityId)?.monthlyFee || 500}/month
                  </p>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 80% (€400) goes to city marketing fund</li>
                    <li>• 20% (€100) platform fee</li>
                    <li>• No additional advertising costs</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Store'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

