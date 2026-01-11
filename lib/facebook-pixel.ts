// Facebook Pixel helper functions

declare global {
  interface Window {
    fbq?: (
      command: 'track' | 'trackCustom' | 'init',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Standard Facebook Events

export const fbPageView = () => {
  if (!window.fbq) return;
  window.fbq('track', 'PageView');
};

export const fbViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) => {
  if (!window.fbq) return;

  window.fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'EUR',
  });
};

export const fbAddToWishlist = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (!window.fbq) return;

  window.fbq('track', 'AddToWishlist', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'EUR',
  });
};

export const fbSearch = (searchQuery: string, resultsCount?: number) => {
  if (!window.fbq) return;

  window.fbq('track', 'Search', {
    search_string: searchQuery,
    content_category: 'products',
    ...(resultsCount !== undefined && { num_items: resultsCount }),
  });
};

export const fbCompleteRegistration = (registrationMethod: string = 'email', userRole?: string) => {
  if (!window.fbq) return;

  window.fbq('track', 'CompleteRegistration', {
    status: 'completed',
    registration_method: registrationMethod,
    ...(userRole && { user_role: userRole }),
  });
};

export const fbLead = (leadType: 'newsletter' | 'contact' | 'request_city') => {
  if (!window.fbq) return;

  window.fbq('track', 'Lead', {
    content_category: leadType,
  });
};

export const fbContact = () => {
  if (!window.fbq) return;

  window.fbq('track', 'Contact', {});
};

// Custom Events for Store Features

export const fbViewStore = (store: {
  id: string;
  name: string;
  city: string;
  productsCount?: number;
}) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'ViewStore', {
    store_id: store.id,
    store_name: store.name,
    city: store.city,
    ...(store.productsCount && { products_count: store.productsCount }),
  });
};

export const fbViewCategory = (category: string, productsCount: number) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'ViewCategory', {
    content_category: category,
    num_items: productsCount,
  });
};

export const fbClickProduct = (product: {
  id: string;
  name: string;
  price: number;
  position?: number;
  listName?: string;
}) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'ClickProduct', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'EUR',
    ...(product.position !== undefined && { position: product.position }),
    ...(product.listName && { list_name: product.listName }),
  });
};

export const fbViewCity = (city: string, storesCount: number) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'ViewCity', {
    city_name: city,
    stores_count: storesCount,
  });
};

// Store Owner Custom Events

export const fbStoreOnboardingStart = () => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'StoreOnboardingStart', {
    step: 'registration',
  });
};

export const fbStoreOnboardingComplete = (planType: string) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'StoreOnboardingComplete', {
    plan_type: planType,
    value: 0, // You can add actual plan value if needed
    currency: 'EUR',
  });
};

export const fbStoreSync = (itemsSynced: number, syncDuration: number) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'StoreSync', {
    items_synced: itemsSynced,
    sync_duration_ms: syncDuration,
  });
};

export const fbProductPriceUpdate = (productId: string, oldPrice: number, newPrice: number) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'ProductPriceUpdate', {
    product_id: productId,
    old_price: oldPrice,
    new_price: newPrice,
    price_change: newPrice - oldPrice,
    currency: 'EUR',
  });
};

export const fbTeamInvite = (role: string) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'TeamInvite', {
    invited_role: role,
  });
};

// Language & Engagement

export const fbLanguageChange = (fromLanguage: string, toLanguage: string) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'LanguageChange', {
    from_language: fromLanguage,
    to_language: toLanguage,
  });
};

export const fbFilterApplied = (filterType: string, filterValue: string) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'FilterApplied', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

export const fbNewsletterSignup = (source: 'footer' | 'popup' | 'page') => {
  if (!window.fbq) return;

  window.fbq('track', 'Lead', {
    content_category: 'newsletter',
    source: source,
  });
};

// Advanced E-commerce Events

export const fbInitiateCheckout = (value: number, numItems: number) => {
  if (!window.fbq) return;

  window.fbq('track', 'InitiateCheckout', {
    value: value,
    currency: 'EUR',
    num_items: numItems,
  });
};

export const fbPurchase = (value: number, transactionId: string, numItems: number) => {
  if (!window.fbq) return;

  window.fbq('track', 'Purchase', {
    value: value,
    currency: 'EUR',
    transaction_id: transactionId,
    num_items: numItems,
  });
};

// User Journey Events

export const fbStartOnboarding = (userType: 'customer' | 'store') => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'StartOnboarding', {
    user_type: userType,
  });
};

export const fbCompleteOnboardingStep = (step: string, stepNumber: number) => {
  if (!window.fbq) return;

  window.fbq('trackCustom', 'CompleteOnboardingStep', {
    step_name: step,
    step_number: stepNumber,
  });
};

