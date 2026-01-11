'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { 
  Store, Home, BarChart3, Package, Settings, LogOut, Menu, X, ExternalLink 
} from 'lucide-react'
import { useState } from 'react'

interface StoreLayoutProps {
  children: ReactNode
  storeName?: string
  storeSlug?: string
}

export default function StoreLayout({ children, storeName, storeSlug }: StoreLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/store-dashboard', icon: Home },
    { name: 'Analytics', href: '/store-dashboard/analytics', icon: BarChart3 },
    { name: 'Products', href: '/store-dashboard/products', icon: Package },
    { name: 'Settings', href: '/store-dashboard/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-neutral-900 text-white">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-neutral-800">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-neutral-900" />
            </div>
            <span className="text-xl font-serif font-bold">LIVERO</span>
          </Link>
        </div>

        {/* Store Info */}
        {storeName && (
          <div className="px-6 py-4 border-b border-neutral-800">
            <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Store</p>
            <p className="font-medium text-white truncate">{storeName}</p>
            {storeSlug && (
              <Link 
                href={`/store/${storeSlug}`}
                target="_blank"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 mt-2"
              >
                View storefront
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-neutral-900'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-neutral-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-neutral-400">Signed in as</p>
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-neutral-900" />
            <span className="text-lg font-serif font-bold">LIVERO</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-neutral-900 text-white pt-16">
          <div className="flex flex-col h-full">
            {storeName && (
              <div className="px-6 py-4 border-b border-neutral-800">
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Store</p>
                <p className="font-medium text-white">{storeName}</p>
              </div>
            )}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-neutral-900'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="px-4 py-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="lg:pt-0 pt-16">
          {children}
        </div>
      </main>
    </div>
  )
}

