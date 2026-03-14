# Troubleshooting - Problems & Solutions

## 1. Google OAuth - "origin not allowed" error

**Problem**: When clicking the Google login button, got an error saying the origin is not allowed.

**Cause**: In Google Cloud Console, the authorized JavaScript origin was set to `https://localhost:5173` instead of `http://localhost:5173` (HTTPS vs HTTP).

**Solution**: Changed the authorized origin to `http://localhost:5173` (without the 's') in Google Cloud Console -> APIs & Services -> Credentials -> OAuth 2.0 Client IDs.

---

## 2. CORS - "Access-Control-Allow-Origin" error

**Problem**: Client on `localhost:5173` couldn't make API calls to server on `localhost:3000`. Browser blocked the requests with CORS error.

**Cause**: Server didn't have CORS middleware configured. When client and server are on different ports, the browser blocks cross-origin requests by default.

**Solution**: Installed `cors` package and added it to `app.ts`:
```bash
npm install cors
npm install -D @types/cors
```
```ts
import cors from "cors";
app.use(cors());
```

---

## 3. MUI font not applying

**Problem**: Set font-family in CSS but MUI components (Typography, TextField, etc.) ignored it.

**Cause**: MUI components use their own styling system. CSS `font-family` doesn't override MUI's default font.

**Solution**: Created a MUI theme with `createTheme` and wrapped the app with `ThemeProvider`:
```ts
// theme.ts
const theme = createTheme({
  typography: { fontFamily: "'Inter', sans-serif" },
});

// main.tsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 4. Google OAuth token verification - expired tokens in tests

**Problem**: Server tests for Google sign-in used a real Google token that expired after 1 hour. Tests started failing.

**Cause**: Google ID tokens have a short expiration (`exp` claim). The `verifyIdToken()` function from `google-auth-library` checks expiration and rejects expired tokens.

**Solution**: Mocked the `google-auth-library` in tests so it never actually calls Google:
```ts
jest.mock("google-auth-library", () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({
            getPayload: () => ({
                email: "google.user@gmail.com",
                name: "Google User",
                picture: "https://example.com/photo.jpg",
            }),
        }),
    })),
}));
```

For the "invalid token" test, we override the mock for one call:
```ts
const { OAuth2Client } = require("google-auth-library");
const mockClient = OAuth2Client.mock.results[0].value;
mockClient.verifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));
```

---

## 5. Google token verification - fetch vs google-auth-library

**Problem**: Original code used `fetch` to `googleapis.com/tokeninfo` endpoint to verify Google tokens. This is not secure for production.

**Cause**: The `tokeninfo` endpoint is meant for debugging, not production. It doesn't properly verify the JWT signature.

**Solution**: Switched to `google-auth-library` with `verifyIdToken()`:
```bash
npm install google-auth-library
```
```ts
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client();

