# Client Architecture (React + Vite + TypeScript + MUI)

## SPA (Single Page Application)

This app is a **SPA** - the browser loads a single HTML file once, and from that point all navigation happens in the browser via JavaScript (React Router), without requesting new pages from the server.

**How it works:**
1. User opens `localhost:5173` → server sends one `index.html` + the React JS bundle
2. User clicks "Women" in the navbar → React Router sees the URL changed to `/women`, unmounts the current page component, and mounts `CategoryPage` - all in the browser, no server request
3. User clicks "Men" → same thing, React swaps the component instantly

**Why SPA?**
- **Speed**: No full page reloads, navigation feels instant
- **Smooth UX**: Only the content area changes, Navbar and Footer stay in place
- **State preservation**: React state (like filter selections) survives between navigations within the same session

**The trade-off**: On first load, the browser downloads the entire app (all pages, components). After that, everything is fast because it's already loaded. This is fine for apps like ours where users browse multiple pages per session.

**In our code**: `BrowserRouter` + `Routes` in `App.tsx` handle all routing. The `/:category` route uses `useParams` to read which category from the URL and render the same `CategoryPage` component with different data.

---

## Project Structure

```
client/src/
├── App.tsx                     # Root component (BrowserRouter + Routes)
├── main.tsx                    # Entry point (ThemeProvider + GoogleOAuthProvider)
├── theme.ts                    # MUI theme (Inter font)
├── index.css                   # Global styles + Google Fonts imports
│
├── assets/                     # Static images
│   ├── auth-image.jpg          # Auth page side image
│   ├── hero-image.jpg          # Homepage hero banner
│   ├── category-women.jpg      # Category section images
│   ├── category-men.jpg
│   ├── category-accessories.jpg
│   └── product-1..4.jpg        # Mock product images
│
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx        # Shared form wrapper (submit button, Google login, switch link)
│   │   ├── LoginForm.tsx       # Login fields + validation
│   │   └── RegisterForm.tsx    # Register fields + validation
│   │
│   ├── home/
│   │   ├── HeroSection.tsx     # Full-width hero banner with CTA button
│   │   ├── CategorySection.tsx # 3 category cards (Women, Men, Accessories)
│   │   ├── NewArrivals.tsx     # Product grid using ProductCard component
│   │   ├── Testimonial.tsx     # Customer testimonial section
│   │   ├── AIStyleSection.tsx  # AI search bar, suggestion chips, How It Works
│   │   └── SearchResults.tsx   # AI search results grid with ProductCard
│   │
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky top bar (logo, nav links, action icons)
│   │   ├── Footer.tsx          # Site footer
│   │   └── ScrollToTop.tsx     # Scrolls to top on route change
│   │
│   ├── products/
│   │   ├── ProductCard.tsx     # Reusable product card (image, tags, name, price)
│   │   └── FiltersDialog.tsx   # Filters & Sort dialog (sort, type, price, size, color)
│   │
│   ├── product-detail/
│   │   ├── ImageGallery.tsx    # Product images with thumbnail nav + click-to-enlarge
│   │   ├── ProductInfo.tsx     # Product name, price, size/color selectors, add to cart/wishlist
│   │   ├── ProductTabs.tsx     # Description / Reviews tabs
│   │   └── ReviewsTab.tsx      # Reviews summary inside product detail (or "No Reviews Yet")
│   │
│   ├── reviews/
│   │   ├── ReviewCard.tsx      # Review card (rating, title, content, like button, comments)
│   │   ├── CommentsDialog.tsx  # Comments dialog (fetch from API, post new comment)
│   │   └── ProductSidebar.tsx  # Product info sidebar on reviews page (image, rating, breakdown)
│   │
│   ├── account/
│   │   ├── OrdersSection.tsx       # Order history list with product images and totals
│   │   ├── WishlistSection.tsx     # Wishlist grid with remove functionality
│   │   └── AccountSettingsSection.tsx # Profile editing (username, email, phone, address, photo)
│   │
│   └── cart/
│       ├── CartItem.tsx        # Cart item card (image, info, quantity controls, remove)
│       ├── OrderSummary.tsx    # Order summary sidebar (promo code, totals, checkout button)
│       ├── CheckoutDialog.tsx  # Checkout popup (payment, shipping, contact, order summary)
│       ├── OrderSuccessDialog.tsx # Order success popup (order number, view orders / continue shopping)
│       └── FormField.tsx       # Reusable labeled text field with error display
│
├── pages/
│   ├── AuthPage.tsx            # Login/Register page (split-screen layout)
│   ├── HomePage.tsx            # Homepage (Hero + Categories + NewArrivals + Testimonial)
│   ├── CategoryPage.tsx        # Category page (breadcrumb, title, filters, product grid)
│   ├── CartPage.tsx            # Shopping cart page (cart items + order summary + checkout)
│   ├── ProductDetailPage.tsx   # Product detail (images, info, add to cart, real reviews)
│   ├── ReviewsPage.tsx         # Product reviews with comments (connected to DB)
│   ├── MyAccountPage.tsx       # Account page (orders, wishlist, settings — tab navigation)
│   └── AISearchPage.tsx        # AI-powered smart search page
│
├── context/
│   └── CartManager.tsx          # Cart context (guest localStorage + logged-in API, merge on login)
│
├── services/
│   ├── api-client.ts           # Axios instance (base URL: localhost:3000)
│   ├── auth-service.ts         # API calls: loginUser, registerUser, googleSignIn
│   ├── products-api.ts         # Products API (fetchFilteredProducts, getProductTags)
│   ├── reviews-api.ts          # Reviews API (fetchProductReviews, toggleLike, comments)
│   ├── cart-localStorage.ts    # Guest cart CRUD (localStorage)
│   └── cart-apiDB.ts           # Logged-in cart CRUD (server API)
│
└── hooks/
    ├── useCart.ts               # Cart context bridge (useContext wrapper for CartManager)
    ├── useCheckoutForm.ts      # Checkout form state, validation, input formatting, profile pre-fill, order API
    ├── useProductDetail.ts     # Product detail fetching from API
    ├── useProductReviews.ts    # Product reviews from API (rating, breakdown, sorting, likes)
    ├── useAISearch.ts          # AI search state, API call to smart-search endpoint
    ├── useCategoryFilters.ts   # Per-category filter state (sort, price, sizes, colors, types)
    └── useCategoryProducts.ts  # Product loading + IntersectionObserver infinite scroll
```

