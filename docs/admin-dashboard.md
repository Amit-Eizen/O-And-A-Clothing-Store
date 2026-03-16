# Admin Dashboard

## Overview

Full admin dashboard for managing products, orders, users, and site settings. Accessible only to users with `role: "admin"`. Admin link appears in the Navbar only for admin users.

**Admin credentials (seed):** `admin@oa-store.com` / `Admin123!`

---

## Server

### New Files

| File | Description |
|------|-------------|
| `services/adminService.ts` | Dashboard stats, paginated orders/users/products, low stock, toggle new arrival |
| `controllers/adminController.ts` | Route handlers (plain object, not BaseController) |
| `routes/adminRoute.ts` | All routes behind `authenticate + authorizeAdmin` middleware |

### Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin/stats` | Dashboard stats (totals, revenue, recent orders) |
| GET | `/admin/orders` | Paginated orders (filter by status) |
| GET | `/admin/users` | Paginated users (no password/refreshToken) |
| GET | `/admin/products` | Paginated products (sortable) |
| POST | `/admin/products` | Create new product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| PUT | `/admin/products/:id/featured` | Toggle `isFeaturedNewArrival` |
| PUT | `/admin/orders/:id/status` | Update order status |
| GET | `/admin/low-stock` | Products with stock <= threshold |
| GET | `/admin/media-library` | All product images from server |
| POST | `/admin/upload-media` | Upload images to media library |
| PUT | `/admin/replace-banner` | Replace a site banner image |

### Modified Files

- **`authService.ts`** — Login/register/refresh now returns `role` in response
- **`app.ts`** — Registered `/admin` route
- **`seed.ts`** — Adds admin user, marks first 4 products as `isFeaturedNewArrival`
- **`swagger.ts`** — Added `Admin` tag
- **`uploadMiddleware.ts`** — Added `uploadMediaImages` for media library uploads

---

## Client

### New Files

| File | Description |
|------|-------------|
| `pages/AdminDashboardPage.tsx` | Main admin page (sidebar + sections, `?section=` query param) |
| `components/admin/AdminSidebar.tsx` | Sidebar navigation (Dashboard, Products, Orders, Users, Settings) |
| `components/admin/DashboardStatsSection.tsx` | Stat cards + low stock alerts + recent orders |
| `components/admin/ProductsManagementSection.tsx` | Product table with sort, edit, delete, NEW tag toggle, media library |
| `components/admin/OrdersManagementSection.tsx` | Orders table with status filters and status update |
| `components/admin/UsersSection.tsx` | Paginated users list (read-only) |
| `components/admin/SettingsSection.tsx` | Banner management + New Arrivals homepage control |
| `services/admin-api.ts` | All admin API calls |
| `utils/adminAuth.ts` | `isAdmin()` helper (checks localStorage role) |

### Modified Files

- **`auth-service.ts`** — Saves `role` to localStorage
- **`Navbar.tsx`** — Shows admin icon for admin users
- **`App.tsx`** — Added `/admin` route
- **`products-api.ts`** — `getProductTags` checks manual "new" tag only (no auto-detection)

### Route

`/admin` → `AdminDashboardPage` with `?section=` query param:
- `dashboard` (default) — Stats, low stock, recent orders
- `products` — Product management table
- `orders` — Order management with status filters
- `users` — User list
- `settings` — Banners + New Arrivals

---

## Key Concepts

### NEW Tag vs Homepage New Arrivals

Two separate features:

1. **NEW tag** (Products Management) — Admin toggles "new" in `product.tags` array. Controls the "NEW" badge on ProductCard in the store.

2. **Homepage New Arrivals** (Settings) — Admin controls which 4 products appear in the homepage New Arrivals section via `isFeaturedNewArrival` field. Uses Replace/Remove pattern (same as banners).

### Auth Role Flow

1. Server returns `role` in login/register/refresh response
2. Client saves `role` in localStorage
3. `isAdmin()` checks `localStorage.getItem("role") === "admin"`
4. Navbar conditionally shows admin link
5. AdminDashboardPage redirects non-admins to `/`
6. All admin API routes are protected by `authorizeAdmin` middleware

### Media Library

- Scans `server/public/images/` for all product images
- Organized by category tabs (Women, Men, Accessories)
- Upload new images to specific category folders
- Used in product edit/create dialogs and banner replacement