const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
});
const googleUser = ticket.getPayload();
```
This properly verifies: JWT signature, audience (our app's Client ID), expiration, and issuer.

---

## 6. TypeScript - "ReactNode is a type" error

**Problem**: `import { ReactNode } from "react"` caused error: `'ReactNode' is a type and must be imported using a type-only import`.

**Cause**: TypeScript `verbatimModuleSyntax` is enabled in tsconfig. It requires type imports to be explicit.

**Solution**: Use `import type`:
```ts
import type { ReactNode } from "react";
```

---

## 7. Logo and tabs jumping between Login/Register forms

**Problem**: When switching between Login and Register, the logo and tabs would shift position because they were inside each form component.

**Cause**: LoginForm and RegisterForm had different heights, and the logo/tabs were rendered inside each form.

**Solution**: Moved logo and tabs to `AuthPage` (parent), so they're shared and don't re-render when switching forms. Only the form content below changes.

---

## 8. "Password field is not contained in a form" warning

**Problem**: Browser console showed warning about password field not being in a form element.

**Cause**: MUI's `Box` component renders a `<div>` by default, not a `<form>`.

**Solution**: Changed `AuthForm` to use `<Box component="form">`:
```tsx
<Box component="form" onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }}>
```
This also enables submitting with Enter key.

---

## 9. "Input elements should have autocomplete attributes" warning

**Problem**: Browser warning about missing autocomplete attributes on input fields.

**Solution**: Added `autoComplete` prop to TextFields:
- Login email: `autoComplete="email"`
- Login password: `autoComplete="current-password"`
- Register email: `autoComplete="email"`
- Register password: `autoComplete="new-password"`
- Register username: `autoComplete="username"`
- Register phone: `autoComplete="tel"`

---

## 10. Server tests failing after branch merge

**Problem**: Tests failed with "DATABASE_URL is not defined" after switching to a new branch.

**Cause**: The `.env.test` file was missing from the new branch (it existed only on main because env files are not always tracked in git).

**Solution**: Merged main into the working branch to get the env files:
```bash
git merge main
```

---

## 11. Environment variable inconsistency

**Problem**: Server auth tests failed with 400/401 errors even though the code looked correct.

**Cause**: `.env.dev` used `JWT_REFRESH_SECRET` but the code expected `REFRESH_TOKEN_SECRET` (as defined in `.env.test` and `.env.example`).

**Solution**: Unified all env files to use the same variable name: `REFRESH_TOKEN_SECRET`.

---

## 12. `locale` prop red underline on GoogleLogin

**Problem**: `locale="en"` prop on `<GoogleLogin>` component showed TypeScript error (red underline).

**Cause**: The installed version of `@react-oauth/google` (0.13.4) doesn't support the `locale` prop.

**Solution**: Removed the `locale` prop. The button language follows the browser's language setting.

---

## 13. Gemini API key with quotes in `.env.dev`

**Problem**: Smart search returned "API key not valid" error from Google Generative AI SDK, even though the same key worked fine in Google AI Studio (browser).

**Cause**: The API key in `.env.dev` was wrapped in quotes:
```
GEMINI_API_KEY="AIzaSy..."
```
The `dotenv` library includes the quotes as part of the value itself, so the key sent to Google was `"AIzaSy..."` instead of `AIzaSy...`.

**Solution**: Removed the quotes from the `.env.dev` file:
```
GEMINI_API_KEY=AIzaSy...
```
**Rule**: Never use quotes around values in `.env` files when using `dotenv`.

---

## 14. Gemini API key loaded as `undefined` — Lazy Initialization

**Problem**: Even after fixing the quotes issue (#13), the Gemini API still returned "API key not valid". Adding `console.log(process.env.GEMINI_API_KEY)` inside the constructor showed `undefined`.

**Cause**: `llmService.ts` exported a **pre-created instance**:
```ts
export default new LLMService();
```
The constructor ran immediately when the file was first imported — **before** `dotenv.config()` was called in `app.ts`. So `process.env.GEMINI_API_KEY` was `undefined` at that point.

**Solution**: Changed from eager initialization in the constructor to **lazy initialization** with a `getModel()` method:
```ts
class LLMService {
    private model: any = null;

    private getModel() {
        if (!this.model) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            this.model = genAI.getGenerativeModel({ ... });
        }
        return this.model;
    }

    async generateResponse(prompt: string): Promise<string> {
        const result = await this.getModel().generateContent(prompt);
        return result.response.text();
    }
}
```
Now the API key is read only when the first search is performed — after `dotenv.config()` has already loaded the environment variables.

**Lesson**: When using `export default new ClassName()`, the constructor runs at import time. If the class depends on environment variables loaded by `dotenv`, use lazy initialization instead.

---

## Branch 2: feature/guest-cart

---

## 15. CartItem component name collision with interface

**Problem**: In `CartManager.tsx`, imported the `CartItem` component AND defined `interface CartItem` — TypeScript error due to name clash.

**Cause**: Both the imported component and the local interface had the same name `CartItem`.

**Solution**: Removed the component import. The interface stays in CartManager, the component import is only needed where the component is rendered (CartPage).

---

## 16. syncAfterLogin type mismatch — void vs Promise<void>

**Problem**: `CartContextType` interface had `syncAfterLogin: () => void` but `AuthForm.tsx` expected `() => Promise<void>`. TypeScript error: "Type 'void' is not assignable to type 'Promise<void>'".

**Cause**: `syncAfterLogin` is an async function (returns a Promise), but the interface declared the return type as `void`.

**Solution**: Changed the interface to `syncAfterLogin: () => Promise<void>`.

**Lesson**: Async functions always return `Promise<T>`. When defining an interface for an async function, always use `Promise<void>` instead of `void`.

---

## 17. product._id doesn't exist on mock data

**Problem**: `ProductDetailPage` tried to use `product._id` when adding to cart, but the `ProductDetail` interface only has `id: number` (mock data uses numeric IDs).

**Cause**: Mock data in `useProductDetail.ts` uses `id: 1, 2, 3...` (numbers), while the server uses `_id: string` (MongoDB ObjectId).

**Solution**: Used `product.id.toString()` as a temporary workaround until the UI is connected to the real server API.

---

## 18. Cart badge showing wrong count (1 instead of 2)

**Problem**: User added 2 items to cart from ProductDetailPage (quantity selector set to 2), but the Navbar badge showed 1.

**Cause**: The `addItem` function in `CartManager.tsx` always added `quantity: 1` regardless of what quantity was selected on the product page.

**Solution**: Added optional `quantity` parameter to `addItem` (default 1), and passed the selected quantity from `ProductDetailPage`:
```ts
// CartManager.tsx
addItem: (item: Omit<CartItem, "quantity" | "_id">, quantity?: number) => void;

