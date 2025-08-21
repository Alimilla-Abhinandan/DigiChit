const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const paymentRoutes = require('./routes/payment');

// Initialize express app
const app = express();

// Connect to database
console.log('🚀 Starting DigiChit Server...');
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${process.env.PORT || 5000}`);
console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
console.log('');

connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/payment', paymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DigiChit API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log('');
  console.log('🎉 DigiChit Server is running!');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`   POST /api/auth/signup - Register new user`);
  console.log(`   POST /api/auth/signin - Login user`);
  console.log(`   GET  /api/auth/me    - Get current user (protected)`);
  console.log(`   GET  /api/health     - Server health check`);
  console.log('');
});
