# Future Features

## Size Guide
- Add a size guide dialog/page for each product category
- Show size charts (measurements table) for shirts, pants, shoes, etc.
- Accessible from the product detail page

## Change Password
- Add `PUT /users/change-password` endpoint (requires current password + new password)
- Add change password section in Account Settings page
- Validate current password with bcrypt before allowing change

## Reviews — Only Purchasers Can Write
- Only users who purchased a specific product can write a review for it
- Server: check if user has a delivered order containing the productId before allowing review creation
- Client: conditionally show "Write a Review" button based on purchase history

## Wishlist — Full Client Integration
- "Add to Wishlist" button on ProductDetailPage currently has no onClick handler
- No heart icon on ProductCard components
- Need useWishlist hook for consistent operations across components
- Show filled/outlined heart based on whether product is in wishlist

## NewArrivals — Connect to API
- Currently hardcoded with 4 static products from assets
- Should fetch newest products from server (`sort=newest`, `limit=4`)

## Move Assets to Server
- `client/src/assets/` still has images used by homepage components (hero, categories, auth page)
- These should be served from the server like product images

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
