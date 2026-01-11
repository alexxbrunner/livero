'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.token)
      
      toast.success('Welcome back!')
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (data.user.role === 'STORE') {
        router.push('/store-dashboard')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
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
              Welcome Back to<br />Your Store
            </h2>
            <p className="text-xl text-neutral-300 font-light max-w-md">
              Access your dashboard, manage products, and connect with customers in your city.
            </p>
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
              Sign In
            </h1>
            <p className="text-neutral-600 font-light">
              Enter your credentials to access your account
            </p>
        </div>

        {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900">
                Password
              </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 font-light">
              Don't have an account?{' '}
              <Link href="/register" className="text-neutral-900 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200">
            <p className="text-xs uppercase tracking-wider font-medium text-neutral-700 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-neutral-600 font-light">
              <p>Admin: admin@livero.com / admin123</p>
              <p>Store: store1@example.com / store123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

