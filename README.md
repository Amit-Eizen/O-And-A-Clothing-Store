# O&A Clothing Store

Full-stack e-commerce clothing store application.

## Project Structure

```
O-And-A-Clothing-Store/
├── server/          # Backend (Node.js, Express, MongoDB)
└── client/          # Frontend (coming soon)
```

---

## Server

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm

### Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.dev` file (copy from `.env.example`):
```bash
cp .env.example .env.dev
```

4. Edit `.env.dev` with your values:
```
DATABASE_URL=mongodb://localhost:27017/clothing-store
PORT=3000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_SECRET=your_refresh_secret_key_here
REFRESH_TOKEN_EXPIRES_IN=86400
```

### Running

**Development (with nodemon):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Tests:**
```bash
npm test              # Run all tests
npm run testAuth      # Run auth tests only
```

### Project Structure

```
server/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Middleware (auth, etc.)
│   └── tests/          # Tests
├── .env.dev            # Development environment (not in Git)
├── .env.test           # Test environment (not in Git)
├── .env.example        # Example environment file
└── package.json
```

### API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user (returns tokens) |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |
| POST | `/refresh-token` | Refresh access token |
| POST | `/google` | Login with Google OAuth |

#### Products (coming soon)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

#### Cart (coming soon)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user cart |
| POST | `/cart` | Add to cart |
| PUT | `/cart/:itemId` | Update quantity |
| DELETE | `/cart/:itemId` | Remove from cart |

#### Orders (coming soon)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get user orders |
| POST | `/orders` | Create order |
| GET | `/orders/:id` | Get single order |

#### Comments (coming soon)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/:productId` | Get product comments |
| POST | `/comments` | Add comment |
| PUT | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |

### API Documentation (Swagger)

After running the server, go to:
```
http://localhost:3000/api-docs
```

### Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Token theft detection (clears all tokens on suspicious activity)
- Support for multiple device sessions
