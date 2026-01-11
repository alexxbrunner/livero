'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Store, Mail, Lock, User, Heart } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'STORE' | 'ADMIN' | 'CUSTOMER'>('CUSTOMER')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/register', { 
        email, 
        password, 
        role,
        ...(role === 'CUSTOMER' && name && { name })
      })
      setAuth(data.user, data.token)
      
      toast.success('Account created successfully!')
      
      // Redirect based on role
      if (data.user.role === 'STORE') {
        router.push('/store-onboarding')
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        <div className="relative h-full flex flex-col justify-between p-12">
        {/* Logo */}
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif font-medium text-white tracking-tight">Livero</h1>
          </Link>

          {/* Content */}
          <div className="text-white">
            <h2 className="text-5xl font-serif font-medium mb-6 tracking-tight leading-tight">
              Join the Local<br />Commerce Network
            </h2>
            <p className="text-xl text-neutral-300 font-light max-w-md">
              Connect with customers, grow your business, and become part of a thriving city marketplace.
            </p>
            
            {/* Features */}
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 border border-white flex items-center justify-center flex-shrink-0 mt-1">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-medium mb-1">For Stores</h3>
                  <p className="text-neutral-400 text-sm font-light">Reach local customers and manage your online presence</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 border border-white flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-medium mb-1">For Customers</h3>
                  <p className="text-neutral-400 text-sm font-light">Discover and save your favorite local products</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Image/Pattern */}
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-10">
            <div className="grid grid-cols-3 gap-4 h-full">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1 className="text-3xl font-serif font-medium text-neutral-900 tracking-tight">Livero</h1>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-medium text-neutral-900 mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-neutral-600 font-light">
              Choose your account type and get started
            </p>
        </div>

        {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-4">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-4 border-2 transition-all ${
                    role === 'CUSTOMER'
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-2 stroke-[1.5]" />
                  <span className="block text-xs uppercase tracking-wider font-medium">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('STORE')}
                  className={`p-4 border-2 transition-all ${
                    role === 'STORE'
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <Store className="w-5 h-5 mx-auto mb-2 stroke-[1.5]" />
                  <span className="block text-xs uppercase tracking-wider font-medium">Store</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-4 border-2 transition-all ${
                    role === 'ADMIN'
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-2 stroke-[1.5]" />
                  <span className="block text-xs uppercase tracking-wider font-medium">Admin</span>
                </button>
              </div>
            </div>

            {role === 'CUSTOMER' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                  Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500 font-light">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider font-medium"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 font-light">
              Already have an account?{' '}
              <Link href="/login" className="text-neutral-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

