import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { testCloudinaryConnection } from './config/cloudinary.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import songRoutes from './routes/songRoutes.js';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Test Cloudinary connection
testCloudinaryConnection();

// Middleware
// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://brunify-um16.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: true, // Allow all origins in production for compatibility
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    message: 'Server is running',
    dbStatus: statusMap[dbStatus] || 'unknown',
    hasMongoUri: !!process.env.MONGODB_URI,
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

// API Routes
app.use('/api/songs', songRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎵 Welcome to Spotify Clone API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      songs: '/api/songs',
      auth: '/api/auth',
      playlists: '/api/playlists'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎵  SPOTIFY CLONE API SERVER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀  Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡  Listening on port ${PORT}`);
    console.log(`🌐  API URL: http://localhost:${PORT}`);
    console.log(`📊  Health check: http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

export default app;
