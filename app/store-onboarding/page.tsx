'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import OnboardingLayout from '@/components/OnboardingLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Store, ShoppingBag, CreditCard, CheckCircle, ArrowRight, Loader2, Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function StoreOnboardingPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Registration (handled via /register page)
  // Users are redirected here after registration

  // Step 2: Connect Store
  const [storeFormData, setStoreFormData] = useState({
    name: '',
    cityId: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
    platform: 'SHOPIFY',
    credentials: {
      apiKey: '',
      password: '',
      storeDomain: '',
    },
  });

  const [cities, setCities] = useState<any[]>([]);

  // Step 3: Choose Plan
  const [selectedPlan, setSelectedPlan] = useState('PRO');

  useEffect(() => {
    if (!token || !user) {
      router.push('/register');
      return;
    }

    // Check if already has a store
    checkExistingStore();
    fetchCities();
  }, [token, user]);

  const checkExistingStore = async () => {
    try {
      const { data } = await api.get('/stores/me');
      if (data && data.id) {
        // Store already exists, redirect to dashboard
        router.push('/store-dashboard');
      }
    } catch (error) {
      // No store found, continue onboarding
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/cities');
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleConnectStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/stores', storeFormData);
      toast.success(t('onboarding.messages.storeConnected'));
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('onboarding.messages.connectFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCompletOnboarding = async () => {
    setLoading(true);
    try {
      // Update store with selected plan (if needed)
      await api.patch('/stores/me', { plan: selectedPlan });
      toast.success(t('onboarding.messages.onboardingCompleted'));
      router.push('/store-dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('onboarding.messages.onboardingFailed'));
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: '€99',
      period: '/month',
      description: 'Perfect for small shops getting started',
      features: [
        'Up to 100 products',
        'Basic analytics',
        'Email support',
        'City marketplace listing',
        'Mobile-optimized storefront',
      ],
    },
    {
      id: 'PRO',
      name: 'Professional',
      price: '€199',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited products',
        'Advanced analytics dashboard',
        'Priority support',
        'Featured placement',
        'Collective marketing campaigns',
        'SEO optimization',
        'Team collaboration',
      ],
      recommended: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale operations',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'API access',
        'White-label options',
        'Multi-location support',
      ],
    },
  ];

  return (
    <OnboardingLayout currentStep={currentStep}>
      <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-16">
        {/* Step 1: Welcome (after registration) */}
        {currentStep === 1 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 mb-8">
              <CheckCircle className="w-10 h-10 text-green-600 stroke-[1.5]" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-medium text-neutral-900 mb-4 tracking-tight">
              {t('onboarding.welcome.title')}
            </h1>
            <p className="text-lg text-neutral-600 font-light mb-12 max-w-2xl mx-auto">
              {t('onboarding.welcome.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 border border-neutral-200 bg-white">
                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center mb-4 mx-auto">
                  <Store className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-medium text-neutral-900 mb-2">
                  {t('onboarding.welcome.connectStore')}
                </h3>
                <p className="text-sm text-neutral-600 font-light">
                  {t('onboarding.welcome.connectStoreDesc')}
                </p>
              </div>

              <div className="p-6 border border-neutral-200 bg-white">
                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center mb-4 mx-auto">
                  <CreditCard className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-medium text-neutral-900 mb-2">
                  {t('onboarding.welcome.choosePlan')}
                </h3>
                <p className="text-sm text-neutral-600 font-light">
                  {t('onboarding.welcome.choosePlanDesc')}
                </p>
              </div>

              <div className="p-6 border border-neutral-200 bg-white">
                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center mb-4 mx-auto">
                  <ShoppingBag className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-medium text-neutral-900 mb-2">
                  {t('onboarding.welcome.goLive')}
                </h3>
                <p className="text-sm text-neutral-600 font-light">
                  {t('onboarding.welcome.goLiveDesc')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-all inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium"
            >
              {t('onboarding.welcome.getStarted')}
              <ArrowRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Step 2: Connect Store */}
        {currentStep === 2 && (
          <div>
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-serif font-medium text-neutral-900 mb-4 tracking-tight">
                {t('onboarding.connectStore.title')}
              </h1>
              <p className="text-lg text-neutral-600 font-light">
                {t('onboarding.connectStore.subtitle')}
              </p>
            </div>

            <form onSubmit={handleConnectStore} className="space-y-8">
              {/* Platform Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-4">
                  E-Commerce Platform
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setStoreFormData({ ...storeFormData, platform: 'SHOPIFY' })
                    }
                    className={`p-6 border-2 transition-all ${
                      storeFormData.platform === 'SHOPIFY'
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">Shopify</h3>
                    <p className="text-sm text-neutral-600 font-light">
                      Connect your Shopify store
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStoreFormData({ ...storeFormData, platform: 'WOOCOMMERCE' })
                    }
                    className={`p-6 border-2 transition-all ${
                      storeFormData.platform === 'WOOCOMMERCE'
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">WooCommerce</h3>
                    <p className="text-sm text-neutral-600 font-light">
                      Connect your WooCommerce store
                    </p>
                  </button>
                </div>
              </div>

              {/* Store Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={storeFormData.name}
                    onChange={(e) =>
                      setStoreFormData({ ...storeFormData, name: e.target.value })
                    }
                    className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                    placeholder="Your Store Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    City *
                  </label>
                  <select
                    value={storeFormData.cityId}
                    onChange={(e) =>
                      setStoreFormData({ ...storeFormData, cityId: e.target.value })
                    }
                    className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                    required
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                  Store URL *
                </label>
                <input
                  type="url"
                  value={storeFormData.websiteUrl}
                  onChange={(e) =>
                    setStoreFormData({ ...storeFormData, websiteUrl: e.target.value })
                  }
                  className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="https://yourstore.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                  Description
                </label>
                <textarea
                  value={storeFormData.description}
                  onChange={(e) =>
                    setStoreFormData({ ...storeFormData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors resize-none font-light"
                  placeholder="Tell customers about your store..."
                />
              </div>

              {/* Platform Credentials */}
              <div className="border-t border-neutral-200 pt-8">
                <h3 className="text-lg font-serif font-medium text-neutral-900 mb-6">
                  {storeFormData.platform === 'SHOPIFY' ? 'Shopify' : 'WooCommerce'} Credentials
                </h3>

                {storeFormData.platform === 'SHOPIFY' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                        Store Domain *
                      </label>
                      <input
                        type="text"
                        value={storeFormData.credentials.storeDomain}
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            credentials: {
                              ...storeFormData.credentials,
                              storeDomain: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                        placeholder="yourstore.myshopify.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                        API Key *
                      </label>
                      <input
                        type="text"
                        value={storeFormData.credentials.apiKey}
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            credentials: {
                              ...storeFormData.credentials,
                              apiKey: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light font-mono text-sm"
                        placeholder="Enter your Shopify API key"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                        API Password *
                      </label>
                      <input
                        type="password"
                        value={storeFormData.credentials.password}
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            credentials: {
                              ...storeFormData.credentials,
                              password: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light font-mono text-sm"
                        placeholder="Enter your Shopify API password"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                        Consumer Key *
                      </label>
                      <input
                        type="text"
                        value={storeFormData.credentials.apiKey}
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            credentials: {
                              ...storeFormData.credentials,
                              apiKey: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light font-mono text-sm"
                        placeholder="Enter your WooCommerce consumer key"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                        Consumer Secret *
                      </label>
                      <input
                        type="password"
                        value={storeFormData.credentials.password}
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            credentials: {
                              ...storeFormData.credentials,
                              password: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light font-mono text-sm"
                        placeholder="Enter your WooCommerce consumer secret"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200">
                  <p className="text-sm text-neutral-600 font-light">
                    <strong className="font-medium">Need help?</strong> Check out our{' '}
                    <a href="/docs" className="underline hover:text-neutral-900">
                      integration guide
                    </a>{' '}
                    to learn how to get your API credentials.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect Store
                      <ArrowRight className="w-5 h-5 stroke-[2]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Choose Plan */}
        {currentStep === 3 && (
          <div>
            <div className="mb-12 text-center">
              <h1 className="text-4xl lg:text-5xl font-serif font-medium text-neutral-900 mb-4 tracking-tight">
                {t('onboarding.choosePlan.title')}
              </h1>
              <p className="text-lg text-neutral-600 font-light max-w-2xl mx-auto">
                {t('onboarding.choosePlan.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 p-8 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  } ${plan.recommended ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-1 text-xs uppercase tracking-wider">
                      Recommended
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xs uppercase tracking-widest font-medium text-neutral-600 mb-3">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-4xl font-serif font-medium text-neutral-900">
                        {plan.price}
                      </span>
                      <span className="text-neutral-600 font-light">{plan.period}</span>
                    </div>
                    <p className="text-sm text-neutral-600 font-light">{plan.description}</p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5 stroke-[2]" />
                        <span className="text-sm text-neutral-700 font-light">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <div
                      className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mx-auto ${
                        selectedPlan === plan.id
                          ? 'border-neutral-900 bg-neutral-900'
                          : 'border-neutral-300'
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-all text-sm uppercase tracking-widest font-medium"
              >
                Back
              </button>
              <button
                onClick={handleCompletOnboarding}
                disabled={loading}
                className="flex-1 bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Onboarding
                    <CheckCircle className="w-5 h-5 stroke-[2]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
