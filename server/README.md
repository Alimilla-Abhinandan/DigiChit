# DigiChit Backend Server

A Node.js backend server for the DigiChit application with JWT authentication and MongoDB database.

## Features

- **JWT Authentication**: Secure token-based authentication
- **MVC Architecture**: Clean separation of concerns
- **Input Validation**: Comprehensive form validation using express-validator
- **Password Hashing**: Secure password storage using bcryptjs
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling middleware
- **MongoDB Integration**: MongoDB database with Mongoose ODM

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (protected route)

### Health Check

- `GET /api/health` - Server health check

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/digichit
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud MongoDB instance.

4. **Run the Server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Usage Examples

### User Registration

```javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  }),
});

const data = await response.json();
```

### User Login

```javascript
const response = await fetch('http://localhost:5000/api/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!'
  }),
});

const data = await response.json();
```

### Get Current User (Protected Route)

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "token": "jwt_token_here"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## Project Structure

```
server/
├── config/
│   ├── database.js      # Database connection
│   └── jwt.js          # JWT utilities
├── controller/
│   └── authController.js # Authentication logic
├── middleware/
│   └── validation.js    # Input validation
├── model/
│   └── User.js         # User model
├── routes/
│   └── auth.js         # Authentication routes
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # This file
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured CORS for security
- **Helmet**: Security headers middleware
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Adding New Routes

1. Create a new controller in `controller/` directory
2. Create validation middleware if needed
3. Add routes in `routes/` directory
4. Import and use routes in `server.js`

### Database Schema Changes

1. Update the model in `model/` directory
2. Run database migrations if needed
3. Update related controllers and validation

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET in .env file
   - Ensure token is being sent in Authorization header
   - Verify token expiration

3. **CORS Errors**
   - Check CLIENT_URL in .env file
   - Ensure frontend URL matches CORS configuration

## License

This project is licensed under the MIT License. 