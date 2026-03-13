# Future Features

## Size Guide
- Add a size guide dialog/page for each product category
- Show size charts (measurements table) for shirts, pants, shoes, etc.
- Accessible from the product detail page

## Change Password
- Add `PUT /users/change-password` endpoint (requires current password + new password)
- Add change password section in Account Settings page
- Validate current password with bcrypt before allowing change

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
