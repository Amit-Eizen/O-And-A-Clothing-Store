# O&A Clothing Store

Full-stack e-commerce clothing store with React frontend, Node.js backend, and admin dashboard.

## Features

- **Authentication** — JWT + Google OAuth, token refresh, role-based access
- **Product Catalog** — Categories, filters, pagination, infinite scroll
- **AI-Powered Search** — Natural language product search via Gemini API
- **Reviews & Comments** — Star ratings, likes, threaded comments
- **Shopping Cart** — Guest (localStorage) + logged-in (MongoDB), merge on login
- **Checkout & Orders** — Order creation, order history, status tracking
- **Wishlist** — Add/remove products, persistent per user
- **Admin Dashboard** — Product/order/user management, site settings, media library

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, MUI (Material UI), React Router v7 |
| Backend | Express, TypeScript, MongoDB, Mongoose |
| Auth | JWT, bcrypt, Google OAuth (`google-auth-library`) |
| AI Search | Gemini API (`@google/generative-ai`) |
| Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testing | Jest, Supertest |

## Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Google OAuth Client ID ([Google Cloud Console](https://console.cloud.google.com/) — Authorized JavaScript origins: `http://localhost:5173`)
- Gemini API Key (optional, for AI search — [get one here](https://aistudio.google.com/apikey))

### Setup

```bash
# 1. Server
cd server
npm install
cp .env.example .env.dev      # Configure environment variables (see below)
cp .env.example .env.test     # For tests (use a separate DB name)
npm run seed                   # Populate DB with sample data (⚠️ deletes existing data)
npm run dev                    # Start server on port 3000

# 2. Client (separate terminal)
cd client
npm install
npm run dev                    # Start client on port 5173
```

Both need to run simultaneously.

### Environment Variables

**Server** (`.env.dev`):
```
DATABASE_URL=mongodb://localhost:27017/clothing-store
PORT=3000
JWT_SECRET=your_secret
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=86400
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

**Server** (`.env.test`) — same as above but with a different DB:
```
DATABASE_URL=mongodb://localhost:27017/clothing-store-test
```

**Client** (`.env`):
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Running Tests

```bash
cd server
npm test                # Run all tests
npm run testAuth        # Auth tests only
npm run testProducts    # Products tests only
npm run testCart        # Cart tests only
npm run testOrders      # Orders tests only
npm run testReviews     # Reviews tests only
```

## Admin Dashboard

Access at `/admin` after logging in as admin.

**Seed admin credentials:** `admin@oa-store.com` / `Admin123!`

- **Dashboard** — Stats, revenue, low stock alerts, recent orders
- **Products** — CRUD, NEW tag toggle, image management via media library
- **Orders** — Status filters, status updates
- **Users** — Paginated user list (read-only)
- **Settings** — Banner management, homepage New Arrivals control

## API Documentation

After running the server: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Project Structure

```
O-And-A-Clothing-Store/
├── client/          # React frontend (Vite + TypeScript + MUI)
├── server/          # Node.js backend (Express + TypeScript + MongoDB)
└── docs/            # Documentation
    ├── project-overview.md
    ├── client-architecture.md
    ├── server-architecture.md
    ├── admin-dashboard.md
    └── troubleshooting.md
```

See [docs/](docs/) for detailed architecture documentation.
