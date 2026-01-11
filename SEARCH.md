# Search Functionality

## Overview
Comprehensive search system for products, brands, and stores with real-time suggestions, autocomplete, and dedicated results page.

## Features Implemented

### Backend API

#### Search Endpoint
**`GET /api/search`**

**Query Parameters:**
- `q` (required): Search query string
- `cityId` (optional): Filter by city
- `limit` (optional): Number of results (default: 10)

**Search Scope:**
- **Products**: Name, description, brand, store name
- **Brands**: Unique brand names from products
- **Stores**: Store names

**Response:**
```json
{
  "query": "chair",
  "results": {
    "products": [...],
    "brands": [...],
    "stores": [...]
  },
  "total": 15
}
```

#### Suggestions Endpoint
**`GET /api/search/suggestions`**

**Query Parameters:**
- `q` (required): Search query string (minimum 2 characters)
- `cityId` (optional): Filter by city

**Features:**
- Fast autocomplete suggestions
- Returns top 8 suggestions
- Categorized by type (product, brand)
- Deduplicated results

**Response:**
```json
{
  "suggestions": [
    { "text": "Modern Chair", "type": "product" },
    { "text": "Herman Miller", "type": "brand" }
  ]
}
```

### Frontend Components

#### SearchBar Component
**Location**: `/components/SearchBar.tsx`

**Features:**
- **Real-time suggestions** as user types (debounced 300ms)
- **Dropdown results** with categorized sections
- **Click-outside** to close
- **Keyboard navigation** support
- **Loading states**
- **Clear button** to reset search
- **Product previews** with images and prices
- **Brand listings**
- **Store listings** with logos

**UI Elements:**
- Search icon on the left
- Clear (X) button on the right
- Dropdown with max height 600px
- Scrollable results
- Responsive design

**Interactions:**
- Type to see suggestions
- Press Enter to search
- Click suggestion to search
- Click product/store to navigate
- Click outside to close

#### Search Results Page
**Location**: `/app/search/page.tsx`

**Features:**
- **Query display** showing search term
- **Result count** display
- **Categorized sections**:
  - Products (grid layout)
  - Brands (list with descriptions)
  - Stores (cards with logos)
- **Empty state** with helpful tips
- **Loading state** with spinner

**Layout:**
- Products: 1-4 column grid (responsive)
- Brands: 1-3 column grid
- Stores: 1-3 column grid
- Each section has icon and count

### Integration Points

#### Navbar Integration
**Location**: `/components/Navbar.tsx`

**Desktop:**
- Search bar displayed in navbar
- Positioned between navigation and user menu
- Max width 2xl (672px)

**Mobile:**
- Search bar at top of mobile menu
- Full width
- Appears when menu is opened

**Behavior:**
- Closes mobile menu when product/store is clicked
- Maintains state across navigation
- Focus returns to input after clear

## Search Algorithm

### Text Matching
- **Case-insensitive** matching
- **Contains** matching (not exact match)
- Uses Prisma's `contains` and `mode: 'insensitive'`

### Search Targets

**Products:**
1. Product name
2. Product description
3. Brand name
4. Store name

**Brands:**
- Extracted from products with non-null brands
- Deduplicated
- Limited to 5 results

**Stores:**
- Store name
- Only ACTIVE stores
- Limited to 5 results

### Result Ordering
- Products: Most recent first (`createdAt desc`)
- Brands: Order by first appearance
- Stores: Order by name

### Performance
- **Indexed fields**: All search fields should be indexed
- **Debouncing**: 300ms delay for suggestions
- **Limits**: Configurable result limits
- **Pagination**: Not implemented (can add later)

## Usage Examples

### Basic Search
```typescript
// User types "chair"
GET /api/search?q=chair&limit=20

// Returns products, brands, stores matching "chair"
```

### City-Filtered Search
```typescript
// Search within specific city
GET /api/search?q=sofa&cityId=city123&limit=10
```

### Autocomplete
```typescript
// User types "ta"
GET /api/search/suggestions?q=ta

// Returns: ["Table", "Tablo Design", "Tabletop Decor"]
```

## Frontend Usage

### Using SearchBar Component
```tsx
import SearchBar from '@/components/SearchBar';

export default function MyPage() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}
```

### Programmatic Search
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/search?q=${encodeURIComponent(query)}`);
```

## Styling

### Design System
- **Input**: Border-based, no shadows
- **Dropdown**: White background, border, shadow-lg
- **Icons**: Lucide icons, 5x5 size
- **Typography**: Light font for body, medium for headings
- **Colors**: Neutral palette (900, 600, 400, 200)

### Responsive Breakpoints
- **Mobile**: Full width, simple layout
- **Tablet (md)**: Show in navbar
- **Desktop (lg+)**: Max width with proper spacing

### States
1. **Default**: Empty input, no dropdown
2. **Typing**: Showing suggestions
3. **Loading**: Spinner in dropdown
4. **Results**: Full search results
5. **No Results**: Empty state message

## Database Optimization

