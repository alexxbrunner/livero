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
    <div className="min-h-screen bg-[#faf9f8] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-neutral-200">
        {/* Logo */}
        <div className="flex items-center h-20 px-8 border-b border-neutral-100">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-neutral-900 tracking-tight">LIVERO</span>
              <p className="text-[9px] text-neutral-500 -mt-0.5 tracking-widest uppercase">Store Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Store Info */}
        {storeName && (
          <div className="px-8 py-6 border-b border-neutral-100">
            <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-2">Your Store</p>
            <p className="font-serif font-medium text-neutral-900 text-lg truncate">{storeName}</p>
            {storeSlug && (
              <Link 
                href={`/store/${storeSlug}`}
                target="_blank"
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 mt-2 uppercase tracking-wider transition-colors"
              >
                View Storefront
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all uppercase tracking-wider ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="px-6 py-6 border-t border-neutral-100">
          <div className="px-4 py-3 mb-3 bg-neutral-50 rounded-lg">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium mb-1">Signed in as</p>
            <p className="text-sm font-medium text-neutral-900 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all w-full uppercase tracking-wider"
          >
            <LogOut className="w-5 h-5 stroke-[1.5]" />
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
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="flex flex-col h-full">
            {storeName && (
              <div className="px-6 py-4 border-b border-neutral-100">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1">Your Store</p>
                <p className="font-serif font-medium text-neutral-900">{storeName}</p>
              </div>
            )}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all uppercase tracking-wider ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="px-4 py-4 border-t border-neutral-100">
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all w-full uppercase tracking-wider"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-72">
        <div className="lg:pt-0 pt-16">
          {children}
        </div>
      </main>
    </div>
  )
}