// ProductDetailPage.tsx
addItem({ productId: product.id.toString(), ... }, quantity);
```

---

## 19. Mongoose SortOrder type error

**Problem**: `buildSort()` in `productsService.ts` returned `{ price: 1 }` or `{ createdAt: -1 }`, but TypeScript inferred the type as `{ price: number; createdAt?: undefined } | ...` which is not assignable to Mongoose's `.sort()` parameter.

**Cause**: TypeScript sees the return values of different if-branches and creates a union type that doesn't match Mongoose's expected `SortOrder` type.

**Solution**: Imported `SortOrder` from mongoose and added explicit return type:
```ts
import { SortOrder } from "mongoose";

private buildSort(sort?: string): Record<string, SortOrder> {
    if (sort === "price-low") return { price: 1 };
    if (sort === "price-high") return { price: -1 };
    return { createdAt: -1 };
}
```

---

## Branch 3: feature/category-paging

---

## 20. useEffect infinite loop with default filter object

**Problem**: CategoryPage caused "Maximum update depth exceeded" — infinite re-renders and the spinner never stopped.

**Cause**: `currentFilters` used a fallback default object:
```ts
const currentFilters = filtersState[category || ""] || {
    sortBy: "featured",
    priceRange: [0, 1000],
    ...
};
```
Every render created a **new object** in memory (different reference). Since `currentFilters` was in the `useEffect` dependency array, React thought the filters changed on every render → triggered useEffect → called setState → caused another render → infinite loop.

**Solution**: Wrapped the default object with `useMemo` so the same reference is reused:
```ts
const defaultFilters = useMemo(() => ({
    sortBy: "featured",
    priceRange: [0, 1000],
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    selectedTypes: [] as string[],
}), []);

const currentFilters = filtersState[category || ""] || defaultFilters;
```

**Lesson**: Never put a new object literal as a fallback in a variable that's used in a useEffect dependency array. React compares by **reference**, not by value — two objects with identical content are still "different" if created separately.

---

## 21. Express route order — `/filter` caught by `/:id`

**Problem**: `GET /products/filter` returned a "Product not found" error or a cast error, as if "filter" was being treated as a product ID.

**Cause**: The `/:id` route was defined before `/filter` in `productsRoute.ts`. Express matches routes top-to-bottom, so `/:id` caught "filter" as an ID parameter.

**Solution**: Moved `router.get("/filter", ...)` **before** `router.get("/:id", ...)` in the routes file. Static routes must always come before dynamic parameter routes.

---

## 22. React StrictMode — double API calls and stale data

**Problem**: CategoryPage made duplicate API calls and sometimes rendered stale data from a previous category.

**Cause**: React 18 StrictMode runs every `useEffect` twice in development (mount → cleanup → mount). Without protection, the first call's response could overwrite the second call's response if the first was slower.

**Solution**: Added `isEffectActive` flag pattern in every useEffect:
```ts
useEffect(() => {
    let isEffectActive = true;

    const loadData = async () => {
        const result = await fetchData();
        if (!isEffectActive) return; // Ignore stale response
        setData(result);
    };
    loadData();

    return () => { isEffectActive = false; };
}, [deps]);
```

**Lesson**: In React 18 StrictMode, always use a cleanup flag to discard responses from unmounted effect runs. The cleanup function sets the flag to `false`, so any pending async operation from a stale run is ignored.

---

## 23. Infinite loading loop — mutating refs inside state updater

**Problem**: Infinite scroll kept loading pages 4, 5, 6, 7, 8... endlessly, never stopping.

**Cause**: The code updated `productCurrentAmount.current` (a ref) inside the `setProducts` callback. React 18 batches state updates, so the updater function runs asynchronously. The ref was being overwritten by stale updater calls, causing the "has more products" check to always return true.

**Solution**: Replaced `productCurrentAmount` and `totalProductAmount` refs with a single `hasMore` ref, set **outside** the `setProducts` callback:
```ts
// WRONG — mutating ref inside state updater
setProducts((prev) => {
    productCurrentAmount.current = prev.length + result.products.length; // Unreliable!
    return [...prev, ...result.products];
});

