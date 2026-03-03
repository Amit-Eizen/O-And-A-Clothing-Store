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
│   │   └── Testimonial.tsx     # Customer testimonial section
│   │
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky top bar (logo, nav links, action icons)
│   │   ├── Footer.tsx          # Site footer
│   │   └── ScrollToTop.tsx     # Scrolls to top on route change
│   │
│   └── products/
│       ├── ProductCard.tsx     # Reusable product card (image, tags, name, price)
│       └── FiltersDialog.tsx   # Filters & Sort dialog (sort, type, price, size, color)
│
├── pages/
│   ├── AuthPage.tsx            # Login/Register page (split-screen layout)
│   ├── HomePage.tsx            # Homepage (Hero + Categories + NewArrivals + Testimonial)
│   └── CategoryPage.tsx        # Category page (breadcrumb, title, filters, product grid)
│
├── services/
│   ├── api-client.ts           # Axios instance (base URL: localhost:3000)
│   └── auth-service.ts         # API calls: loginUser, registerUser, googleSignIn
│
└── hooks/                      # Custom React hooks (empty, for future use)
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
    <Route path="/:category" element={<CategoryPage />} />
  </Routes>
  <Footer />
</BrowserRouter>
```

- `/:category` handles `/women`, `/men`, `/accessories` with one component using `useParams`
- `ScrollToTop` ensures page scrolls to top on navigation (uses `useLocation` + `useEffect`)
- Navbar and Footer are always visible (outside Routes)

---

## Component Hierarchy

```
main.tsx
  └── GoogleOAuthProvider
      └── ThemeProvider (MUI theme with Inter font)
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
              │   └── CategoryPage
              │       ├── Breadcrumb (Home / Category)
              │       ├── Title + Subtitle
              │       ├── Filters & Sort button → FiltersDialog
              │       ├── Product Grid (uses ProductCard)
              │       └── Load More button
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
- Used in both NewArrivals and CategoryPage
- Shows: image (400px height, hover zoom), tags (NEW/SALE chips), type, name, price
- Sale price shows old price with strikethrough
- Links to `/{category}/{id}`
- Tag colors: SALE = gold (#c8a951), others = black

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
- Per-category filter state using `Record<string, FilterState>` pattern
- Filter state persists when switching between categories (within same session)
- Mock product data (will be replaced with API calls)

### ScrollToTop
- Listens to `useLocation` pathname changes
- Calls `window.scrollTo(0, 0)` on every route change
- Returns null (no visual output)

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
