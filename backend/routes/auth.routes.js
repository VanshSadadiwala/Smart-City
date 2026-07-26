/**
 * routes/auth.routes.js — Authentication API Routes
 * 
 * Base path: /api/auth
 * 
 * Routes defined here:
 *   POST /api/auth/signup  → Register a new user
 *   POST /api/auth/login   → Login and get JWT token
 *   GET  /api/auth/me      → Get current logged-in user (protected)
 * 
 * HOW ROUTES WORK:
 *   express.Router() creates a mini-app for just these routes.
 *   server.js mounts this at '/api/auth', so:
 *     router.post('/signup') → /api/auth/signup
 *     router.post('/login')  → /api/auth/login
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { signup, login, getMe } = require('../controllers/auth.controller');

// Import middleware
const { protect } = require('../middleware/auth.middleware');

// ─── Auth Routes ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Public route — no authentication required
 * Body: { name, email, password, role }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * Public route — no authentication required
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Protected route — requires valid JWT token
 * Returns the profile of the currently logged-in user
 */
router.get('/me', protect, getMe);

module.exports = router;
