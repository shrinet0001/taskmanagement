# Task Management Application

A full-stack task management application with secure user authentication, built with modern web technologies. Users can register, log in, and manage their personal tasks with full CRUD operations.

## Features

- **User Authentication**
  - Secure registration with username, email, and password
  - JWT-based authentication using Supabase Auth
  - Protected routes that require authentication
  - Persistent sessions
  - Secure logout functionality

- **Task Management**
  - Create new tasks with title and optional description
  - View all personal tasks (users only see their own tasks)
  - Update task details (title, description)
  - Toggle task status (pending/completed)
  - Delete tasks
  - Tasks organized by status (pending and completed)

- **Security**
  - Row Level Security (RLS) ensures users can only access their own data
  - JWT tokens for API authentication
  - Secure password handling via Supabase Auth
  - Protected API routes

- **Validation**
  - Frontend form validation for all inputs
  - Real-time error messages
  - Required field validation
  - Email format validation
  - Password strength requirements
  - Username length validation
 
  - ## Core Application Files
src/App.tsx – Main app component with authentication flow

src/main.tsx – App entry point with Redux store

src/index.css – Tailwind styles

src/store/store.ts – Redux store setup

src/store/authSlice.ts – Authentication state management

src/store/tasksSlice.ts – Tasks state management

src/store/hooks.ts – Redux hooks

src/components/AuthForm.tsx – Login/Register component

src/components/TaskList.tsx – Main tasks dashboard

src/components/TaskForm.tsx – Task creation/editing form

## Configuration Files

package.json – Dependencies and scripts

tsconfig.json – TypeScript configuration

tailwind.config.js – Tailwind CSS configuration

vite.config.ts – Vite build configuration

index.html – HTML entry point

.env.example – Environment variables template 

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Icon library
- **Supabase JS Client** - Database and auth integration

### Backend
- **Node.js/Express** - REST API server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Project Structure

```
project/
├── src/                              # Frontend
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.tsx          # Auth page container
│   │   │   ├── LoginForm.tsx         # Login component
│   │   │   └── RegisterForm.tsx      # Registration component
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx         # Main dashboard
│   │   └── tasks/
│   │       ├── TaskList.tsx          # Task list container
│   │       ├── TaskItem.tsx          # Individual task component
│   │       └── CreateTaskForm.tsx    # Task creation form
│   ├── contexts/
│   │   └── AuthContext.tsx           # Authentication context
│   ├── hooks/
│   │   └── useTasks.ts               # Task management hook
│   ├── lib/
│   │   └── api.ts                    # API client and types
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # App entry point
│   └── index.css                     # Global styles
├── server/                           # Backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts               # User model
│   │   │   └── Task.ts               # Task model
│   │   ├── routes/
│   │   │   ├── auth.ts               # Auth endpoints
│   │   │   └── tasks.ts              # Task endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT verification
│   │   ├── config/
│   │   │   └── database.ts           # MongoDB connection
│   │   └── server.ts                 # Express server
│   ├── .env                          # Server environment variables
│   └── package.json                  # Server dependencies
├── .env                              # Frontend environment variables
└── README.md                         # This file
```

## Database Schema

### Collections

#### `users`
Stores user authentication and profile data:
- `_id` (ObjectId) - MongoDB auto-generated ID
- `email` (String, unique, required) - User's email address
- `password` (String, required) - Hashed password
- `username` (String, unique, required) - User's unique username
- `createdAt` (Date) - Account creation timestamp
- `updatedAt` (Date) - Last update timestamp

#### `tasks`
Stores user tasks:
- `_id` (ObjectId) - MongoDB auto-generated ID
- `user_id` (ObjectId, required) - References users._id
- `title` (String, required) - Task title
- `description` (String, optional) - Task description
- `status` (String, enum) - Task status: 'pending' or 'completed'
- `createdAt` (Date) - Task creation timestamp
- `updatedAt` (Date) - Last update timestamp

### Security

API security is enforced through:
- JWT token verification on protected endpoints
- User ID from JWT ensures users only access their own data
- Password hashing using bcrypt
- Request validation using express-validator

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

**Register**
- Endpoint: `POST /auth/register`
- Body: `{ email, password, username }`
- Returns: `{ token, user: { id, email, username } }`

**Login**
- Endpoint: `POST /auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user: { id, email, username } }`

**Get Current User**
- Endpoint: `GET /auth/me`
- Auth: Required (JWT in Authorization header)
- Returns: `{ id, email, username }`

### Tasks