---

## Routing (React Router v7)

```tsx
// App.tsx
<BrowserRouter>
  <Navbar />
  <ScrollToTop />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/:category/:id/reviews" element={<ReviewsPage />} />
    <Route path="/:category/:id" element={<ProductDetailPage />} />
    <Route path="/search" element={<AISearchPage />} />
    <Route path="/account" element={<MyAccountPage />} />
    <Route path="/:category" element={<CategoryPage />} />
  </Routes>
  <Footer />
</BrowserRouter>
```

- Static routes (`/cart`, `/search`, `/auth`) must be defined BEFORE `/:category` to avoid React Router treating them as category names
- `/:category/:id/reviews` must be before `/:category/:id` (more specific first)
- `/:category` handles `/women`, `/men`, `/accessories` with one component using `useParams`
- `ScrollToTop` ensures page scrolls to top on navigation (uses `useLocation` + `useEffect`)
- Navbar and Footer are always visible (outside Routes)
- Navbar's search icon links to `/search` (AI search page)

---

## Component Hierarchy

```
main.tsx
  └── GoogleOAuthProvider
      └── ThemeProvider (MUI theme with Inter font)
          └── CartProvider (guest/logged-in cart state)
              └── App
              ├── Navbar (sticky, logo + nav links + icons)
              ├── ScrollToTop
              ├── Routes
              │   ├── HomePage
              │   │   ├── HeroSection
              │   │   ├── CategorySection
              │   │   ├── NewArrivals (uses ProductCard)
              │   │   └── Testimonial
              │   │
              │   ├── AuthPage
              │   │   ├── Logo ("O&A Clothes")
              │   │   ├── Tabs (Login / Register)
              │   │   ├── LoginForm → AuthForm wrapper
              │   │   └── RegisterForm → AuthForm wrapper
              │   │
              │   ├── CategoryPage
              │   │   ├── Breadcrumb (Home / Category + "Showing X of Y")
              │   │   ├── Title + Subtitle
              │   │   ├── Filters & Sort button → FiltersDialog
              │   │   ├── Product Grid (uses ProductCard, data from API)
              │   │   ├── No products message (when empty)
              │   │   ├── Sentinel div (IntersectionObserver for infinite scroll)
              │   │   └── Loading spinner (CircularProgress)
              │   │
              │   ├── CartPage (uses useCart hook)
              │   │   ├── Breadcrumb (Home / Shopping Cart)
              │   │   ├── Title
              │   │   ├── CartItem list (quantity controls, remove)
              │   │   ├── Continue Shopping link
              │   │   ├── OrderSummary (promo code, totals, checkout button)
              │   │   └── CheckoutDialog (uses useCheckoutForm hook)
              │   │       ├── Payment Information (FormField components)
              │   │       ├── Shipping Information
              │   │       ├── Contact Information
              │   │       ├── Order Summary (totals)
              │   │       └── Place Order / Cancel buttons
              │   │
              │   ├── ProductDetailPage (uses useProductDetail + useProductReviews)
              │   │   ├── ImageGallery (thumbnails + main image + click-to-enlarge)
              │   │   ├── ProductInfo (name, price, size/color, add to cart/wishlist)
              │   │   └── ProductTabs (Description + ReviewsTab with real ratings)
              │   │
              │   ├── ReviewsPage (uses useProductReviews)
              │   │   ├── ProductSidebar (image, rating, star breakdown)
              │   │   ├── ReviewCard (rating, title, content, like toggle via API)
              │   │   └── CommentsDialog (fetch + post comments via API)
              │   │
              │   ├── MyAccountPage (?section= query param navigation)
              │   │   ├── OrdersSection (order history with product images)
              │   │   ├── WishlistSection (wishlist grid, remove items)
              │   │   └── AccountSettingsSection (profile edit + photo upload)
              │   │
              │   └── AISearchPage (uses useAISearch hook)
              │       ├── AIStyleSection
              │       │   ├── AI badge chip
              │       │   ├── Title + subtitle
              │       │   ├── Search bar (input + Search button)
              │       │   ├── Suggestion chips (hidden after search)
              │       │   └── How It Works section (hidden after search)
              │       └── SearchResults (shown after search)
              │           ├── Results header (icon + "Results for" + count)
              │           ├── Product grid (uses ProductCard)
              │           ├── Load More button
              │           └── No results: "TRY ANOTHER SEARCH" button
              │
              └── Footer
```

