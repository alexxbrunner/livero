'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { locales } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1 rounded hover:bg-neutral-50"
        title="Change language"
      >
        <span className="text-xl">{currentLocale?.flag}</span>
        <span className="hidden lg:inline text-sm font-medium">{currentLocale?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-200 shadow-lg z-50 rounded-lg overflow-hidden">
          <div className="py-2">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors ${
                  locale === loc.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{loc.flag}</span>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      locale === loc.code ? 'text-blue-600' : 'text-neutral-900'
                    }`}>
                      {loc.nativeName}
                    </p>
                    <p className="text-xs text-neutral-500">{loc.name}</p>
                  </div>
                </div>
                {locale === loc.code && (
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Footer hint */}
          <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50">
            <p className="text-xs text-neutral-600 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Language saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

