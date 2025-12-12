# Frontend - Nexzio

React app for browsing local businesses and managing business profiles.

---

## Quick Start

```bash
npm install
npm run dev
```

App will open at `http://localhost:5173`

Make sure the backend is running on `http://localhost:8000` first.

---

## What's Inside

### Pages

**Public Pages:**
- Home - Landing page with hero, categories, featured businesses
- Login/Register - Authentication pages
- Search Results - Browse all businesses with filters
- Business Details - Full business profile page

**User Pages (logged in):**
- Favorites - Saved businesses
- Profile Settings - Update account info, change password

**Business Owner Pages:**
- Dashboard - Manage your business profile
- Create/Edit Business - Business profile editor

### Main Components

- `Navbar` - Navigation with mobile menu
- `BusinessCard` - Business preview card
- `CategoryCard` - Category selection card
- `ProtectedRoute` - Route wrapper for auth

---

## Tech Stack

- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

---

## File Structure

```
src/
├── api/
│   └── axios.js              API config
├── components/
│   ├── Navbar.jsx
│   ├── BusinessCard.jsx
│   ├── CategoryCard.jsx
│   └── ProtectedRoute.jsx
├── hooks/
│   └── useAuth.js            Auth context & hook
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── SearchResults.jsx
│   ├── BusinessDetails.jsx
│   ├── Favorites.jsx
│   ├── Profile.jsx
│   └── Dashboard.jsx
├── App.jsx                   Main app with routes
└── main.jsx                  Entry point
```

---

## Environment Setup

Create `.env` file in frontend root:

```
VITE_API_URL=http://localhost:8000/api
```

This tells the frontend where the backend API is running.

---

## Design System

**Colors:**
- Primary: `#4C82F7` (blue)
- Success: Green shades
- Categories: Red, purple, blue, orange, pink, indigo

**Style Patterns:**
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Glass effects: `bg-white/80 backdrop-blur-xl`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Hover effects on cards and buttons

---

## User Roles

**Regular User:**
- Can browse all businesses
- Can save/unsave favorites
- Cannot create business profiles

**Business Owner:**
- Can create ONE business profile
- Can edit/delete their business
- Cannot use favorites feature

---

## API Integration

All API calls go through `src/api/axios.js` which:
- Sets base URL from env
- Automatically adds JWT token to requests
- Handles 401 errors (logout on auth failure)

Example usage:
```javascript
import api from '../api/axios';

const response = await api.get('/businesses');
const businesses = response.data;
```

---

## Authentication Flow

1. User logs in → Backend returns JWT token
2. Token saved to localStorage
3. AuthContext provides user data to all components
4. Protected routes check if user logged in
5. API requests include token automatically

---

## Building for Production

```bash
npm run build
```

Creates optimized build in `/dist` folder.

Preview the build:
```bash
npm run preview
```

---

## Notes

- Backend must be running for app to work
- Images stored on backend in `/uploads/logos`
- JWT tokens expire after 30 days
- Mobile menu shows on screens < 768px
- Password requirements: 8 chars, uppercase, number, special char
