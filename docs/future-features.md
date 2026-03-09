# Future Features

## Size Guide
- Add a size guide dialog/page for each product category
- Show size charts (measurements table) for shirts, pants, shoes, etc.
- Accessible from the product detail page

## Change Password
- Add `PUT /users/change-password` endpoint (requires current password + new password)
- Add change password section in Account Settings page
- Validate current password with bcrypt before allowing change

## Category Page — API Connection with Paging
- Replace mock products in `CategoryPage.tsx` with real API calls (`GET /products`)
- Implement paging/infinite scroll with "LOAD MORE PRODUCTS" button
- Apply filters (sort, price range, sizes, colors, types) via query params
- Show correct "Showing X of Y" count from API response
