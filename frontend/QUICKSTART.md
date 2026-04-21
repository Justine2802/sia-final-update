# Quick Start Guide - SIA Frontend

## Getting Started in 5 Minutes

### 1. Prerequisites Check
Make sure you have:
- Node.js 16+ installed (`node --version`)
- npm or yarn installed (`npm --version`)
- Laravel backend running on http://localhost:8000

### 2. Install Dependencies
```bash
cd sia-frontend
npm install
```
This installs React, Vite, Tailwind CSS, Axios, and all dependencies.

### 3. Start Development Server
```bash
npm run dev
```
The app opens at http://localhost:5173 with hot reload enabled.

### 4. Access the Application
- **URL**: http://localhost:5173
- **Default sections**: Dashboard, Residents, Programs, Incidents, Certificates, Enrollments

## Troubleshooting

### Backend not connecting?
1. Verify Laravel is running: `php artisan serve`
2. Check API URL in `src/services/api.js` (should be `http://localhost:8000`)
3. Ensure Laravel CORS is configured for `http://localhost:5173`

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Dependencies issues?
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Structure Quick Reference

```
src/
├── components/     - Reusable UI components
├── pages/         - Page components for each feature
├── services/      - API client (api.js)
├── styles/        - Global CSS
└── App.jsx        - Main app component
```

## Key Features

- ✅ Dashboard with live statistics
- ✅ Residents CRUD operations
- ✅ Program management with budgets
- ✅ Incident tracking and reporting
- ✅ Certificate issuance and tracking
- ✅ Program enrollment management
- ✅ Responsive mobile design
- ✅ Real-time API integration

## Common Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Next Steps

1. Explore each page by clicking menu items
2. Create test data through the forms
3. Review the API responses in browser DevTools
4. Check Laravel backend for corresponding data

Happy coding! 🚀
