# Task 3: Full-Stack Property Management Application

A complete property management tool built with React (TypeScript) frontend and Node.js/Express backend, integrated with Supabase for data persistence.

## Features

### Backend API
- **POST /api/properties**: Create new property listings
- **GET /api/projects**: Retrieve available projects
- **GET /api/properties**: List all properties (optional)
- **GET /api/health**: Health check endpoint

### Frontend Application
- **Clean Material-UI Design**: Professional, responsive interface
- **Real-time Form Validation**: Comprehensive validation with user-friendly error messages
- **Live Preview**: Dynamic property listing preview that updates as you type
- **Date Formatting**: Handover dates displayed in "27 April 2025" format
- **Property List**: Display existing properties with auto-refresh after creating new ones
- **Dummy Data**: Pre-populated with sample properties for testing
- **API Security**: Protected endpoints with API key authentication
- **Error Handling**: Graceful error handling with user feedback
- **Responsive Design**: Works on desktop and mobile devices

### Security Features
- API key authentication for all endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Environment variable configuration

## Technology Stack

### Backend
- **Node.js** with Express.js
- **Supabase** for database (PostgreSQL)
- **Joi** for data validation
- **CORS** and **Helmet** for security

### Frontend
- **React** with TypeScript
- **Material-UI (MUI)** for components
- **Axios** for API communication
- **Day.js** for date handling
- **MUI Date Pickers** for date selection

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (provided credentials)

### Backend Setup

1. Navigate to backend directory:
```bash
cd task-3-fullstack-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`:
   - Supabase URL and API key
   - API secret key for authentication
   - Port configuration

4. Initialize database (run SQL commands in Supabase SQL editor):
```sql
-- Copy contents from init-db.sql and run in Supabase
```

5. Start the backend server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd task-3-fullstack-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are configured in `.env`:
   - API URL pointing to backend
   - API key for authentication

4. Start the frontend application:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

**📋 OPTIONAL**: The application works with fallback data even without database setup!

The application includes **fallback data** and will work immediately without database setup. For full functionality with persistent storage, you can optionally set up the database:

### Optional: Full Database Setup
1. **Access Supabase SQL Editor**: https://supabase.com/dashboard → project (khmamctencrsmujhblmz) → SQL Editor
2. **Run Setup Script**: Copy contents of `backend/init-db.sql` and run in SQL Editor
3. **Verify**: You should see "Projects table created" and "Properties table created"

### Fallback Mode (Default)
When database tables don't exist, the application automatically uses:
- **4 sample projects**: Downtown Towers, Marina Residences, etc.
- **3 sample properties**: Luxury villa, city apartment, penthouse
- **Full functionality**: Create properties (stored in memory for demo)

The application uses these Supabase credentials:
- **URL**: https://khmamctencrsmujhblmz.supabase.co
- **Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## API Usage

### Authentication
All API endpoints require an API key in the header:
```
X-API-Key: your-secret-api-key-here
```

### Create Property
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key-here" \
  -d '{
    "title": "Luxury Beachfront Villa",
    "size": 2500,
    "price": 750000,
    "handoverDate": "2025-06-15",
    "projectId": "proj_1"
  }'
```

### Get Projects
```bash
curl -X GET http://localhost:3001/api/projects \
  -H "X-API-Key: your-secret-api-key-here"
```

## Database Schema

### Projects Table
- `id` (VARCHAR): Primary key
- `name` (VARCHAR): Project name
- `created_at` (TIMESTAMP): Creation timestamp

### Properties Table
- `id` (SERIAL): Primary key
- `title` (VARCHAR): Property title
- `size` (DECIMAL): Property size in sq. ft.
- `price` (DECIMAL): Property price
- `handover_date` (DATE): Handover date
- `project_id` (VARCHAR): Foreign key to projects
- `created_at` (TIMESTAMP): Creation timestamp

## Validation Rules

### Property Form Validation
- **Title**: Required, minimum 3 characters
- **Size**: Required, must be positive number
- **Price**: Required, must be positive number
- **Project**: Required selection from available projects
- **Handover Date**: Required, must be in the future

### API Validation
- Backend validates all inputs using Joi schema
- Comprehensive error messages for validation failures
- Project ID validation against existing projects

## Project Structure

```
task-3-fullstack-app/
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables
│   └── init-db.sql        # Database initialization
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── types.ts       # TypeScript definitions
│   │   └── App.tsx        # Main app component
│   ├── package.json       # Frontend dependencies
│   └── .env              # Frontend environment
└── README.md             # This file
```

## Features Implemented

✅ **Backend API**: REST endpoints with proper validation  
✅ **Frontend Form**: Complete property creation form  
✅ **Live Preview**: Real-time property listing preview  
✅ **Form Validation**: Client-side and server-side validation  
✅ **Date Formatting**: Proper date display format  
✅ **API Security**: Authentication and CORS protection  
✅ **Error Handling**: Comprehensive error management  
✅ **Responsive Design**: Mobile-friendly interface  
✅ **Database Integration**: Supabase PostgreSQL integration  

## Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Fill out the property form:
   - Enter a property title
   - Select a project from the dropdown
   - Enter size and price
   - Select a future handover date
4. Watch the live preview update as you type
5. Submit the form to create the property
6. Check the database for the created property

## Production Considerations

- Environment-specific configuration
- Database connection pooling
- Rate limiting implementation
- Enhanced security measures
- Monitoring and logging
- Error tracking and reporting
- Automated testing suite