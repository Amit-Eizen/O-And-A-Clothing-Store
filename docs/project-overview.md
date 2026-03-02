# O&A Clothing Store - Project Overview

## Project Structure

```
O-And-A-Clothing-Store/
├── client/                     # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── pages/              # Full page components
│   │   │   └── AuthPage.tsx    # Login/Register page (split-screen layout)
│   │   ├── components/
│   │   │   └── auth/           # Auth-related components
│   │   │       ├── AuthForm.tsx      # Shared form wrapper (submit button, Google login, switch link)
│   │   │       ├── LoginForm.tsx     # Login fields + validation
│   │   │       └── RegisterForm.tsx  # Register fields + validation
│   │   ├── services/
│   │   │   ├── api-client.ts   # Axios instance (base URL: localhost:3000)
│   │   │   └── auth-service.ts # API calls: loginUser, registerUser, googleSignIn
│   │   ├── assets/             # Images (auth-image.jpg)
│   │   ├── theme.ts            # MUI theme (Inter font)
│   │   ├── main.tsx            # Entry point (ThemeProvider + GoogleOAuthProvider)
│   │   ├── App.tsx             # Root component (renders AuthPage)
│   │   └── index.css           # Global styles + font imports
│   ├── .env                    # VITE_GOOGLE_CLIENT_ID
│   └── package.json
│
├── server/                     # Node.js backend (Express + TypeScript)
│   ├── src/
│   │   ├── models/
│   │   │   ├── userModel.ts       # User schema (username, email, password, refreshToken[], address, phoneNumber, profileImage, role)
│   │   │   ├── reviewsModel.ts    # Review schema (userId, title, content, rating, images, likes)
│   │   │   ├── productsModel.ts   # Product schema (name, brand, description, price, salePrice, category, gender, sizes, colors, images, stock, tags)
│   │   │   ├── cartModel.ts        # Cart schema (userId unique, items[productId, quantity, size, color, price])
│   │   │   ├── ordersModel.ts      # Order schema (userId, orderNumber, items[], totalPrice, shipping, status, shippingAddress)
│   │   │   └── commentsModel.ts   # Comment schema (userId, reviewId, content)
│   │   ├── services/
│   │   │   ├── baseService.ts     # Reusable CRUD service (getAll, getById, create, update, delete)
│   │   │   ├── authService.ts     # Auth logic (register, login, logout, refreshToken, googleSignIn)
│   │   │   ├── reviewsService.ts  # Reviews logic (getWithPaging, getByUserId, toggleLike)
│   │   │   ├── productsService.ts # Products logic (getProductsByCategory, searchProducts)
│   │   │   ├── cartService.ts     # Cart logic (getCartByUserId, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart)
│   │   │   ├── ordersService.ts   # Orders logic (createOrder, getOrdersByUserId, updateOrderStatus, generateOrderNumber)
│   │   │   ├── commentsService.ts # Comments logic (getCommentsByReviewId)
│   │   │   └── LLM/
│   │   │       ├── llmService.ts              # Gemini API client (Google Generative AI SDK)
│   │   │       └── searchService.ts           # Smart search (LLM filter extraction + MongoDB query)
│   │   ├── controllers/
│   │   │   ├── baseController.ts      # Reusable CRUD controller with HTTP status codes
│   │   │   ├── authController.ts      # Auth endpoints handler
│   │   │   ├── reviewsController.ts   # Reviews endpoints (create with userId from token, paging, like)
│   │   │   ├── productsControllers.ts # Products endpoints (getByCategory, search)
│   │   │   ├── searchController.ts    # Smart search endpoint (LLM-powered)
│   │   │   ├── cartController.ts      # Cart endpoints (get, addItem, updateQuantity, removeItem, clear)
│   │   │   ├── ordersController.ts    # Orders endpoints (createOrder, getByUserId, getById, updateStatus)
│   │   │   └── commentsControllers.ts # Comments endpoints (create with userId from token, getByReview)
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT verification (authenticate) + admin authorization (authorizeAdmin)
│   │   ├── routes/
│   │   │   ├── authRoute.ts       # Auth routes with Swagger docs
│   │   │   ├── reviewsRoute.ts    # Reviews routes with Swagger docs
│   │   │   ├── productsRoute.ts   # Products routes with Swagger docs (admin-only for CUD)
│   │   │   ├── cartRoute.ts       # Cart routes with Swagger docs (all authenticated)
│   │   │   ├── ordersRoute.ts     # Orders routes with Swagger docs (updateStatus admin-only)
│   │   │   └── commentsRoute.ts   # Comments routes with Swagger docs
│   │   ├── tests/
│   │   │   ├── auth.test.ts       # Auth tests (register, login, refresh, logout, Google OAuth)
│   │   │   ├── reviews.test.ts    # Reviews tests (CRUD, paging, like/unlike, auth)
│   │   │   ├── products.test.ts   # Products tests (CRUD, search, category, gender filter, admin auth)
│   │   │   ├── cart.test.ts       # Cart tests (add, update quantity, remove, clear, duplicate item, auth)
│   │   │   ├── orders.test.ts     # Orders tests (create from cart, empty cart, getByUser, status update, admin auth)
│   │   │   ├── comments.test.ts   # Comments tests (CRUD, getByReview, auth)
│   │   │   ├── controllers/
│   │   │   │   └── productsController.search.test.ts  # Smart search controller unit tests (6 tests, mocked)
│   │   │   └── services/
│   │   │       └── llmService.test.ts                 # LLM service integration tests (2 tests, real Gemini API)
│   │   ├── app.ts              # Express app setup (MongoDB, Swagger, CORS, routes)
│   │   ├── server.ts           # Entry point
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   ├── .env.dev / .env.test / .env.prod   # Environment configs
│   └── package.json
│
└── docs/                       # Project documentation
```

