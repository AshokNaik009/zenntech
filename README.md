# Engineering Assessment - ZennTech

This repository contains the completed solutions for the engineering assessment tasks.

## Project Structure

```
zenntech/
├── task-1-strategic-planning/ # Task A: Strategic Planning & Architecture
│   └── STRATEGIC_PLAN.md     # Technical strategy document
├── task-2-refactor/           # Task B: Backend Code Refactoring
│   ├── server.js             # Refactored CSV import endpoint
│   ├── package.json          # Dependencies
│   └── README.md             # Task B documentation
├── task-3-fullstack-app/     # Task C: Full-Stack Application
│   ├── backend/              # Node.js/Express API
│   │   ├── server.js         # API server with Supabase
│   │   ├── package.json      # Backend dependencies
│   │   ├── .env             # Environment variables
│   │   └── init-db.sql      # Database schema
│   ├── frontend/             # React TypeScript App
│   │   ├── src/             # React components and services
│   │   ├── package.json     # Frontend dependencies
│   │   └── .env            # Frontend environment
│   └── README.md            # Task C documentation
├── .gitignore               # Git ignore rules
└── README.md                # This main README
```

## Task A: Strategic Planning & System Architecture

**Location**: `/task-1-strategic-planning`

### Comprehensive Technical Strategy
- **System Architecture**: Microservices with event-driven design
- **Technology Stack**: Node.js/Python, PostgreSQL, ElasticSearch, Kafka
- **Broker Portal**: Scalable CSV processing with job queues
- **AI-Powered Search**: NLP pipeline with GPT-4 integration
- **Real-time Notifications**: Event-driven matching system
- **Implementation Timeline**: 6-month phased rollout plan

### Key Architectural Decisions
- **Scalability**: Independent service scaling based on load
- **Performance**: Database optimization, caching strategies, CDN
- **Reliability**: Fault isolation, circuit breakers, monitoring
- **AI Integration**: Hybrid search combining keyword, vector, and geo-spatial

## Task B: Backend Code Refactoring

**Location**: `/task-2-refactor`

### Problems Identified in Original Code
1. **Performance Issues**: Sequential database inserts using await in a loop
2. **No Error Handling**: Missing try-catch blocks and validation
3. **Security Vulnerabilities**: No file type validation or size limits
4. **Data Integrity**: No input validation before database insertion
5. **Memory Issues**: Loading entire file buffer without streaming
6. **No Logging**: No observability or debugging capabilities

### Improvements Implemented
- **Batch Processing**: Using `insertMany()` for efficient database operations
- **Streaming**: CSV processing with streams for large files
- **Comprehensive Validation**: Joi schema validation with detailed error reporting
- **Security**: File type validation, size limits, and input sanitization
- **Error Handling**: Graceful error handling with informative responses
- **Logging**: Structured logging with Winston for monitoring
- **Performance Metrics**: Processing time tracking and statistics

### Running Task B
```bash
cd task-2-refactor
npm install
npm start
```

## Task C: Full-Stack Property Management Application

**Location**: `/task-3-fullstack-app`

### Features Implemented
- **Backend API**: REST endpoints with Supabase integration
- **Frontend App**: React TypeScript with Material-UI
- **Live Preview**: Real-time property listing preview
- **Form Validation**: Client-side and server-side validation
- **Date Formatting**: Proper date display (e.g., "27 April 2025")
- **API Security**: Authentication with API keys
- **Error Handling**: Comprehensive error management
- **Responsive Design**: Mobile-friendly interface

### Technology Stack
- **Backend**: Node.js, Express, Supabase (PostgreSQL)
- **Frontend**: React, TypeScript, Material-UI, Axios
- **Database**: PostgreSQL via Supabase
- **Validation**: Joi (backend), React form validation (frontend)

### Running Task C

#### Backend
```bash
cd task-3-fullstack-app/backend
npm install
npm start
```
Server runs on `http://localhost:3001`

#### Frontend
```bash
cd task-3-fullstack-app/frontend
npm install
npm start
```
App runs on `http://localhost:3000`

### Database Setup
The application uses the provided Supabase credentials:
- **URL**: https://khmamctencrsmujhblmz.supabase.co
- **Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Run the SQL commands in `task-3-fullstack-app/backend/init-db.sql` in your Supabase SQL editor to create the required tables.

## API Endpoints

### Task C API
- `GET /api/projects` - Get available projects
- `POST /api/properties` - Create new property
- `GET /api/properties` - List all properties
- `GET /api/health` - Health check

### Authentication
All endpoints require the API key in headers:
```
X-API-Key: your-secret-api-key-here
```

## Key Features Demonstrated

### Task B - Backend Excellence
- Stream processing for large files
- Batch database operations
- Comprehensive error handling
- Input validation and sanitization
- Security best practices
- Structured logging and monitoring
- Performance optimization

### Task C - Full-Stack Development
- RESTful API design
- Real-time UI updates
- Form validation (client & server)
- Professional UI/UX with Material-UI
- Database integration with Supabase
- API security with authentication
- TypeScript for type safety
- Responsive design principles

## Production Readiness

Both applications include production-ready features:
- Environment variable configuration
- Comprehensive error handling
- Security measures (CORS, Helmet, validation)
- Logging and monitoring capabilities
- Clean, maintainable code structure
- Documentation and setup instructions

## Testing

### Task B
```bash
cd task-2-refactor
npm install
npm start

# Test with sample CSV file
curl -X POST http://localhost:3000/import-properties \
  -F "properties-csv=@sample.csv"
```

### Task C
1. Start backend server (port 3001)
2. Start frontend app (port 3000)
3. Open browser to `http://localhost:3000`
4. Test the property creation form
5. Verify live preview functionality
6. Submit form and check database

## Time Investment

- **Task B**: ~45 minutes (refactoring, documentation, testing)
- **Task C**: ~3 hours (full-stack development, integration, testing)
- **Total**: ~3.75 hours

## Notes

- All code follows modern JavaScript/TypeScript best practices
- Comprehensive error handling and validation throughout
- Security considerations implemented at all levels
- Production-ready architecture and structure
- Clean, maintainable, and well-documented code