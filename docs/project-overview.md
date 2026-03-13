# O&A Clothing Store - Project Overview

## About

E-commerce clothing store with React frontend and Node.js backend. Features authentication (JWT + Google OAuth), product catalog with AI-powered search, product reviews with comments, shopping cart (guest + logged-in with merge on login), and order management.

## Project Structure

```
O-And-A-Clothing-Store/
├── client/                     # React frontend (Vite + TypeScript + MUI)
│   ├── src/
│   │   ├── pages/              # Page components (Auth, Home, Category, Cart, ProductDetail, Reviews, AISearch)
│   │   ├── components/
│   │   │   ├── auth/           # Login/Register forms
│   │   │   ├── home/           # Homepage sections (Hero, Categories, NewArrivals, Testimonial, AIStyleSection, SearchResults)
│   │   │   ├── layout/         # Navbar, Footer, ScrollToTop
│   │   │   ├── products/       # ProductCard, FiltersDialog
│   │   │   ├── product-detail/ # ImageGallery (thumbnails + click-to-enlarge)
│   │   │   └── cart/           # CartItem, OrderSummary, CheckoutDialog, FormField
│   │   ├── context/            # React contexts (CartManager)
│   │   ├── services/           # API client + auth service + cart services
│   │   ├── hooks/              # Custom hooks (useCart, useCheckoutForm, useAISearch, useCategoryFilters, useCategoryProducts)
│   │   ├── assets/             # Images
│   │   ├── theme.ts            # MUI theme configuration
│   │   ├── main.tsx            # Entry point
│   │   └── App.tsx             # Root component with routing
│   ├── .env                    # VITE_GOOGLE_CLIENT_ID
│   └── package.json
│
├── server/                     # Node.js backend (Express + TypeScript + MongoDB)
│   ├── src/
│   │   ├── models/             # Mongoose schemas (User, Product, Review, Cart, Order, Comment)
│   │   ├── services/           # Business logic + LLM search
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth middleware (JWT + admin check)
│   │   ├── routes/             # Express routes with Swagger docs
│   │   ├── tests/              # Jest tests for all features
│   │   ├── app.ts              # Express app setup
│   │   ├── server.ts           # Entry point
│   │   ├── seed.ts             # Database seed script (54 products)
│   │   └── swagger.ts          # OpenAPI config
│   ├── .env.dev / .env.test / .env.prod
│   └── package.json
│
└── docs/                       # Documentation
    ├── project-overview.md     # This file
    ├── client-architecture.md  # Frontend details
    ├── server-architecture.md  # Backend details
    └── troubleshooting.md      # Problems & solutions
```

---

## Tech Stack

### Client
- **React 19** with TypeScript
- **Vite** - Build tool & dev server
- **MUI (Material UI)** - Component library
- **React Router v7** - Client-side routing (SPA)
- **Axios** - HTTP client
- **@react-oauth/google** - Google OAuth

### Server
- **Express** with TypeScript
- **MongoDB** + Mongoose
- **JWT** (jsonwebtoken) - Authentication
- **bcrypt** - Password hashing
- **google-auth-library** - Google OAuth verification
- **@google/generative-ai** - Gemini API for smart search
- **swagger-jsdoc + swagger-ui-express** - API docs
- **Jest + Supertest** - Testing

---

## How to Run

### Server
```bash
cd server
npm install
npx ts-node src/seed.ts   # Populate DB with 54 sample products (run once)
npm run dev                # Development with nodemon
npm run test               # Run tests
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
4. Gemini API key for smart search (optional)
   - Get from https://aistudio.google.com/apikey
   - Add `GEMINI_API_KEY` to server `.env` files

---

## Documentation

- **[Client Architecture](client-architecture.md)** - Frontend components, routing, styling, auth flow
- **[Server Architecture](server-architecture.md)** - Backend models, services, controllers, middleware, LLM search, cart & order flow
- **[Troubleshooting](troubleshooting.md)** - Common problems and their solutions
