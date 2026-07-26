/**
 * middleware/auth.middleware.js — JWT Authentication Middleware
 * 
 * PURPOSE:
 *   Protects routes that require the user to be logged in.
 *   Extracts and verifies the JWT token from the Authorization header.
 * 
 * HOW IT WORKS:
 *   1. Client sends request with header: "Authorization: Bearer <token>"
 *   2. This middleware reads that token
 *   3. Verifies it using JWT_SECRET (checks signature + expiry)
 *   4. Fetches the user from DB and attaches to req.user
 *   5. If valid → call next() to proceed to the route handler
 *   6. If invalid/missing → return 401 Unauthorized
 * 
 * USAGE:
 *   router.get('/protected', protect, yourController)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * protect — Verifies that the request has a valid JWT token
 * 
 * Attaches the authenticated user to req.user so downstream
 * middleware and controllers can access user identity without
 * re-querying the database.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ── Step 1: Extract token from Authorization header ──────────────────────
    // Expected header format: "Authorization: Bearer eyJhbGciOi..."
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]; // Get just the token part
    }

    // If no token found, the user is not authenticated
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // ── Step 2: Verify the token ─────────────────────────────────────────────
    // jwt.verify throws an error if:
    //   - Token signature is invalid (tampered)
    //   - Token has expired (based on JWT_EXPIRES_IN in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: '<userId>', iat: <issuedAt>, exp: <expiresAt> }

    // ── Step 3: Fetch user from database ─────────────────────────────────────
    // We populate 'role' so that req.user.role.name gives the role name string
    // select('+password') is NOT here — we don't want password in req.user
    const user = await User.findById(decoded.id)
      .populate('role', 'name permissions') // Attach role data from Role collection
      .select('-password');                  // Exclude password from user object

    // If user was deleted after token was issued
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // If the user account has been deactivated
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    // ── Step 4: Attach user to request object ────────────────────────────────
    // Now every downstream handler can access req.user
    req.user = user;

    next(); // ✅ Authentication passed — proceed to next middleware/controller

  } catch (error) {
    // Handle specific JWT errors with friendly messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }

    // Generic error fallback
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

module.exports = { protect };
