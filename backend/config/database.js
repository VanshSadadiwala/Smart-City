/**
 * config/database.js — MongoDB Connection Configuration
 * 
 * Centralizes the database connection logic.
 * Can be imported anywhere in the app to ensure a single connection.
 */

const mongoose = require('mongoose');

/**
 * connectDB — Connects to MongoDB using the URI from .env
 * 
 * Uses async/await. If connection fails, the process exits immediately
 * because the app cannot function without a database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