---

## Key Components

### Navbar
- Sticky AppBar with white background
- Logo: "O&A" (bold) + "Clothes" (gold #c8a951), Playfair Display font
- Nav links: Women, Men, Accessories (hidden on mobile)
- Action icons: Search, Favorites, Account, Cart (with badge)
- Max width 1280px, centered

### ProductCard (Reusable)
- Used in NewArrivals, CategoryPage, and SearchResults
- Shows: image (400px height, hover zoom), tags (NEW/SALE chips), type, name, price
- Sale price shows old price with strikethrough
- Links to `/{category}/{id}`
- Tag colors: SALE = gold (#c8a951), others = black
- `id` is `string` (MongoDB `_id`), mapped from `ProductFromServer` in parent components

### products-api.ts (Frontend Service)
- `ProductFromServer` interface — matches the MongoDB Product model
- `FilterParams` interface — category, type[], sizes[], colors[], minPrice, maxPrice, sort, page, limit
- `fetchFilteredProducts(params)` — converts FilterParams to URL query string and calls `GET /products/filter`
- Uses `paramRules` array with type-based conversion (string stays, array → `join(",")`, number → `String()`)

### FiltersDialog
- MUI Dialog (750px wide, 645px max height)
- **Left column**: Sort By (dropdown), Type (checkboxes), Price Range (slider $0-$1000)
- **Right column**: Size (clickable boxes 36x36), Color (circles 26x26)
- Generic `toggle` function handles Size, Type, and Color selection
- `clearAll` resets all filters to defaults
- Controlled component: receives `filters` and `onUpdateFilters` from parent

### CategoryPage
- Reads category from URL via `useParams`
- Dynamic title/subtitle per category (categoryConfig object)
- All logic extracted into two custom hooks: `useCategoryFilters` + `useCategoryProducts`
- Page component is pure JSX — only `useState` for `filtersOpen` dialog
- Shows "No products available at the moment" when API returns 0 products
- "Showing X of Y" in breadcrumb shows loaded count vs total
- Sentinel div (`<div ref={sentinelRef}>`) at bottom of grid for IntersectionObserver

### ScrollToTop
- Listens to `useLocation` pathname changes
- Calls `window.scrollTo(0, 0)` on every route change
- Returns null (no visual output)

### CartPage (uses `useCart` hook)
- Two-column layout: cart items (flex: 2) + order summary (flex: 1)
- Mock data with 3 items, managed via `useCart` custom hook
- Computed values: subtotal, shipping (free if >= $150, otherwise $20), tax (8%), total
- Checkout dialog opens from OrderSummary's "PROCEED TO CHECKOUT" button

### CartItem
- Bordered card with product image, type, name, size, color
- Quantity controls (minus/plus IconButtons) with minimum of 1
- Remove button (X icon) in top-right corner
- Price displays `price × quantity`

### OrderSummary
- Promo code input + Apply button
- Price breakdown: subtotal, shipping (green "Free" or price), tax, total
- "PROCEED TO CHECKOUT" button (disabled when cart is empty via `isEmpty` prop)
- Trust badges: free shipping, secure checkout, 30-day return policy

### CheckoutDialog (uses `useCheckoutForm` hook)
- MUI Dialog (500px wide, 90vh max height, 50% backdrop)
- Sections: Payment Information, Shipping Information, Contact Information, Order Summary
- Uses `FormField` reusable component for all text inputs
- Form validation on "Place Order" - shows red error messages per field
- Input formatting: card number (spaces every 4 digits, max 16), expiration date (auto slash, month 01-12), CVV (max 4 digits)
- Form resets on close (Cancel, X, backdrop click)

### FormField (Reusable)
- Combines MUI Typography label + TextField into one component
- Props: label, placeholder, value, error, onChange, mb
- Shows red error text via TextField's `error` + `helperText` props

### AISearchPage (uses `useAISearch` hook)
- Dedicated page at `/search`, accessed via Navbar search icon
- Combines `AIStyleSection` (search UI) + `SearchResults` (results grid)
- `SearchResults` only shown after `hasSearched` becomes true

### AIStyleSection
- Gold "AI-Powered Virtual Stylist" chip badge
- Title: "Your Personal Fashion Assistant" (Playfair Display serif)
- Rounded search bar with search icon + gold "Search" button
- Suggestion chips (e.g., "Summer vacation outfits") — click auto-fills AND triggers search
- "How It Works" section with 3 steps (Describe, AI Curates, Shop)
- Suggestions + How It Works are **hidden after search** (`hasSearched` prop)
- Search triggers: click Search button, press Enter, or click a suggestion chip

### SearchResults
- Header: AutoAwesome icon + "Results for "{query}"" + product count
- Product grid using `ProductCard` component (same as CategoryPage)
- Loading state: gold `CircularProgress`
- No results: "Didn't find what you're looking for?" + "TRY ANOTHER SEARCH" button (calls `clearResults`)
- Error state: red error message text

### Custom Hooks

**`useAISearch`** - AI search state management:
- `query`, `results`, `isLoading`, `hasSearched`, `error` states
- `search(query)` — calls `GET /products/smart-search?q={query}` via apiClient
- `clearResults()` — resets all state to initial (brings back suggestions + How It Works)
- `setQuery` — updates input text

**`useCategoryFilters(category)`** - Per-category filter state:
- Manages `filtersState: Record<string, CategoryFilters>` — each category has its own filters
- `defaultFilters` wrapped in `useMemo` to prevent infinite re-render (see troubleshooting #20)
- Returns `{ currentFilters, updateFilters }`
- Filter state persists when switching between categories (within same session)
- Exports `CategoryFilters` interface used by other hooks

**`useCategoryProducts(category, filters)`** - Product loading + infinite scroll:
- Fetches products from server via `fetchFilteredProducts` from `products-api.ts`
- `buildFilterParams` wrapped in `useCallback` — both useEffects depend on it
- **First useEffect**: Resets and loads page 1 when category/filters change. Uses `isEffectActive` flag for StrictMode protection. 500ms loading delay for smooth UX
- **Second useEffect**: Sets up `IntersectionObserver` on `sentinelRef`. When sentinel enters viewport, loads next page
- `hasMore` ref tracks if more pages exist (`products.length >= PRODUCTS_PER_PAGE`)
- `isLoadingNextPage` ref prevents concurrent loads and blocks observer during initial load delay
- Duplicate protection: `existingIds` Set filters out any products already in state
- 300ms delay before each infinite scroll fetch (so user sees spinner)
- Returns `{ products, totalProducts, loading, sentinelRef }`
- `PRODUCTS_PER_PAGE = 8` constant at top of file

**`useCart`** - Cart context bridge:
- Wraps `useContext(CartContext)` from `CartManager.tsx`
- Exposes: `cartItems`, `addItem`, `updateItemQuantity`, `removeItem`, `clearCart`, `syncAfterLogin`
- Computed values: `itemCount`, `subtotal`, `shipping` (free over $150), `tax` (8%), `total`

### Cart Architecture (Guest + Logged-in)

The cart system splits into 3 layers:

```
CartManager.tsx (Context — decides guest vs logged-in)
    ├── cart-localStorage.ts (guest: saves/loads from localStorage)
    └── cart-apiDB.ts (logged-in: API calls to server)
```

**Guest flow**: User adds items → saved to localStorage → persists across page refreshes
**Logged-in flow**: User adds items → API call to server → saved in MongoDB
**Merge on login**: `syncAfterLogin()` sends guest cart to `POST /cart/merge` → clears localStorage → fetches merged cart from server

Cart items are identified by `productId + size + color` combination (not just productId), so the same product in different sizes/colors is treated as separate items.

**`useProductDetail(productId)`** - Product detail fetching:
- Fetches product from `GET /products/:id` via apiClient
- Maps server fields to UI interface (images with base URL, tags via `getProductTags`)
- Returns `{ product, loading }`

**`useProductReviews(productId)`** - Product reviews from API:
- Fetches from `GET /reviews/product/:productId` with pagination and sorting
- Maps server data to UI shape (`content`→`text`, `likes.length`→`helpfulCount`)
- Helpers: `getAvatarLetters(username)`, `formatDate(isoString)`
- Returns `{ reviews, loading, sortBy, setSortBy, averageRating, total, reviewBreakdown, reloadReviews }`

**`useCheckoutForm(shipping, tax)`** - Checkout form logic:
- `form` state (10 fields) + `errors` state
- Pre-fills shipping/contact fields from user profile on mount (`GET /users/profile`)
- `handleChange(field)` - updates value + clears error + input formatting
- `validate()` - checks all required fields, returns boolean
- `handleSubmit(onClose, onSuccess)` - validates, creates order via `POST /orders` (with shipping, tax, shippingAddress), resets form, closes dialog, calls onSuccess with orderNumber
- `handleClose(onClose)` - resets form + errors, closes dialog

---

## Styling Approach

- **MUI `sx` prop** for all component styling (no separate CSS files for components)
- **ThemeProvider** with Inter font as global default
- **Playfair Display** for logo and decorative titles (inline fontFamily)
- Both fonts imported in `index.css` from Google Fonts
- **Design system colors**: Gold accent (#c8a951), hover gold (#b89841), text gray (#999)
- **Layout**: Max width 1280px with `mx: "auto"` and responsive padding `px: { xs: 2, md: 4 }`

---

## Auth System (Client Side)

### AuthForm Wrapper Pattern
LoginForm and RegisterForm share: submit button, "OR" divider, Google login button, switch link.
`AuthForm` is a wrapper that receives the unique fields as `children` prop, avoiding code duplication.

### Form Validation
Each form has its own `validate()` function using `useState` for errors.
TextField `error` and `helperText` props display validation messages.

Validation rules:
- **Login**: Email required + format check, password required + min 6 chars
- **Register**: Username min 3, email format, phone required, password min 6, confirm match, terms agreement

### Google OAuth (Client)
- Uses `@react-oauth/google` package
- `GoogleOAuthProvider` wraps the app in `main.tsx` with `VITE_GOOGLE_CLIENT_ID`
- `GoogleLogin` component renders the Google button
- On success, sends credential token to server for verification
