# Backend - Nexzio API

REST API for the business discovery platform. Handles authentication, business profiles, and favorites.

---

## Setup

```bash
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexzio
JWT_SECRET=put_any_random_string_here
PORT=8000
NODE_ENV=development
MAX_FILE_SIZE=5242880
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
npm run dev
```

You should see:
```
MongoDB Connected
Server running on port 8000
```

---

## MongoDB Setup

You need a MongoDB database. Free tier from MongoDB Atlas works fine.

1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (takes a few minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your database credentials
7. Paste into `.env` as `MONGODB_URI`

If you get connection errors, check:
- Username and password are correct
- Your IP address is whitelisted (or use `0.0.0.0/0` for testing)
- Network security settings in Atlas

---

## Cloudinary Setup

Business logos are stored on Cloudinary instead of local files. Get a free account:

1. Go to cloudinary.com and sign up
2. After login, find your dashboard
3. Copy these values:
   - Cloud Name
   - API Key
   - API Secret
4. Add them to your `.env` file

Images will be stored in the cloud, so they won't disappear when you restart the server or deploy.

---

## What's Running

Server has these endpoints:

**Auth:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get logged in user info

**Businesses:**
- `GET /api/businesses` - List all businesses (with filters)
- `GET /api/businesses/:id` - Get one business
- `POST /api/businesses` - Create business (owner only)
- `PUT /api/businesses/:id` - Update business (owner only)
- `DELETE /api/businesses/:id` - Delete business (owner only)
- `GET /api/businesses/my/profile` - Get my business (owner only)

**Favorites:**
- `GET /api/favorites` - My saved businesses
- `POST /api/favorites/:businessId` - Add to favorites
- `DELETE /api/favorites/:businessId` - Remove from favorites
- `GET /api/favorites/check/:businessId` - Check if favorited

---

## Testing

Use the `requests.http` file with REST Client extension in VS Code, or use curl:

```bash
# Check if server is running
curl http://localhost:8000/

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123!","role":"user"}'

# Get businesses
curl http://localhost:8000/api/businesses
```

---

## Project Structure

```
src/
├── config/
│   └── database.js           MongoDB connection
├── controllers/
│   ├── authController.js     Auth logic (register, login)
│   ├── businessController.js Business CRUD operations
│   └── favoriteController.js Favorites logic
├── middleware/
│   ├── auth.js               JWT verification, role check
│   ├── upload.js             File upload config (Multer)
│   └── errorHandler.js       Error handling
├── models/
│   ├── User.js               User schema
│   ├── Business.js           Business schema
│   └── Favorite.js           Favorite schema
├── routes/
│   ├── authRoutes.js         Auth endpoints
│   ├── businessRoutes.js     Business endpoints
│   └── favoriteRoutes.js     Favorite endpoints
├── utils/
│   └── generateToken.js      JWT token generator
└── server.js                 Main server file

uploads/logos/                Business logo files
```

---

## How Authentication Works

1. User registers or logs in
2. Backend creates JWT token (lasts 30 days)
3. Frontend stores token in localStorage
4. Every API request includes token in Authorization header
5. Middleware checks token and loads user data
6. Protected endpoints only allow specific roles

---

## User Roles

**Regular User** (`user`):
- Browse and search businesses
- Save favorites
- Cannot create businesses

**Business Owner** (`business_owner`):
- Create one business profile
- Edit/delete their business
- Upload business logo
- Cannot use favorites

---

## Features

**Authentication:**
- Password hashing with bcrypt (8 chars min, uppercase, number, special char)
- JWT tokens (30-day expiry)
- Role-based access

**Business Management:**
- CRUD operations
- Image upload to Cloudinary (max 5MB, jpg/png/gif only)
- Owner can only modify their own business
- View counter

**Search & Filters:**
- By category
- By city/location
- Keyword search
- Sort by date or views

**Favorites:**
- Users can save businesses
- Check if business is favorited
- No duplicates allowed

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- bcrypt for passwords
- Multer + Cloudinary for image storage
- CORS enabled

---

## Common Issues

**MongoDB won't connect:**
- Check username/password in connection string
- Make sure IP is whitelisted in Atlas
- Try `0.0.0.0/0` for all IPs (testing only)

**Port 8000 already in use:**
- Change PORT in `.env`
- Or kill the process: `lsof -ti:8000 | xargs kill`

**Image upload fails:**
- Check file size (max 5MB)
- Only images allowed (jpg, png, gif)
- Verify Cloudinary credentials in `.env`
- Check your Cloudinary account quota

**Token errors:**
- Token format must be: `Bearer <token>`
- Tokens expire after 30 days
- Check if JWT_SECRET matches between sessions

---

## Additional Files

- `API_DOCUMENTATION.md` - Full API reference with examples
- `MONGODB_ATLAS_SETUP.md` - Step-by-step database setup
- `requests.http` - Test endpoints with REST Client extension
