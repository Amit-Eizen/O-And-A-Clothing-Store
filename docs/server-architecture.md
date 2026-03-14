# Server Architecture (Express + TypeScript + MongoDB)

## Project Structure

```
server/src/
├── app.ts                      # Express app setup (MongoDB, Swagger, CORS, routes)
├── server.ts                   # Entry point
├── seed.ts                     # Database seed script (54 sample products with images)
├── swagger.ts                  # Swagger/OpenAPI configuration
│
├── models/
│   ├── userModel.ts            # User schema
│   ├── productsModel.ts        # Product schema
│   ├── reviewsModel.ts         # Review schema
│   ├── cartModel.ts            # Cart schema (one per user)
│   ├── ordersModel.ts          # Order schema
│   └── commentsModel.ts        # Comment schema
│
├── services/
│   ├── baseService.ts          # Reusable CRUD service (getAll, getById, create, update, delete)
│   ├── authService.ts          # Auth logic (register, login, logout, refreshToken, googleSignIn)
│   ├── reviewsService.ts       # Reviews (getWithPaging, getByUserId, getByProductId, toggleLike)
│   ├── productsService.ts      # Products (getProductsByCategory, searchProducts, getFilteredProducts with pagination)
│   ├── cartService.ts          # Cart (getCartByUserId, addItem, updateQuantity, removeItem, clearCart, mergeCart)
│   ├── ordersService.ts        # Orders (createOrder, getOrdersByUserId, updateOrderStatus, generateOrderNumber)
│   ├── commentsService.ts      # Comments (getCommentsByReviewId)
│   └── LLM/
│       ├── llmService.ts       # Gemini API client (Google Generative AI SDK)
│       └── searchService.ts    # Smart search (LLM filter extraction + MongoDB query)
│
├── controllers/
│   ├── baseController.ts       # Reusable CRUD controller with HTTP status codes
│   ├── authController.ts       # Auth endpoints handler
│   ├── reviewsController.ts    # Reviews (create with userId from token, paging, like, getByProductId, ownership check on update/delete)
│   ├── productsControllers.ts  # Products (getByCategory, search, getFilteredProducts)
│   ├── searchController.ts     # Smart search endpoint (LLM-powered)
│   ├── cartController.ts       # Cart endpoints
│   ├── ordersController.ts     # Orders endpoints
│   └── commentsControllers.ts  # Comments (create with userId from token, getByReview)
│
├── middleware/
│   └── authMiddleware.ts       # JWT verification (authenticate) + admin check (authorizeAdmin)
│
├── routes/
│   ├── authRoute.ts            # Auth routes with Swagger docs
│   ├── reviewsRoute.ts         # Reviews routes with Swagger docs
│   ├── productsRoute.ts        # Products routes with Swagger docs (admin-only for CUD)
│   ├── cartRoute.ts            # Cart routes with Swagger docs (all authenticated)
│   ├── ordersRoute.ts          # Orders routes with Swagger docs (updateStatus admin-only)
│   └── commentsRoute.ts        # Comments routes with Swagger docs
│
└── tests/
    ├── auth.test.ts            # Auth tests (register, login, refresh, logout, Google OAuth)
    ├── reviews.test.ts         # Reviews tests (CRUD, paging, like/unlike, auth)
    ├── products.test.ts        # Products tests (CRUD, search, category, gender filter, admin auth)
    ├── cart.test.ts             # Cart tests (add, update quantity, remove, clear, duplicate item, auth)
    ├── orders.test.ts          # Orders tests (create from cart, empty cart, getByUser, status update, admin auth)
    ├── comments.test.ts        # Comments tests (CRUD, getByReview, auth)
    ├── controllers/
    │   └── productsController.search.test.ts  # Smart search controller unit tests (6 tests, mocked)
    └── services/
        └── llmService.test.ts                 # LLM service integration tests (2 tests, real Gemini API)
```

---

## Base Classes (Inheritance Pattern)

```
BaseService (getAll, getById, create, update, delete)
    ├── ReviewsService extends BaseService (adds getWithPaging, getByUserId, getByProductId, toggleLike)
    ├── ProductsService extends BaseService (adds getProductsByCategory, searchProducts, getFilteredProducts)
    ├── CartService extends BaseService (adds getCartByUserId, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart)
    ├── OrdersService extends BaseService (adds createOrder, getOrdersByUserId, updateOrderStatus, generateOrderNumber)
    └── CommentsService extends BaseService (adds getCommentsByReviewId)

BaseController (getAll, getById, create, update, delete - with HTTP status codes)
    ├── ReviewsController extends BaseController (overrides create for userId from token, adds paging, like)
    ├── ProductsController extends BaseController (adds getProductsByCategory, searchProducts, getFilteredProducts)
    └── CommentsController extends BaseController (overrides create for userId from token, adds getByReview)
```

Auth, Cart, and Orders don't use base controller classes - Auth has different logic, Cart and Orders use custom controller functions (not class-based).

---

## Authentication System

### Flow

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

### Middleware

`authMiddleware.ts` provides two middlewares:
- **authenticate**: Extracts JWT from `Authorization: Bearer <token>` header, verifies it, attaches `userId` to request. Used on protected routes.
- **authorizeAdmin**: Checks that the authenticated user has `role: "admin"` in DB. Used on product management routes (create/update/delete) and order status updates. Returns 403 if not admin.

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
| type | string | Required (e.g., Jeans, Dresses, Sunglasses) |
| description | string | Required (for AI search) |
| price | number | Required |
| salePrice | number | Optional discount price |
| category | string | Required, enum: "men", "women", "accessories" |
| sizes | string[] | Available sizes |
| colors | string[] | Available colors |
| images | string[] | Product image paths (served from /public/images/products/) |
| stock | number | Required, default: 0 |
| tags | string[] | For search (e.g., cotton, casual, summer) |
| features | string[] | Product features (e.g., "100% cotton", "Slim fit") |
| createdAt/updatedAt | Date | Auto (timestamps) |