### Recommended Indexes
```sql
-- Products table
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Stores table
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_status ON stores(status);
```

### Query Performance
- Use `EXPLAIN ANALYZE` to check query performance
- Consider full-text search for large datasets
- Implement pagination for more than 50 results
- Cache popular searches

## Future Enhancements

### Phase 2
1. **Advanced Filters**:
   - Price range
   - Category filter
   - Store filter
   - Sort options (price, relevance, newest)

2. **Search History**:
   - Save recent searches
   - Quick access to history
   - Clear history option

3. **Popular Searches**:
   - Track search frequency
   - Show trending searches
   - Regional trending

### Phase 3
1. **Full-Text Search**:
   - PostgreSQL full-text search
   - Relevance ranking
   - Weighted fields

2. **Typo Tolerance**:
   - Fuzzy matching
   - Did you mean...?
   - Autocorrection

3. **Search Analytics**:
   - Track search terms
   - No-results tracking
   - Popular products from search
   - Conversion tracking

### Phase 4
1. **Elasticsearch Integration**:
   - Better relevance
   - Faceted search
   - Multi-language support
   - Synonyms

2. **Image Search**:
   - Visual similarity
   - Upload image to search
   - AI-powered suggestions

3. **Voice Search**:
   - Speech-to-text
   - Mobile-first
   - Hands-free shopping

## Testing

### Manual Testing

1. **Basic Search**:
   - Enter "chair" in search
   - Verify products appear
   - Check images load
   - Verify prices display

2. **Suggestions**:
   - Type "ta"
   - Wait 300ms
   - Verify suggestions appear
   - Click suggestion
   - Verify search executes

3. **Empty Results**:
   - Search for "xyzabc123"
   - Verify empty state shows
   - Verify helpful message displays

4. **Responsive**:
   - Test on mobile (320px width)
   - Test on tablet (768px)
   - Test on desktop (1920px)
   - Verify dropdown fits screen

5. **Navigation**:
   - Click product from results
   - Verify navigates to product page
   - Go back, search should persist
   - Close dropdown, input should remain

### API Testing

```bash
# Test search endpoint
curl "http://localhost:4000/api/search?q=chair&limit=5"

# Test suggestions
curl "http://localhost:4000/api/search/suggestions?q=ta"

# Test with city filter
curl "http://localhost:4000/api/search?q=sofa&cityId=city123"
```

## Security

### Input Validation
- Trim whitespace
- Minimum length: 1 character
- Maximum length: 100 characters (implicit)
- Sanitize special characters (handled by Prisma)

### SQL Injection
- Protected by Prisma parameterized queries
- No raw SQL used
- All inputs escaped

### Rate Limiting
- Consider implementing rate limiting
- Prevent search abuse
- Protect against DoS

## Performance Metrics

### Target Benchmarks
- **Suggestions**: < 100ms response time
- **Full Search**: < 300ms response time
- **Dropdown Open**: < 50ms
- **Type-to-Suggestion**: 300ms debounce

### Monitoring
- Track average search time
- Monitor slow queries
- Alert on errors
- Track no-result searches

## Accessibility

### Keyboard Navigation
- Tab to focus input
- Enter to search
- Arrow keys for suggestions (to implement)
- Escape to close dropdown

### Screen Readers
- ARIA labels on search input
- Announce results count
- Describe search state
- Label buttons properly

### Focus Management
- Focus indicator visible
- Focus trap in dropdown
- Return focus on close
- Skip to results link

## API Documentation

### Search API

**Endpoint**: `GET /api/search`

**Authentication**: None required

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Search query |
| cityId | string | No | - | Filter by city |
| limit | number | No | 10 | Results per category |

**Response**: 200 OK
```json
{
  "query": "search term",
  "results": {
    "products": [...],
    "brands": [...],
    "stores": [...]
  },
  "total": 15
}
```

**Errors**:
- 400: Missing query parameter
- 500: Server error

### Suggestions API

**Endpoint**: `GET /api/search/suggestions`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Search query (min 2 chars) |
| cityId | string | No | - | Filter by city |

**Response**: 200 OK
```json
{
  "suggestions": [
    { "text": "Chair", "type": "product" },
    { "text": "Herman Miller", "type": "brand" }
  ]
}
```

## Files Created/Modified

### Backend
- ✅ `/backend/src/routes/search.routes.ts` - Search API routes
- ✅ `/backend/src/index.ts` - Registered search routes

### Frontend
- ✅ `/components/SearchBar.tsx` - Search bar component
- ✅ `/components/Navbar.tsx` - Integrated SearchBar
- ✅ `/app/search/page.tsx` - Search results page

### Documentation
- ✅ `SEARCH.md` - This file

## Next Steps

1. **Test the search**:
   - Try various search terms
   - Test suggestions
   - Verify navigation works

2. **Add analytics**:
   - Track search terms
   - Monitor performance
   - Identify improvements

3. **Gather feedback**:
   - User testing
   - A/B testing
   - Iterate on UX

4. **Optimize**:
   - Add database indexes
   - Implement caching
   - Consider Elasticsearch

