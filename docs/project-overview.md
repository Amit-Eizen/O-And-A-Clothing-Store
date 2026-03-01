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
│   │   │   ├── userModel.ts       # User schema (username, email, password, refreshToken[], address, phoneNumber, profileImage)
│   │   │   ├── reviewsModel.ts    # Review schema (userId, title, content, rating, images, likes)
│   │   │   └── commentsModel.ts   # Comment schema (userId, reviewId, content)
│   │   ├── services/
│   │   │   ├── baseService.ts     # Reusable CRUD service (getAll, getById, create, update, delete)
│   │   │   ├── authService.ts     # Auth logic (register, login, logout, refreshToken, googleSignIn)
│   │   │   ├── reviewsService.ts  # Reviews logic (getWithPaging, getByUserId, toggleLike)
│   │   │   └── commentsService.ts # Comments logic (getCommentsByReviewId)
│   │   ├── controllers/
│   │   │   ├── baseController.ts      # Reusable CRUD controller with HTTP status codes
│   │   │   ├── authController.ts      # Auth endpoints handler
│   │   │   ├── reviewsController.ts   # Reviews endpoints (create with userId from token, paging, like)
│   │   │   └── commentsControllers.ts # Comments endpoints (create with userId from token, getByReview)
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT verification middleware (Bearer token)
│   │   ├── routes/
│   │   │   ├── authRoute.ts       # Auth routes with Swagger docs
│   │   │   ├── reviewsRoute.ts    # Reviews routes with Swagger docs
│   │   │   └── commentsRoute.ts   # Comments routes with Swagger docs
│   │   ├── tests/
│   │   │   ├── auth.test.ts       # Auth tests (register, login, refresh, logout, Google OAuth)
│   │   │   ├── reviews.test.ts    # Reviews tests (CRUD, paging, like/unlike, auth)
│   │   │   └── comments.test.ts   # Comments tests (CRUD, getByReview, auth)
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
    └── CommentsService extends BaseService (adds getCommentsByReviewId)

BaseController (getAll, getById, create, update, delete - with HTTP status codes)
    ├── ReviewsController extends BaseController (overrides create for userId from token, adds paging, like)
    └── CommentsController extends BaseController (overrides create for userId from token, adds getByReview)
```

Auth doesn't use base classes because it has completely different logic.

### Environment Files

- `.env.dev` - Development (local MongoDB, port 3000)
- `.env.test` - Tests (separate test DB)
- `.env.prod` - Production

Required variables: `DATABASE_URL`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`, `GOOGLE_CLIENT_ID`

### Middleware

`authMiddleware.ts` extracts JWT from `Authorization: Bearer <token>` header, verifies it, and attaches `userId` to the request. Used on protected routes (not on login/register).

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

### Comment
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId (ref: user) | Who wrote the comment |
| reviewId | ObjectId (ref: reviews) | Which review it belongs to |
| content | string | Comment text |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

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