All task endpoints require JWT authentication.

**Get All Tasks**
- Endpoint: `GET /tasks`
- Auth: Required (JWT)
- Returns: Array of user's tasks

**Create Task**
- Endpoint: `POST /tasks`
- Auth: Required (JWT)
- Body: `{ title, description?, status? }`
- Returns: Created task object

**Update Task**
- Endpoint: `PUT /tasks/:id`
- Auth: Required (JWT)
- Body: `{ title?, description?, status? }`
- Returns: Updated task object

**Delete Task**
- Endpoint: `DELETE /tasks/:id`
- Auth: Required (JWT)
- Returns: Success message

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   cd ..
   ```

4. **Set up MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service
   - The default connection string is `mongodb://localhost:27017/taskmanagement`

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `server/.env` with your MongoDB URI

5. **Configure environment variables**

   **Frontend** (`.env` in root):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend** (`server/.env`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

6. **Run the backend server**
   ```bash
   cd server
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

7. **Run the frontend development server** (in a new terminal)
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

8. **Build for production**
   ```bash
   # Frontend
   npm run build
   
   # Backend
   cd server
   npm run build
   npm start
   ```

## How to Use the Application

1. **Registration**
   - Click "Sign Up" on the auth page
   - Enter a username (min 3 characters)
   - Enter a valid email address
   - Create a password (min 6 characters)
   - Confirm your password
   - Click "Sign Up"

2. **Login**
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to your dashboard

3. **Managing Tasks**
   - Click "New Task" to create a task
   - Enter a title (required) and optional description
   - Click "Create Task"
   - Click the checkbox to mark tasks as complete/incomplete
   - Click the edit icon to modify task details
   - Click the trash icon to delete tasks

4. **Logout**
   - Click "Sign Out" in the header

## Form Validation

The application includes comprehensive validation:

### Registration Form
- Username: Required, minimum 3 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Required, must match password

### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Task Form
- Title: Required, maximum 200 characters
- Description: Optional

All forms display real-time error messages for invalid inputs.

## Testing (Optional Extension)

This project is ready for testing implementation. Recommended test coverage:

### Frontend Tests (Jest + React Testing Library)
- Form validation logic
- Component rendering
- User interactions
- Authentication flow
- Task CRUD operations
- Error handling

### Backend Tests
- RLS policies verification
- Database constraints
- Authentication flows
- Task ownership verification

To add tests, install the testing dependencies:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom vitest
```

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

**Note**: Never commit your `.env` files to version control. Use `.env.example` as a template.

## Security Best Practices

This application implements several security best practices:

1. **JWT Authentication**: Secure token-based authentication with 7-day expiration
2. **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
3. **Input Validation**: Both frontend and backend validation using express-validator
4. **Authorization**: Middleware ensures users can only access their own data
5. **CORS**: Configured to allow only specific origins
6. **Environment Variables**: Sensitive data stored in .env files
7. **No Password Exposure**: User passwords never sent to frontend

## Future Enhancements

Potential features to add:
- Task categories and tags
- Due dates and reminders
- Task priority levels
- Search and filter functionality
- Task sharing between users
- Real-time updates using Supabase subscriptions
- Dark mode theme
- Mobile-responsive improvements
- Export tasks to CSV/PDF
- Task statistics and analytics

## Troubleshooting

**Cannot connect to database**
- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check `server/.env` has correct MONGODB_URI
- Ensure network access is allowed (for MongoDB Atlas)

**Backend server won't start**
- Check if port 5000 is already in use
- Verify all dependencies are installed in `server/` directory
- Check server console for error messages

**Authentication not working**
- Clear browser localStorage
- Check browser console for errors
- Verify backend server is running on port 5000
- Check JWT_SECRET is set in server/.env

**Tasks not appearing**
- Verify you're logged in with the correct account
- Check browser console and network tab for errors
- Ensure backend server is running and accessible
- Check MongoDB connection is active

- ## images of projcts
   <img width="1147" height="621" alt="image" src="https://github.com/user-attachments/assets/bc3636fe-9fdd-4f73-aef9-e6df31e77639" />
   
   <img width="1154" height="624" alt="image" src="https://github.com/user-attachments/assets/f8034bd9-5cdd-4e75-953c-a85b3400762a" />

- <img width="1159" height="623" alt="image" src="https://github.com/user-attachments/assets/6a33d168-4823-4a02-a399-72d2367cbd3b" />


## License

This project is created for educational purposes.

## Contact

For questions or issues, please open an issue in the repository.
