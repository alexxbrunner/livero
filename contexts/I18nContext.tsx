'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale, getTranslations, getNestedTranslation } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: any;
  autoDetected: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState(getTranslations(defaultLocale));
  const [autoDetected, setAutoDetected] = useState(false);

  // Load locale from localStorage or auto-detect on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      
      if (savedLocale && ['en', 'de', 'sk'].includes(savedLocale)) {
        // Use saved locale
        setLocaleState(savedLocale);
        setTranslations(getTranslations(savedLocale));
      } else {
        // Auto-detect from browser language
        const browserLang = navigator.language.toLowerCase();
        let detectedLocale: Locale = defaultLocale;
        
        if (browserLang.startsWith('de')) {
          detectedLocale = 'de';
          setAutoDetected(true);
        } else if (browserLang.startsWith('sk')) {
          detectedLocale = 'sk';
          setAutoDetected(true);
        } else if (browserLang.startsWith('en')) {
          detectedLocale = 'en';
        }
        
        setLocaleState(detectedLocale);
        setTranslations(getTranslations(detectedLocale));
        localStorage.setItem('locale', detectedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setTranslations(getTranslations(newLocale));
    setAutoDetected(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    return getNestedTranslation(translations, key, params);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, translations, autoDetected }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

