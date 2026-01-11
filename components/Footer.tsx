'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

export default function Footer() {
  const { t } = useI18n()
  
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-2xl font-serif font-bold text-white tracking-tight">{t('nav.brand')}</span>
              <p className="text-xs text-neutral-500 mt-1 tracking-widest uppercase">{t('footer.tagline')}</p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-500" />
                <a href="mailto:support@livaro.com" className="hover:text-white transition-colors">
                  support@livaro.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-500" />
                <a href="tel:+43123456789" className="hover:text-white transition-colors">
                  +43 1 234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>{t('footer.location')}</span>
              </div>
            </div>
          </div>
          
          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">{t('footer.shop')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/categories" className="hover:text-white transition-colors">{t('footer.allCategories')}</Link></li>
              <li><Link href="/city/vienna" className="hover:text-white transition-colors">{t('footer.vienna')}</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">{t('footer.brands')}</Link></li>
              <li><Link href="/request-city" className="hover:text-white transition-colors">{t('footer.requestCity')}</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">{t('footer.support')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contactSupport')}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t('footer.faq')}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">{t('footer.becomePartner')}</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">{t('footer.legal')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="/imprint" className="hover:text-white transition-colors">{t('footer.imprint')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <span>{t('footer.madeIn')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

