# Social Assistance Information System (SIA)

A complete full-stack application for managing social assistance programs, residents, incidents, and certificates.

## Project Structure

```
sia-final-update/
├── backend/          # Laravel 11 backend API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/         # React + Vite frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
└── README.md
```

## Backend (Laravel)

Located in the `backend/` directory.

### Features
- Resident management with authentication
- Program management
- Incident reporting and tracking
- Certificate management
- Enrollments management
- RESTful API endpoints

### Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API runs on `http://localhost:8000`

## Frontend (React + Vite)

Located in the `frontend/` directory.

### Features
- Dashboard with statistics
- Admin management panels
- Resident authentication and profile
- CRUD operations for all resources
- Responsive Tailwind CSS design

### Setup
```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`

## API Integration

The frontend connects to the backend API at `http://localhost:8000`. Key endpoints:

- `POST /residents/register` - Register new resident
- `POST /residents/login` - Login resident
- `GET /residents` - List all residents
- `POST/PUT/DELETE /residents/{id}` - CRUD operations
- Similar endpoints for programs, incidents, certificates, enrollments

## Database

MySQL database with 8 tables:
- users (default Laravel users)
- residents (with email, phone, password authentication)
- programs
- program_residents (pivot table)
- incidents
- certificates
- cache
- jobs

## Technologies

### Backend
- Laravel 11
- PHP 8.2
- MySQL
- Eloquent ORM

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Lucide React icons

## Running Locally

1. **Backend**: `cd backend && php artisan serve`
2. **Frontend**: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in your browser

## Test Credentials

- **Admin Login**: admin@sia.com / admin123
- **Resident**: Register a new account through the registration page