---

## Authentication System

### How It Works

1. **Register**: User sends username + email + password -> server hashes password with bcrypt -> saves to DB -> returns JWT access token + refresh token

2. **Login**: User sends email + password -> server verifies with bcrypt -> returns new JWT tokens

3. **Google OAuth**:
   - Client: User clicks Google button -> Google returns credential token -> client sends to server
   - Server: Verifies token with `google-auth-library` (`verifyIdToken`) -> creates user if new -> returns JWT tokens
   - The `verifyIdToken` checks: JWT signature, audience (our app), expiration, issuer

4. **JWT Tokens**:
   - **Access Token**: Short-lived (1 hour), used in Authorization header for protected routes
   - **Refresh Token**: Longer-lived (24 hours), stored in user's `refreshToken[]` array in DB
   - When access token expires, client sends refresh token to get new pair
   - **Token theft detection**: If someone tries to use an old refresh token, ALL tokens for that user are cleared

5. **Logout**: Client sends refresh token -> server removes it from user's array

### Token Flow Diagram

```
[User] --login/register--> [Server] --returns--> { token, refreshToken }
                                                       |
[User] --stores in localStorage--                      |
                                                       |
[User] --API request with Authorization: Bearer token--> [authMiddleware] --verifies--> [Protected Route]
                                                       |
[User] --token expired, sends refreshToken--> [Server] --returns new--> { token, refreshToken }
```

---

## Client Architecture

### Component Hierarchy

```
main.tsx
  └── GoogleOAuthProvider
      └── ThemeProvider (MUI theme with Inter font)
          └── App
              └── AuthPage
                  ├── Logo ("O&A Clothes" - Playfair Display font)
                  ├── Tabs (Login / Register)
                  ├── LoginForm
                  │   └── AuthForm (wrapper)
                  │       ├── [children] (email + password fields)
                  │       ├── Submit Button
                  │       ├── OR Divider
                  │       ├── Google Login Button
                  │       └── Switch Link ("Don't have an account? Register")
                  └── RegisterForm
                      └── AuthForm (wrapper)
                          ├── [children] (username + email + phone + password + confirm + terms)
                          ├── Submit Button
                          ├── OR Divider
                          ├── Google Login Button
                          └── Switch Link ("Already have an account? Sign In")
```

### Why AuthForm Wrapper?

LoginForm and RegisterForm share: submit button, "OR" divider, Google login, switch link.
Instead of duplicating this code, `AuthForm` is a wrapper that receives the unique fields as `children` prop.

### Styling Approach

