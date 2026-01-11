'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Store, User, Heart, ShoppingBag, Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { categories } from '@/lib/categories'
import { useAuthStore } from '@/store/authStore'
import SearchBar from './SearchBar'
import LanguageSelector from './LanguageSelector'
import { useI18n } from '@/contexts/I18nContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showCities, setShowCities] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuthStore()
  const { t } = useI18n()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="bg-neutral-900 text-neutral-100 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>{t('nav.shipping')}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">{t('nav.returns')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
            <Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center group-hover:from-neutral-700 group-hover:to-neutral-500 transition-all">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">{t('nav.brand')}</span>
              <p className="text-[10px] text-neutral-500 -mt-1 tracking-widest uppercase">{t('nav.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center space-x-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors py-2">
                <span>{t('nav.categories')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCategories && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-[600px] bg-white border border-neutral-200 rounded-lg shadow-2xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 text-sm">{category.name}</p>
                            <p className="text-xs text-neutral-500">{category.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cities Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCities(true)}
              onMouseLeave={() => setShowCities(false)}
            >
              <button className="flex items-center space-x-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors py-2">
                <span>Cities</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCities && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-80 bg-white border border-neutral-200 rounded-lg shadow-2xl p-6">
                    <Link
                      href="/city/vienna"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=400" 
                          alt="Vienna"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Vienna</p>
                        <p className="text-sm text-neutral-500">Austria</p>
                        <p className="text-xs text-neutral-400 mt-1">3 stores · 27 products</p>
                      </div>
                    </Link>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <Link href="/request-city" className="text-sm text-neutral-600 hover:text-neutral-900">
                        Don't see your city? <span className="underline">Request here</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/brands" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
              Brands
            </Link>

            <Link href="/about" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
              About
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            {user ? (
              <div 
                className="relative hidden md:block"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                  <User className="w-5 h-5" />
            </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2">
                    <div className="w-64 bg-white border border-neutral-200 rounded-lg shadow-2xl p-4">
                      <div className="pb-3 mb-3 border-b border-neutral-200">
                        <p className="font-medium text-neutral-900">{user.name || user.email}</p>
                        <p className="text-xs text-neutral-500 capitalize">{user.role.toLowerCase()} Account</p>
                      </div>
                      {user.role === 'CUSTOMER' && (
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors mb-2"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">My Favorites</span>
                        </Link>
                      )}
                      {user.role === 'STORE' && (
                        <Link
                          href="/store-dashboard"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors mb-2"
                        >
                          <Store className="w-4 h-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      )}
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors mb-2"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors w-full text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            )}

            {/* Favorites */}
            {user?.role === 'CUSTOMER' && (
              <Link href="/favorites" className="hidden md:flex items-center gap-2 text-neutral-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-neutral-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            
            {/* Mobile Search */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Featured Categories Section */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3 px-2">
                Featured Categories
              </h3>
              <div className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 text-sm">{category.name}</p>
                      <p className="text-xs text-neutral-500">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/categories" 
                className="block mt-3 text-sm text-neutral-600 hover:text-neutral-900 font-medium px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                View All Categories →
            </Link>
            </div>

            {/* Cities Section */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3 px-2">
                Our Cities
              </h3>
              <Link
                href="/city/vienna"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=400" 
                    alt="Vienna"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Vienna</p>
                  <p className="text-sm text-neutral-500">Austria</p>
                  <p className="text-xs text-neutral-400 mt-1">3 stores · 27 products</p>
                </div>
            </Link>
            </div>

            {/* Navigation Links */}
            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <Link 
                href="/brands" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Store className="w-5 h-5" />
              Brands
            </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
              About
            </Link>
            </div>

            {/* User Section */}
            <div className="pt-4 border-t border-neutral-100">
              {user ? (
                <>
                  <div className="px-2 mb-3">
                    <p className="font-medium text-neutral-900 text-sm">{user.name || user.email}</p>
                    <p className="text-xs text-neutral-500 capitalize">{user.role.toLowerCase()} Account</p>
                  </div>
                  {user.role === 'CUSTOMER' && (
                    <Link 
                      href="/favorites" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      My Favorites
                    </Link>
                  )}
                  {user.role === 'STORE' && (
                    <Link 
                      href="/store-dashboard" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Store className="w-5 h-5" />
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium w-full text-left mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
              Login
            </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors text-white font-medium mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

