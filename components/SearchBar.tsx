'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Search, X, TrendingUp, Package, Store as StoreIcon } from 'lucide-react';

interface SearchResult {
  products: any[];
  brands: any[];
  stores: any[];
}

interface Suggestion {
  text: string;
  type: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live results as user types
  useEffect(() => {
    const fetchLiveResults = async () => {
      if (query.length < 2) {
        setResults(null);
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);

      try {
        // Fetch both suggestions and live results in parallel
        const [suggestionsRes, resultsRes] = await Promise.all([
          api.get('/search/suggestions', {
            params: { q: query },
          }),
          api.get('/search', {
            params: { q: query, limit: 6 },
          }),
        ]);

        setSuggestions(suggestionsRes.data.suggestions || []);
        setResults(resultsRes.data.results);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchLiveResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Perform full search (when pressing Enter)
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsOpen(true);
    
    try {
      const { data } = await api.get('/search', {
        params: { q: searchQuery, limit: 20 },
      });
      setResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleStoreClick = (storeSlug: string) => {
    router.push(`/store/${storeSlug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) {
                setResults(null);
                setIsOpen(false);
              }
            }}
            onFocus={() => {
              if (query.length >= 2) {
                setIsOpen(true);
              }
            }}
            placeholder="Search products, brands, stores..."
            className="w-full pl-12 pr-12 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light text-sm bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 shadow-2xl rounded-sm max-h-[600px] overflow-y-auto z-50">
          {loading ? (
            <div className="py-4">
              {/* Products Skeleton */}
              <div className="mb-6">
                <div className="px-4 mb-3">
                  <div className="h-4 w-32 bg-neutral-200 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                      <div className="w-14 h-14 bg-neutral-200 animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 animate-pulse w-3/4"></div>
                        <div className="h-3 bg-neutral-200 animate-pulse w-1/2"></div>
                        <div className="h-4 bg-neutral-200 animate-pulse w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stores Skeleton */}
              <div className="mb-6">
                <div className="px-4 mb-3">
                  <div className="h-4 w-24 bg-neutral-200 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                      <div className="w-12 h-12 bg-neutral-200 animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 animate-pulse w-2/3"></div>
                        <div className="h-3 bg-neutral-200 animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Skeleton */}
              <div>
                <div className="px-4 mb-3">
                  <div className="h-4 w-20 bg-neutral-200 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="px-4 py-2">
                      <div className="h-4 bg-neutral-200 animate-pulse w-1/2 mb-1"></div>
                      <div className="h-3 bg-neutral-200 animate-pulse w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : results ? (
            <div className="py-4">
              {/* Products */}
              {results.products && results.products.length > 0 && (
                <div className="mb-6">
                  <div className="px-4 mb-3">
                    <h3 className="text-xs uppercase tracking-wider font-medium text-neutral-900 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products ({results.products.length})
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {results.products.map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full px-4 py-3 hover:bg-neutral-50 transition-colors text-left flex items-start gap-3"
                      >
                        {product.images?.urls?.[0] ? (
                          <img
                            src={product.images.urls[0]}
                            alt={product.title}
                            className="w-14 h-14 object-cover border border-neutral-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-neutral-100 flex items-center justify-center flex-shrink-0 border border-neutral-200">
                            <Package className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">
                            {product.title}
                          </p>
                          <p className="text-xs text-neutral-500 font-light mt-1">
                            {product.store.name} • {product.city.name}
                          </p>
                          <p className="text-sm font-semibold text-neutral-900 mt-1">
                            {product.city.currency || '€'}{product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {results.products.length >= 6 && (
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 font-medium text-center mt-2"
                    >
                      View all product results →
                    </button>
                  )}
                </div>
              )}

              {/* Stores */}
              {results.stores && results.stores.length > 0 && (
                <div className="mb-6">
                  <div className="px-4 mb-3">
                    <h3 className="text-xs uppercase tracking-wider font-medium text-neutral-900 flex items-center gap-2">
                      <StoreIcon className="w-4 h-4" />
                      Stores ({results.stores.length})
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {results.stores.map((store: any) => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreClick(store.slug)}
                        className="w-full px-4 py-3 hover:bg-neutral-50 transition-colors text-left flex items-start gap-3"
                      >
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-12 h-12 object-contain border border-neutral-200 flex-shrink-0 bg-white p-1"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center flex-shrink-0 border border-neutral-200">
                            <StoreIcon className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">{store.name}</p>
                          <p className="text-xs text-neutral-500 font-light">
                            {store.city.name}
                          </p>
                          {store.description && (
                            <p className="text-xs text-neutral-500 font-light line-clamp-1 mt-1">
                              {store.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {results.brands && results.brands.length > 0 && (
                <div>
                  <div className="px-4 mb-3">
                    <h3 className="text-xs uppercase tracking-wider font-medium text-neutral-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Brands ({results.brands.length})
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {results.brands.map((brand: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(brand.name);
                          handleSearch(brand.name);
                        }}
                        className="w-full px-4 py-2 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <p className="text-sm font-medium text-neutral-900">{brand.name}</p>
                        {brand.description && (
                          <p className="text-xs text-neutral-500 font-light line-clamp-1">
                            {brand.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {(!results.products || results.products.length === 0) &&
                (!results.brands || results.brands.length === 0) &&
                (!results.stores || results.stores.length === 0) && (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 font-light">
                      No results found for "{query}"
                    </p>
                    <p className="text-xs text-neutral-500 font-light mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

