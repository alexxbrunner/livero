import en from '../locales/en.json';
import de from '../locales/de.json';
import sk from '../locales/sk.json';

export type Locale = 'en' | 'de' | 'sk';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const locales: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
];

export const defaultLocale: Locale = 'en';

const translations = {
  en,
  de,
  sk,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

// Helper function to get nested translation
export function getNestedTranslation(obj: any, path: string, params?: Record<string, string>): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  if (typeof result === 'string') {
    // Replace parameters like {email}, {count}, etc.
    if (params) {
      Object.keys(params).forEach((key) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
      });
    }
    return result;
  }
  
  return path;
}

export default translations;

