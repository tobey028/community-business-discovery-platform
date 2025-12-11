# Backend - Community Business Discovery Platform

Node.js + Express REST API with JWT authentication, MongoDB, and file uploads.

## ✅ Completed Setup

- ✅ Node.js + Express server
- ✅ MongoDB models (User, Business, Favorite)
- ✅ JWT authentication with bcrypt
- ✅ File upload with Multer
- ✅ Complete CRUD operations
- ✅ Search & filtering system
- ✅ Role-based access control
- ✅ Error handling middleware

## 🚀 Getting Started

### 1. Setup MongoDB Atlas Database

**Follow the detailed guide:** [`MONGODB_ATLAS_SETUP.md`](./MONGODB_ATLAS_SETUP.md)

Quick steps:
1. Create free MongoDB Atlas account
2. Create a cluster
3. Create database user
4. Whitelist your IP
5. Get connection string
6. Update `.env` file

### 2. Configure Environment Variables

The `.env` file has been created. **You need to update it with your MongoDB Atlas URI:**

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/community-business-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=8000
NODE_ENV=development
MAX_FILE_SIZE=5242880
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-xxx.mongodb.net
🚀 Server running in development mode on port 8000
```

## 📚 API Documentation

Full API documentation: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

**Base URL:** `http://localhost:8000/api`

### Quick API Overview

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

#### Businesses
- `GET /businesses` - Get all businesses (with filters)
- `GET /businesses/:id` - Get single business
- `POST /businesses` - Create business (owner only)
- `PUT /businesses/:id` - Update business (owner only)
- `DELETE /businesses/:id` - Delete business (owner only)
- `GET /businesses/my/profile` - Get my business (owner only)

#### Favorites
- `GET /favorites` - Get my favorites (user only)
- `POST /favorites/:businessId` - Add favorite (user only)
- `DELETE /favorites/:businessId` - Remove favorite (user only)
- `GET /favorites/check/:businessId` - Check if favorited (user only)

## 🧪 Testing the API

### Option 1: REST Client (VS Code Extension)

1. Install "REST Client" extension in VS Code
2. Open `requests.http` file
3. Click "Send Request" above any endpoint

### Option 2: Postman

1. Download [Postman](https://www.postman.com/)
2. Import the API documentation
3. Test endpoints manually

### Option 3: cURL

```bash
# Health check
curl http://localhost:8000/

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"user"}'

# Get all businesses
curl http://localhost:8000/api/businesses
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── businessController.js # Business CRUD
│   │   └── favoriteController.js # Favorites logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & role check
│   │   ├── upload.js            # Multer file upload config
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Business.js          # Business schema
│   │   └── Favorite.js          # Favorite schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── businessRoutes.js    # Business endpoints
│   │   └── favoriteRoutes.js    # Favorite endpoints
│   ├── utils/
│   │   └── generateToken.js     # JWT token generator
│   └── server.js                # Main server file
├── uploads/
│   └── logos/                   # Business logo uploads
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── .gitignore
├── package.json
├── API_DOCUMENTATION.md         # Full API docs
├── MONGODB_ATLAS_SETUP.md       # Database setup guide
└── requests.http                # REST Client test file
```

## 🔐 User Roles

### Regular User (`user`)
- Search and view businesses
- Add/remove favorites
- View favorite list
- Cannot create businesses

### Business Owner (`business_owner`)
- Create ONE business profile
- Update own business
- Delete own business
- Upload business logo
- Cannot use favorites

## 🎯 Key Features

### Authentication
- JWT-based authentication (30-day expiration)
- Password hashing with bcrypt
- Role-based access control
- Protected routes

### Business Management
- Create/Read/Update/Delete operations
- File upload for logos (images only, 5MB max)
- Owner verification for modifications
- View counter for analytics

### Search & Discovery
- Filter by category
- Filter by city/location
- Keyword search (name, description, services)
- Sort by newest or popularity
- Pagination support

### Favorites System
- Add businesses to favorites
- Remove from favorites
- View all favorites
- Check favorite status
- Prevent duplicate favorites

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## ⚠️ Important Notes

1. **Port Changed:** Using port `8000` instead of `5000` (macOS compatibility)
2. **MongoDB:** Must setup MongoDB Atlas before running
3. **File Uploads:** Only images allowed (jpeg, jpg, png, gif)
4. **Business Limit:** Each business owner can create only ONE business
5. **Authentication:** Most endpoints require JWT token

## 🐛 Troubleshooting

### "MongoDB connection failed"
→ Check `MONGODB_ATLAS_SETUP.md` for detailed setup steps

### "Port already in use"
→ Change `PORT` in `.env` file

### "File upload failed"
→ Ensure `uploads/logos` directory exists
→ Check file size (max 5MB)
→ Only image files allowed

### "Token invalid"
→ Check Authorization header format: `Bearer <token>`
→ Token expires after 30 days

## 📝 Next Steps

After backend is working:

1. ✅ Test all API endpoints using `requests.http`
2. ✅ Verify MongoDB collections are created
3. ➡️ Initialize frontend React application
4. ➡️ Connect frontend to backend APIs
5. ➡️ Build UI components and pages
6. ➡️ Deploy to production

---

**Need help?** Check the documentation files or test with the provided `requests.http` file!
