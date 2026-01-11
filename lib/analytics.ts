// Google Analytics helper functions

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// E-commerce events
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
      },
    ],
  });
};

export const trackProductClick = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  position?: number;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'select_item', {
    currency: 'EUR',
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
        index: product.position,
      },
    ],
  });
};

export const trackAddToFavorites = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'add_to_wishlist', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      },
    ],
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackNewsletterSignup = (email: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: 'newsletter',
  });
};

export const trackStoreView = (store: {
  id: string;
  name: string;
  city: string;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_store', {
    store_id: store.id,
    store_name: store.name,
    city: store.city,
  });
};

export const trackCategoryView = (category: string, productCount: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_category', {
    category: category,
    product_count: productCount,
  });
};

// User events
export const trackUserRegistration = (role: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: 'email',
    user_role: role,
  });
};

export const trackUserLogin = (role: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'login', {
    method: 'email',
    user_role: role,
  });
};

// Store owner events
export const trackStoreSync = (itemsCount: number, duration: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'store_sync', {
    items_synced: itemsCount,
    sync_duration: duration,
  });
};

export const trackPriceUpdate = (productId: string, oldPrice: number, newPrice: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'price_update', {
    product_id: productId,
    old_price: oldPrice,
    new_price: newPrice,
    price_change: newPrice - oldPrice,
  });
};

export const trackTeamInvite = (role: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'team_invite', {
    invited_role: role,
  });
};

// Language change tracking
export const trackLanguageChange = (fromLang: string, toLang: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'language_change', {
    from_language: fromLang,
    to_language: toLang,
  });
};

