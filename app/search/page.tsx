'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DefaultLayout from '@/components/DefaultLayout';
import api from '@/lib/api';
import { Search, Package, Store as StoreIcon, TrendingUp } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function SearchResultsPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/search', {
        params: { q: query, limit: 50 },
      });
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-light">{t('search.searching')}</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-medium text-neutral-900 mb-2 tracking-tight">
            {t('search.results', { count: (results?.total || 0).toString(), query: query || '' })}
          </h1>
        </div>

        {/* Results */}
        {results && results.total > 0 ? (
          <div className="space-y-12">
            {/* Products */}
            {results.results.products.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
                  <Package className="w-6 h-6 text-neutral-900" />
                  <h2 className="text-2xl font-serif font-medium text-neutral-900 tracking-tight">
                    {t('search.products')}
                  </h2>
                  <span className="text-sm text-neutral-500 font-light">
                    ({results.results.products.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.results.products.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="border border-neutral-200 hover:border-neutral-900 transition-all group bg-white"
                    >
                      <div className="aspect-square bg-neutral-100 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-xs text-neutral-600 font-light mb-2">
                          {product.store.name}
                        </p>
                        <p className="text-lg font-medium text-neutral-900">
                          {product.city.currency}
                          {product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {results.results.brands.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
                  <TrendingUp className="w-6 h-6 text-neutral-900" />
                  <h2 className="text-2xl font-serif font-medium text-neutral-900 tracking-tight">
                    {t('search.brands')}
                  </h2>
                  <span className="text-sm text-neutral-500 font-light">
                    ({results.results.brands.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.results.brands.map((brand: any, index: number) => (
                    <div
                      key={index}
                      className="border border-neutral-200 p-6 bg-white hover:border-neutral-900 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-sm text-neutral-600 font-light line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stores */}
            {results.results.stores.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
                  <StoreIcon className="w-6 h-6 text-neutral-900" />
                  <h2 className="text-2xl font-serif font-medium text-neutral-900 tracking-tight">
                    {t('search.stores')}
                  </h2>
                  <span className="text-sm text-neutral-500 font-light">
                    ({results.results.stores.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.results.stores.map((store: any) => (
                    <Link
                      key={store.id}
                      href={`/store/${store.slug}`}
                      className="border border-neutral-200 p-6 bg-white hover:border-neutral-900 transition-colors group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-16 h-16 object-cover border border-neutral-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-neutral-200 flex items-center justify-center">
                            <StoreIcon className="w-8 h-8 text-neutral-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-neutral-900 mb-1">
                            {store.name}
                          </h3>
                          <p className="text-xs text-neutral-600 font-light">
                            {store.city.name}
                          </p>
                        </div>
                      </div>
                      {store.description && (
                        <p className="text-sm text-neutral-600 font-light line-clamp-2">
                          {store.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-2 tracking-tight">
              {t('search.noResults')}
            </h2>
            <p className="text-neutral-600 font-light mb-8">
              {t('search.noResultsMessage', { query: query || '' })}
            </p>
            <div className="space-y-2 text-sm text-neutral-600 font-light">
              <p>{t('search.tryDifferent')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('search.suggestion1')}</li>
                <li>{t('search.suggestion2')}</li>
                <li>{t('search.suggestion3')}</li>
                <li>{t('search.suggestion4')}</li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wider font-medium"
              >
                {t('search.backToHome')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

