# 🚀 Quick Setup Guide

The application works immediately with fallback data! Database setup is optional.

## 1. Database Setup (OPTIONAL)

For persistent storage, you can optionally set up the database tables in Supabase:

### Steps:
1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select the project**: `khmamctencrsmujhblmz`
3. **Open SQL Editor**: Click "SQL Editor" in the left sidebar
4. **Run the setup script**:
   - Open `task-3-fullstack-app/backend/init-db.sql`
   - Copy the entire file content
   - Paste into Supabase SQL Editor
   - Click "Run"

### ✅ Expected Result:
```
Projects table created | project_count: 4
Properties table created | property_count: 5
```

## 2. Start Backend

```bash
cd task-3-fullstack-app/backend
npm install
npm start
```

Expected output:
```
Starting database initialization...
Database not available, using fallback data
Server running on port 3001
```
(Database errors are normal and expected if tables aren't set up - the app uses fallback data)

## 3. Start Frontend

In a new terminal:
```bash
cd task-3-fullstack-app/frontend
npm install
npm start
```

Frontend will open at: http://localhost:3000

## 4. Test the Application

1. **Fill out the form** with property details
2. **Watch the live preview** update as you type
3. **Submit** to create a new property
4. **View existing properties** in the list below

## 🔧 Troubleshooting

### "relation does not exist" errors:
- **Cause**: Database tables not created (this is normal!)
- **Solution**: The app automatically uses fallback data - no action needed. Or optionally set up database (Step 1)

### "Failed to load projects":
- **Cause**: API key or database connection issue
- **Solution**: Check console for specific error

### Frontend compilation errors:
- **Solution**: `npm install` and restart dev server

## 📊 Sample Data Included

**Projects:**
- Downtown Towers
- Marina Residences  
- Garden View Apartments
- Skyline Complex

**Properties:**
- 5 sample properties with realistic data
- Various price ranges and sizes
- Future handover dates

## 🎯 Key Features to Test

✅ **Form Validation**: Try submitting invalid data  
✅ **Live Preview**: Watch updates as you type  
✅ **Date Formatting**: Proper "27 April 2025" format  
✅ **Property Creation**: Submit new properties  
✅ **Property List**: View existing properties  
✅ **Responsive Design**: Test on mobile  

## 📝 API Endpoints

- `GET /api/projects` - List projects
- `POST /api/properties` - Create property  
- `GET /api/properties` - List all properties
- `GET /api/health` - Health check

All require header: `X-API-Key: your-secret-api-key-here`