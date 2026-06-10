/**
 * server.js — Entry point of the Smart City Backend
 * 
 * This file:
 *   1. Loads environment variables from .env
 *   2. Connects to MongoDB
 *   3. Sets up Express middleware
 *   4. Registers all API routes
 *   5. Starts the HTTP server
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route files
const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');

// Create Express application
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────

// Authentication routes: /api/auth/signup, /api/auth/login
app.use('/api/auth', authRoutes);

// Complaint routes: /api/complaints (CRUD)
app.use('/api/complaints', complaintRoutes);

// ─── Health Check Route ───────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏙️ Smart City API is running!',
    version: '1.0.0',
    phase: 'Phase 1 — RBAC + Complaint Management',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

// Catch any routes not defined above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// Catches errors thrown in async/await route handlers
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database Connection & Server Start ───────────────────────────────────────

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);  // Exit process if DB connection fails
  });
