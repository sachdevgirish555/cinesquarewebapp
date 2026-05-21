# CineSquareApp

CineSquareApp is a full-stack cinema website and admin dashboard built with React, Vite, Express, and MongoDB.

The project includes a public-facing website plus admin management for blogs, cinemas, cinema galleries, movies, sliders, videos, users, and enquiries.

## Tech Stack

- Frontend: React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express 5, MongoDB, Mongoose, JWT, Multer, Nodemailer

## Project Structure

```text
CineSquareApp/
|- frontend/   # React + Vite client
|- backend/    # Express + MongoDB API
```

## Main Features

- Public website pages for home, about, contact, gallery, blogs, movies, cinema listings, franchise, career, investors, and legal pages
- Admin dashboard for managing blog posts, cinemas, gallery images, movies, videos, sliders, users, and enquiries
- JWT-based login flow for admin/user access
- File upload support for media assets
- Enquiry form with email notifications
- Dashboard stats endpoint

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/cinesquare
JWT_SECRET=change-me
ADMIN_SECRET=change-me
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Start backend

```bash
cd backend
npm run dev
```

Backend runs by default at `http://localhost:5000`.

### 3. Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs by default on the Vite development port shown in the terminal.

## Available Scripts

### Backend

- `npm run dev` - start backend with nodemon
- `npm start` - start backend with nodemon
- `npm run build` - run the backend with Node

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build frontend for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Summary

The backend exposes routes under:

- `/api/blogs`
- `/api/users`
- `/api/cinemas`
- `/api/cinema-galleries`
- `/api/movies`
- `/api/enquiry`
- `/api/slider`
- `/api/videos`
- `/api/dashboard`

Health check:

- `/health`

Uploaded files are served from:

- `/uploads`

## Notes

- The repository currently does not include automated tests.
- Keep real `.env` files out of Git. Only commit example env files.
- If you want cleaner production deploys, uploaded runtime files should usually be stored outside the repo or in cloud storage.
