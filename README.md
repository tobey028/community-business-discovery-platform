# Nexzio

A platform for discovering local businesses in your area. Users can browse businesses, save favorites, and business owners can create their profiles to get discovered by potential customers.

**Stack:** React frontend + Node.js backend + MongoDB

---

## What does this do?

Two types of users:

**Regular Users** - Browse businesses by category (restaurants, retail, services, etc.), save favorites, search by location

**Business Owners** - Create one business profile with photos, contact info, location, services offered

---

## Getting Started

You need to run both backend and frontend.

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string
PORT=8000
```

Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:8000`

More details: [backend/README.md](./backend/README.md)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

More details: [frontend/README.md](./frontend/README.md)

---

## Project Structure

```
├── backend/          Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── uploads/      Business logo uploads
│
├── frontend/         React + Vite
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── api/
    └── public/
```

---

## Main Features

- User registration and login with JWT authentication
- Browse businesses with category and location filters
- Search functionality
- Business profiles with images, contact info, hours
- Favorites system for users
- Business dashboard for owners
- Mobile responsive design

---

## Tech Used

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Lucide Icons

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, bcrypt

---

## Notes

- Backend uses port 8000 (not 5000 - conflicts with macOS)
- You need a MongoDB Atlas account (free tier works fine)
- Business owners can only create one business per account
- File uploads limited to 5MB
- JWT tokens expire after 30 days

---

Check the README files in `/backend` and `/frontend` for more specific setup instructions.
