# O&A Clothing Store - Backend

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.dev` file (copy from `.env.example`):
```bash
cp .env.example .env.dev
```

3. Edit `.env.dev` with your values:
```
DATABASE_URL=mongodb://localhost:27017/clothing-store
PORT=3000
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
```

## Running

### Development (with nodemon):
```bash
npm run dev
```

### Production:
```bash
npm start
```

### Tests:
```bash
npm test
```

## Project Structure

```
server/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Middleware (auth, etc.)
│   └── tests/          # Tests
├── .env.dev            # Environment variables (not in Git)
├── .env.example        # Example environment file
└── package.json
```

## API Endpoints

### Auth
- `POST /auth/register` - Register
- `POST /auth/login` - Login

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add to cart
- `PUT /cart/:itemId` - Update quantity
- `DELETE /cart/:itemId` - Remove from cart

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get single order

### Reviews
- `GET /reviews` - Get all reviews (with paging)
- `GET /reviews/:productId` - Get product reviews
- `GET /reviews/user/:userId` - Get user reviews
- `POST /reviews` - Create review (with image)
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `POST /reviews/:id/like` - Like a review

### Comments
- `GET /comments/:reviewId` - Get review comments
- `GET /comments/user/:userId` - Get user comments
- `POST /comments` - Add comment to review
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## API Documentation (Swagger)

After running the server, go to:
```
http://localhost:3000/api-docs
```
