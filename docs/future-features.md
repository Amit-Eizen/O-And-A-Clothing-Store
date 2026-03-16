# Future Features

## Size Guide
- Add a size guide dialog/page for each product category
- Show size charts (measurements table) for shirts, pants, shoes, etc.
- Accessible from the product detail page

## Change Password
- Add `PUT /users/change-password` endpoint (requires current password + new password)
- Add change password section in Account Settings page
- Validate current password with bcrypt before allowing change

---

## Category Page — API Connection with Paging (COMPLETED — branch: feature/category-paging)
- Replaced mock products in `CategoryPage.tsx` with real API calls (`GET /products/filter`)
- Implemented infinite scroll with `IntersectionObserver` on sentinel div (replaced scroll event listener)
- Filters (sort, price range, sizes, colors, types) sent as query params to server
- "Showing X of Y" count from API response (`total` field)
- Server: `getFilteredProducts` with `buildFilter` + `buildSort` (with `_id` tiebreaker) + `skip/limit` pagination
- Client: `products-api.ts` service with `fetchFilteredProducts` + `paramRules` conversion
- Controller: `paramRules` array for clean URL string → typed params conversion
- **Refactored** into custom hooks: `useCategoryFilters` (filter state per category) + `useCategoryProducts` (loading + infinite scroll + IntersectionObserver)
- `useCallback` on `buildFilterParams` — both useEffects depend on it
- `isEffectActive` flag pattern for React StrictMode protection
- `hasMore` ref for pagination control (set outside state updater to avoid ref mutation bug)
- Duplicate protection with `existingIds` Set in state updater
- Fixed infinite re-render bug with `useMemo` for default filter object (troubleshooting #20)
- Fixed sort instability with `_id: 1` tiebreaker in all MongoDB sorts (troubleshooting #24)
- ProductCard `id` changed from `number` to `string` (MongoDB `_id`)
- Empty state message when no products available

## Reviews — Connect to DB (COMPLETED — branch: feature/connect-reviews-to-DB)
- Server: Added `getByProductId` endpoint with pagination, sorting, stats (averageRating, reviewBreakdown)
- Server: Seed script now creates 5 users + reviews + comments
- Server: Ownership check on review/comment update/delete
- Client: `reviews-api.ts` service (fetchProductReviews, toggleLike, fetchComments, postComment)
- Client: `useProductReviews` hook replaces all mock data with API calls
- Client: ReviewCard wired to like API, CommentsDialog fetches/posts via API
- Client: ReviewsPage and ProductDetailPage show real ratings and breakdown
- Client: ReviewsTab shows "No Reviews Yet" for products without reviews

## Checkout — Connect to API (COMPLETED — branch: feature/connect-reviews-to-DB)
- Checkout form submits order via `POST /orders` (shipping, tax, shippingAddress)
- Order success popup shows order number with "View My Orders" / "Continue Shopping"
- Cart clears after successful order
- Checkout form pre-fills address/contact from user profile (`GET /users/profile`)
- Order total includes subtotal + shipping + tax (tax field added to Order model)
- Cart duplicate items fix: moved API calls outside React setState updater (StrictMode safe)

## UI Polish & Code Quality (COMPLETED — branch: feature/ui-polish-and-fixes)
- Created `client/src/utils/format.ts` — shared helpers (`getAvatarLetters`, `formatDate`, `getImageUrl`) replacing duplication across ~15 files
- Extracted `clearAuthData()` and exported `saveTokenInLocalStorage()` from `auth-service.ts`
- `api-client.ts` response interceptor uses auth helpers for auto token refresh on 401
- Replaced scattered `${apiClient.defaults.baseURL}${path}` with `getImageUrl(path)` across all components
- Fixed camelCase inconsistency: `getwithPaging` → `getWithPaging` in reviewsController + route
- Imported shared `AuthRequest` type from middleware instead of local interface in userController
- Added `_req` convention for unused multer callback parameters

## Wishlist — Full Client Integration (COMPLETED — branch: feature/ui-polish-and-fixes)
- Added `useWishlist` hook for consistent wishlist operations across components
- Heart toggle on ProductCard (filled/outlined based on wishlist state)
- "Add to Wishlist" button on ProductDetailPage wired to API
- Wishlist grid in My Account with remove functionality

## NewArrivals — Connect to API (COMPLETED — branch: feature/ui-polish-and-fixes)
- Fetches newest products from server (`GET /products/new-arrivals`)
- Replaced hardcoded static products with real API data

## Move Assets to Server (COMPLETED — branch: feature/ui-polish-and-fixes)
- Moved hero, category, and auth images from `client/src/assets/` to `server/public/images/`
- All components now use `getImageUrl()` to load images from server

## Reviews — Only Purchasers Can Write (COMPLETED — branch: feature/ui-polish-and-fixes)
- Server: `hasPurchased` check in reviewsController — verifies user has an order with status processing/shipped/delivered containing the productId
- Client: "Write a Review" button shown conditionally based on purchase history
- Returns 403 if user hasn't purchased the product

## Admin Dashboard (COMPLETED — branch: feature/admin-dashboard)
- Full admin dashboard with product, order, user management and site settings
- Server: adminService + adminController + adminRoute (all behind `authenticate + authorizeAdmin`)
- Dashboard stats, paginated tables, low stock alerts, media library with upload
- Product management: CRUD, NEW tag toggle (manual via tags array), image management
- Order management: status filters, status update dropdown
- Settings: banner replacement + New Arrivals homepage control (replace/remove pattern)
- Auth role plumbing: login/register returns `role`, saved in localStorage, `isAdmin()` helper
- Seed script adds admin user (`admin@oa-store.com` / `Admin123!`)
- See [admin-dashboard.md](admin-dashboard.md) for full details
