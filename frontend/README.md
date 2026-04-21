# Social Assistance Information System - React Frontend

A modern React.js frontend for the Social Assistance Information System (SIA) built with Vite, Tailwind CSS, and Axios.

## Features

- **Dashboard** - Overview of system statistics and quick information
- **Residents Management** - Create, read, update, and delete resident records
- **Programs Management** - Manage social assistance programs with budget tracking
- **Incidents Reporting** - Document and track incidents with status management
- **Certificates** - Issue and manage official certificates with tracking
- **Enrollments** - Manage resident enrollments in programs

## Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Lucide React** - Icon library

## Project Structure

```
sia-frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Modal.jsx            # Reusable modal component
│   │   ├── Alert.jsx            # Alert notifications
│   │   ├── Loading.jsx          # Loading spinner
│   │   ├── FormFields.jsx       # Form input components
│   │   └── Table.jsx            # Reusable table component
│   ├── pages/
│   │   ├── Dashboard.jsx        # Dashboard page
│   │   ├── Residents.jsx        # Residents management
│   │   ├── Programs.jsx         # Programs management
│   │   ├── Incidents.jsx        # Incidents reporting
│   │   ├── Certificates.jsx     # Certificates management
│   │   └── Enrollments.jsx      # Enrollments management
│   ├── services/
│   │   └── api.js               # API client configuration
│   ├── styles/
│   │   └── index.css            # Global styles
│   ├── App.jsx                  # Main App component
│   └── main.jsx                 # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Laravel backend running on `http://localhost:8000`

### Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd sia-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   - Edit `src/services/api.js` if your Laravel backend runs on a different URL
   - Default: `http://localhost:8000`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend communicates with the Laravel backend through RESTful API endpoints:

- `GET/POST /residents` - Residents CRUD
- `GET/POST /programs` - Programs CRUD
- `GET/POST /incidents` - Incidents CRUD
- `GET/POST /certificates` - Certificates CRUD
- `GET/POST /enrollments` - Enrollments CRUD
- `POST /programs/{id}/enroll` - Enroll resident in program

## Components Overview

### Layout Components
- **Layout** - Main wrapper with sidebar and outlet
- **Header** - Top bar with system title and user info
- **Sidebar** - Navigation menu with active state

### UI Components
- **Modal** - Reusable modal for forms (3 sizes: sm, md, lg)
- **Alert** - Alert notifications (success, error, warning, info)
- **Loading** - Loading spinner with message
- **Table** - Reusable data table with edit/delete actions
- **FormFields** - Form input, select, and textarea components

### Pages
- **Dashboard** - Statistics dashboard with quick overview
- **Residents** - Full CRUD for resident management
- **Programs** - Manage social assistance programs
- **Incidents** - Report and track incidents
- **Certificates** - Issue and manage certificates
- **Enrollments** - Manage program enrollments

## Form Validation

Form validation is handled by the backend and errors are displayed in alerts. Frontend includes:
- Required field validation
- Date field validation
- Number field validation for budget amounts
- Custom error messages from backend

## Styling

The application uses Tailwind CSS with custom utility classes defined in `src/styles/index.css`:

- `.btn` - Button base styles
- `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success` - Button variants
- `.card` - Card container
- `.form-*` - Form field styles
- `.table` - Table styles
- `.badge` - Badge styles
- `.alert` - Alert styles

## Features in Detail

### Dashboard
- Live statistics for residents, programs, incidents, and certificates
- Quick system overview and features summary

### Residents Management
- Add, edit, and delete resident records
- Track resident verification status
- Store personal information (name, birth date, address)

### Programs Management
- Create social assistance programs
- Manage program budget allocation
- Track programs (Senior Citizen Pension, TUPAD, Rice Distribution, Financial Aid)

### Incidents Reporting
- File incident reports for residents
- Track incident status (Pending, Under Investigation, Resolved)
- Support multiple incident types (Theft, Physical Altercation, Noise Complaint, Other)

### Certificates
- Issue official certificates to residents
- Support multiple certificate types (Barangay Clearance, Residency, etc.)
- Track certificate status and issuance dates

### Enrollments
- Manage resident enrollments in programs
- Track enrollment status and remarks
- Link residents to multiple programs

## Error Handling

- API errors are caught and displayed as alert notifications
- Network errors show appropriate error messages
- Form submission errors display backend validation messages
- 404 and 500 errors are handled gracefully

## Mobile Responsive

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (Below 768px)

Sidebar converts to mobile menu on smaller screens.

## Future Enhancements

- User authentication and authorization
- Search and filter functionality
- Data export (PDF, Excel)
- Advanced reporting features
- Real-time notifications
- File upload for documents
- Pagination for large datasets

## Troubleshooting

### Backend connection issues
- Ensure Laravel backend is running on `http://localhost:8000`
- Check CORS configuration in Laravel
- Verify API routes are correct

### Port conflicts
- If port 5173 is in use, Vite will automatically use the next available port
- You can specify a port: `npm run dev -- --port 3000`

### Module not found errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if issues persist: `rm -rf node_modules && npm install`

## Development

For development, the Vite dev server includes:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Source maps for debugging

## Production Build

Build for production:
```bash
npm run build
```

This creates an optimized `dist` directory ready for deployment.

## License

This project is part of the Social Assistance Information System (SIA).

## Support

For issues or questions, please contact the development team or refer to the Laravel backend documentation.