- **MUI `sx` prop** - This is the standard way to style MUI components (not separate CSS files)
- **ThemeProvider** - Global font (Inter) applied via MUI createTheme
- **Playfair Display** - Only for the logo, applied via inline `fontFamily`
- Both fonts imported in `index.css` from Google Fonts

### Form Validation

Each form has its own `validate()` function using `useState` for errors.
TextField `error` and `helperText` props display validation messages.

Validation rules:
- **Login**: Email required + format check, password required + min 6 chars
- **Register**: Username min 3, email format, phone required, password min 6, confirm match, terms agreement

---

## Server Architecture

### Base Classes (Inheritance Pattern)

```
BaseService (getAll, getById, create, update, delete)
    ├── ReviewsService extends BaseService (adds getWithPaging, getByUserId, toggleLike)
    ├── ProductsService extends BaseService (adds getProductsByCategory, searchProducts)
    ├── CartService extends BaseService (adds getCartByUserId, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart)
    ├── OrdersService extends BaseService (adds createOrder, getOrdersByUserId, updateOrderStatus, generateOrderNumber)
    └── CommentsService extends BaseService (adds getCommentsByReviewId)

BaseController (getAll, getById, create, update, delete - with HTTP status codes)
    ├── ReviewsController extends BaseController (overrides create for userId from token, adds paging, like)
    ├── ProductsController extends BaseController (adds getProductsByCategory, searchProducts)
    └── CommentsController extends BaseController (overrides create for userId from token, adds getByReview)
```

Auth, Cart, and Orders don't use base controller classes - Auth has different logic, Cart and Orders use custom controller functions (not class-based).

### Environment Files

- `.env.dev` - Development (local MongoDB, port 3000)
- `.env.test` - Tests (separate test DB)
- `.env.prod` - Production

Required variables: `DATABASE_URL`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`, `GOOGLE_CLIENT_ID`, `GEMINI_API_KEY`

### Middleware

`authMiddleware.ts` provides two middlewares:
- **authenticate**: Extracts JWT from `Authorization: Bearer <token>` header, verifies it, attaches `userId` to request. Used on protected routes.
- **authorizeAdmin**: Checks that the authenticated user has `role: "admin"` in DB. Used on product management routes (create/update/delete) and order status updates. Returns 403 if not admin.

---

## Cart & Order Flow

```
[User] --browses products--> [Product Page]
    |
    v
[Add to Cart] --POST /cart/items--> [Cart] (one per user, userId unique)
    |                                   |
    | same product+size+color?          | different size/color?
    | --> quantity increases             | --> new item added
    |
    v
[Checkout] --POST /orders--> [Order Service]
    |                              |
    | 1. Get cart items            |
    | 2. Calculate totalPrice      |
    |    (sum of price*quantity    |
    |     + shipping)              |
    | 3. Generate orderNumber      |
    |    (ORD-2026-001)           |
    | 4. Create order              |
    | 5. Clear cart                |
    v
[Order Created] --status: "pending"--> [Admin updates status]
    pending → processing → shipped → delivered
                                    → cancelled
