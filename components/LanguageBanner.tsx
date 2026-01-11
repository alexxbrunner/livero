'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { locales, Locale } from '@/lib/i18n';
import { X, Globe } from 'lucide-react';

export default function LanguageBanner() {
  const { locale, setLocale } = useI18n();
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('languageBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Detect user's preferred language
    detectLanguage();
  }, []);

  const detectLanguage = async () => {
    // First try browser language
    const browserLang = navigator.language.toLowerCase();
    let detectedLocale: Locale | null = null;

    // Map browser language codes to our supported locales
    if (browserLang.startsWith('de')) {
      detectedLocale = 'de';
    } else if (browserLang.startsWith('sk')) {
      detectedLocale = 'sk';
    } else if (browserLang.startsWith('en')) {
      detectedLocale = 'en';
    }

    // Try geolocation if available
    if (!detectedLocale && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });

        // Use a geolocation API to get country
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        const countryCode = data.address?.country_code?.toUpperCase();

        // Map country codes to languages
        if (countryCode === 'DE' || countryCode === 'AT' || countryCode === 'CH') {
          detectedLocale = 'de';
        } else if (countryCode === 'SK') {
          detectedLocale = 'sk';
        }
      } catch (error) {
        console.log('Geolocation detection failed:', error);
      }
    }

    // Show banner if detected language differs from current
    if (detectedLocale && detectedLocale !== locale) {
      setSuggestedLocale(detectedLocale);
      setIsVisible(true);
    }
  };

  const handleAccept = () => {
    if (suggestedLocale) {
      setLocale(suggestedLocale);
      setIsVisible(false);
      localStorage.setItem('languageBannerDismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('languageBannerDismissed', 'true');
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed || !suggestedLocale) {
    return null;
  }

  const suggested = locales.find((l) => l.code === suggestedLocale);
  const current = locales.find((l) => l.code === locale);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Globe className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-light">
            <span className="text-lg mr-2">{suggested?.flag}</span>
            We detected you might prefer{' '}
            <span className="font-medium">{suggested?.nativeName}</span>.
            {' '}Currently viewing in{' '}
            <span className="font-medium">{current?.nativeName}</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium rounded flex items-center gap-2"
          >
            <span>{suggested?.flag}</span>
            Switch to {suggested?.nativeName}
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-blue-800 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