### Review
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who posted it |
| productId | ObjectId (ref: products) | Which product is reviewed |
| title | string | Review title |
| content | string | Review text |
| rating | number | 1-5 stars |
| images | string[] | Array of image paths |
| likes | ObjectId[] | Array of user IDs who liked |
| createdAt/updatedAt | Date | Auto (timestamps) |

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

### Order
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who placed the order |
| orderNumber | string | Unique, format: ORD-YYYY-NNN |
| items | Array | Ordered items (copied from cart) |
| totalPrice | number | Sum of (price x quantity) + shipping + tax |
| shipping | number | Shipping cost, default: 0 |
| tax | number | Tax amount, default: 0 |
| status | string | Enum: pending, processing, shipped, delivered, cancelled |
| shippingAddress | object | street, city, zipCode, country |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who wrote the comment |
| reviewId | ObjectId (ref: reviews) | Which review it belongs to |
| content | string | Comment text |

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
    | 3. Generate orderNumber      |
    |    (ORD-2026-001)            |
    | 4. Create order              |
    | 5. Clear cart                |
    v
[Order Created] --status: "pending"--> [Admin updates status]
    pending → processing → shipped → delivered
                                    → cancelled
```

**Price Logic**: The `price` stored in cart/order items is the final price the customer pays. If a product has a `salePrice`, the client sends `salePrice` as the `price`. If not, it sends the regular `price`.

### Guest Cart Merge Flow

When a guest user logs in, their localStorage cart is merged with their server cart:

```
[Guest browses] --adds items--> [localStorage cart]
    |
    v
[User logs in] --POST /cart/merge--> [Cart Service: mergeCart(userId, guestItems)]
    |
    | For each guest item:
    |   - If same productId+size+color exists → add quantities
    |   - If not → add as new item
    |
    v
[Merged cart in DB] --GET /cart--> [Client fetches merged cart]
    |
    v
[Clear localStorage cart]
```

---

## LLM Smart Search

### Architecture

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

- **LLMService** (`services/LLM/llmService.ts`): Gemini API client using `@google/generative-ai` SDK. Uses `gemini-2.5-flash` model with `temperature: 0.1` for consistent results, `responseMimeType: "application/json"`, `maxOutputTokens: 500`. Uses **lazy initialization** (`getModel()`) to avoid reading `process.env.GEMINI_API_KEY` before `dotenv.config()` runs (see troubleshooting #14).
- **SearchService** (`services/LLM/searchService.ts`): Builds a prompt that instructs the LLM to extract filters. Parses the JSON response and builds a MongoDB filter object.
- **SearchController** (`controllers/searchController.ts`): Handles `GET /products/smart-search?q=` endpoint.

### Search Filter Extraction

The LLM extracts these optional fields from natural language:
| Filter | MongoDB Field | Example Query |
|--------|--------------|---------------|
| category | category | "women's shoes" → `{category: "women"}` |
| type | type (regex) | "show me jeans" → `{type: {$regex: "jeans", $options: "i"}}` |
| color | colors (regex) | "blue jacket" → `{colors: {$regex: "blue", $options: "i"}}` |
| size | sizes | "XL shirts" → `{sizes: "XL"}` |
| minPrice/maxPrice | price ($gte/$lte) | "under 200" → `{price: {$lte: 200}}` |
| tags | tags ($in, regex) | "casual cotton" → `{tags: {$in: [/casual/i, /cotton/i]}}` |
| query | name/description ($or, regex) | "bomber" → `{$or: [{name: /bomber/i}, ...]}` |

### Fallback

If the LLM response fails to parse as JSON, the service falls back to regular regex-based `productsService.searchProducts(userQuery)`.

### Gemini API

- **SDK**: `@google/generative-ai`
- **Model**: `gemini-2.5-flash`
- **API Key**: Configured via `GEMINI_API_KEY` env variable
- **Get API Key**: https://aistudio.google.com/apikey

---

## Seed Data

The `server/src/seed.ts` script populates the database with sample data:

```bash
cd server
npx ts-node src/seed.ts
```

- **54 Products** (18 per category):
  - **Accessories (18)**: Sunglasses, bags, shoes, jewelry, scarves, wallets, hats, boots
  - **Men (18)**: Jackets, polo shirts, jeans, t-shirts, hoodies, sweaters, pants
  - **Women (18)**: Dresses, sets, blouses, skirts, pants, jeans, coats
- **5 Dummy Users** (hashed passwords with bcrypt)
- **Reviews** on ~15-20 products (2-5 reviews each, random ratings weighted 3-5)
- **Comments** on ~30% of reviews (1-3 comments each)

Product images are stored in `server/public/images/products/{Accessories,Men,Women}/` and served via the `/public` static route.

**Warning**: Running the seed script will **delete all existing products, users, reviews, and comments** before inserting the seed data.

---

## Environment Files

- `.env.dev` - Development (local MongoDB, port 3000)
- `.env.test` - Tests (separate test DB)
- `.env.prod` - Production

Required variables: `DATABASE_URL`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`, `GOOGLE_CLIENT_ID`, `GEMINI_API_KEY`