```

**Price Logic**: The `price` stored in cart/order items is the final price the customer pays. If a product has a `salePrice`, the client sends `salePrice` as the `price`. If not, it sends the regular `price`.

---

## Models

### User
| Field | Type | Notes |
|-------|------|-------|
| username | string | Required, unique |
| email | string | Required, unique |
| password | string | Required, hashed with bcrypt |
| refreshToken | string[] | Array of active refresh tokens |
| address | object | Optional (street, city, zipCode, country) |
| phoneNumber | string | Optional |
| profileImage | string | Optional |
| role | string | "user" or "admin", default: "user" |

### Product
| Field | Type | Notes |
|-------|------|-------|
| name | string | Required |
| brand | string | Required |
| description | string | Required (for future AI integration) |
| price | number | Required |
| salePrice | number | Optional discount price |
| category | string | Required (e.g., shirts, pants, shoes) |
| gender | string | Required, enum: "men", "women", "unisex" |
| sizes | string[] | Available sizes |
| colors | string[] | Available colors |
| images | string[] | Product image paths |
| stock | number | Required, default: 0 |
| tags | string[] | For search (e.g., cotton, casual, summer) |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

### Review
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who posted it |
| title | string | Review title |
| content | string | Review text |
| rating | number | 1-5 stars |
| images | string[] | Array of image paths (stored on server, not DB) |
| likes | ObjectId[] | Array of user IDs who liked |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

### Cart
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Required, unique (one cart per user) |
| items | Array | Cart items |
| items.productId | ObjectId (ref: products) | Product reference |
| items.quantity | number | Required, min: 1 |
| items.size | string | Selected size |
| items.color | string | Selected color |
| items.price | number | Price at time of adding (salePrice or regular price) |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

### Order
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who placed the order |
| orderNumber | string | Unique, format: ORD-YYYY-NNN |
| items | Array | Ordered items (copied from cart) |
| items.productId | ObjectId (ref: products) | Product reference |
| items.quantity | number | Required, min: 1 |
| items.size | string | Selected size |
| items.color | string | Selected color |
| items.price | number | Price paid per unit |
| totalPrice | number | Sum of (price × quantity) + shipping |
| shipping | number | Shipping cost, default: 0 |
| status | string | Enum: pending, processing, shipped, delivered, cancelled |
| shippingAddress | object | street, city, zipCode, country |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who wrote the comment |
| reviewId | ObjectId (ref: reviews) | Which review it belongs to |
| content | string | Comment text |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

---

## LLM Smart Search

### Architecture

The smart search feature uses Google's Gemini API to understand natural language product queries and convert them into structured MongoDB filters.

```
[User] --"red summer dress under 200"--> [Smart Search Endpoint]
    |
    v
[SearchService] --builds prompt--> [LLMService] --Gemini SDK--> [Gemini API (gemini-2.5-flash)]
    |
    v
[LLM returns JSON] --> {"category": "dresses", "color": "red", "maxPrice": 200, "tags": ["summer"]}
    |
    v
[SearchService] --builds MongoDB filter--> [productsService.getAll(filter)]
    |
    v
[Matching Products] --> Response to client
```

### Components

- **LLMService** (`services/LLM/llmService.ts`): Gemini API client using `@google/generative-ai` SDK. Uses `gemini-2.5-flash` model with `temperature: 0.1` for consistent results, `responseMimeType: "application/json"` for structured output, `maxOutputTokens: 500`.
- **SearchService** (`services/LLM/searchService.ts`): Builds a prompt that instructs the LLM to extract filters (category, gender, color, size, price range, tags, query). Parses the JSON response and builds a MongoDB filter object.
- **SearchController** (`controllers/searchController.ts`): Handles `GET /products/smart-search?q=` endpoint.

### Search Filter Extraction

The LLM extracts these optional fields from natural language:
| Filter | MongoDB Field | Example Query |
|--------|--------------|---------------|
| category | category | "show me pants" → `{category: "pants"}` |
| gender | gender | "women's shoes" → `{gender: "women"}` |
| color | colors (regex) | "blue jacket" → `{colors: {$regex: "blue", $options: "i"}}` |
| size | sizes | "XL shirts" → `{sizes: "XL"}` |
| minPrice/maxPrice | price ($gte/$lte) | "under 200" → `{price: {$lte: 200}}` |
| tags | tags ($in, regex) | "casual cotton" → `{tags: {$in: [/casual/i, /cotton/i]}}` |
| query | name/description/brand ($or, regex) | "Nike" → `{$or: [{name: /Nike/i}, ...]}` |

### Fallback

If the LLM response fails to parse as JSON, the service falls back to regular regex-based `productsService.searchProducts(userQuery)`.

### Gemini API

- **SDK**: `@google/generative-ai`
- **Model**: `gemini-2.5-flash`
- **API Key**: Configured via `GEMINI_API_KEY` env variable
- **Get API Key**: https://aistudio.google.com/apikey

---

## How to Run

### Server
```bash
cd server
npm install
npm run dev     # Development with nodemon
npm run test    # Run tests
```

### Client
```bash
cd client
npm install
npm run dev     # Vite dev server on port 5173
```

Both need to run simultaneously (two terminals).

### Required Setup
1. MongoDB running locally
2. `.env` files configured (see `.env.example`)
3. Google OAuth Client ID configured in Google Cloud Console
   - Authorized JavaScript origins: `http://localhost:5173`
   - Add `GOOGLE_CLIENT_ID` to server `.env` files
   - Add `VITE_GOOGLE_CLIENT_ID` to client `.env`