// RIGHT — set ref outside the updater
setProducts((prev) => [...prev, ...result.products]);
hasMore.current = result.products.length >= PRODUCTS_PER_PAGE;
```

**Lesson**: Never mutate refs inside React state updater functions. The updater may run multiple times or at unexpected moments due to batching. Set refs in the main flow, after the state update call.

---

## 24. MongoDB sort instability — duplicate/missing products between pages

**Problem**: When using `skip/limit` pagination with `{ createdAt: -1 }` sort, some products appeared on multiple pages while others were missing entirely.

**Cause**: MongoDB's sort is **not stable** — documents with the same sort value (e.g., same `createdAt` timestamp from a bulk seed) can appear in different orders between queries. With `skip/limit`, this means a product on page 1 might "move" to page 2's range on the next query.

**Solution**: Added `_id: 1` as a tiebreaker to every sort:
```ts
private buildSort(sort?: string): Record<string, SortOrder> {
    if (sort === "price-low") return { price: 1, _id: 1 };
    if (sort === "price-high") return { price: -1, _id: 1 };
    if (sort === "most-popular") return { soldCount: -1, _id: 1 };
    return { _id: 1 };
}
```

**Lesson**: Always add a unique field (like `_id`) as the last sort key when using `skip/limit` pagination. This guarantees a deterministic order and prevents documents from "jumping" between pages.

---

## 25. Ghost server process — debug logs not appearing

**Problem**: Added `console.log` to server controller and service, but nothing appeared in the terminal. Server returned correct data. Even `curl` requests produced no logs.

**Cause**: An **old server process** was still running on port 3000 from a previous `npm run dev` session. The new nodemon process appeared to start successfully (showed "Server running on http://localhost:3000"), but the old process was actually handling all requests.

**Discovery**: `netstat -ano | findstr :3000` revealed process ID 25336 listening on the port. Stopping nodemon didn't affect it. `taskkill /PID 25336 /F` killed the ghost process.

**Solution**: Kill the old process and restart:
```bash
netstat -ano | findstr :3000          # Find the PID
taskkill /PID <PID> /F                # Kill it
npm run dev                           # Start fresh
```

**Lesson**: When server-side logs don't appear despite correct code, check for ghost processes on the port. On Windows, `nodemon` sometimes leaves orphan Node.js processes running after being stopped. Always verify with `netstat` before debugging further.

---

## 26. MUI h6 inside h2 — DOM nesting warning

**Problem**: Console warning: "validateDOMNesting: `<h6>` cannot appear as a descendant of `<h2>`".

**Cause**: In `FiltersDialog`, the `DialogTitle` component renders as `<h2>`, and inside it there was a `Typography variant="h6"` which renders as `<h6>`. HTML doesn't allow heading elements nested inside other headings.

**Solution**: Added `component="span"` to the inner Typography so it renders as `<span>` instead of `<h6>`:
```tsx
<DialogTitle>
    <Typography variant="h6" component="span" ...>
        Filters & Sort
    </Typography>
</DialogTitle>
```

**Lesson**: MUI's `variant` controls styling, `component` controls the HTML element. When nesting Typography inside DialogTitle/AccordionSummary (which render as headings), always use `component="span"` or `component="div"`.

---

## Branch 4: feature/connect-reviews-to-DB

---

## 27. React StrictMode — cart items duplicated via API

**Problem**: Adding 1 item to cart resulted in quantity 2. The item appeared doubled in the server cart.

**Cause**: In `CartManager.tsx`, the API call (`addItemToCart`) was inside the `setCartItems` updater function. React 18 StrictMode runs updater functions twice in development — so the API call fired twice, adding the item to the server cart twice.

**Solution**: Moved all API calls (add, update, remove) **outside** the `setCartItems` updater. The updater now only contains pure state logic:
```ts
// WRONG — API call inside updater (fires twice in StrictMode)
setCartItems((prev) => {
    addItemToCart({ ... }); // Side effect!
    return [...prev, newItem];
});

// RIGHT — API call outside updater
setCartItems((prev) => [...prev, newItem]);
if (isLoggedIn()) {
    addItemToCart({ ... }); // Side effect outside
}
```

**Lesson**: Never put side effects (API calls, localStorage writes) inside React state updater functions. Updater functions should be pure — only compute and return the new state. Side effects belong in the main function body, after the setState call.
