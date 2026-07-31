/**
 * controllers/auth.controller.js — Authentication Logic
 * 
 * Contains the business logic for:
 *   - signup: Register a new user
 *   - login: Authenticate user and return JWT token
 * 
 * DESIGN PATTERN: MVC
 *   Controller handles the "what to do" part.
 *   Model handles the "how to store" part.
 *   Route handles the "which URL maps to what" part.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Role = require('../models/Role.model');

// ─── Helper: Generate JWT Token ───────────────────────────────────────────────

/**
 * generateToken — Creates a signed JWT token for a user
 * 
 * @param {string} userId — MongoDB ObjectId of the user
 * @returns {string} Signed JWT token string
 * 
 * The token contains the userId in its payload.
 * When the client sends this token back, we decode it to identify the user.
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // Payload: what data to encode in the token
    process.env.JWT_SECRET,      // Secret key for signing
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token expiry
  );
};

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────

/**
 * signup — Register a new user
 * 
 * Request body should contain:
 *   - name: string
 *   - email: string
 *   - password: string
 *   - role: string (e.g., 'citizen', 'worker', 'officer', 'admin')
 * 
 * Steps:
 *   1. Validate input fields
 *   2. Check if email already exists
 *   3. Find the Role document in DB matching the role name
 *   4. Create the user (password gets hashed via pre-save hook)
 *   5. Return user data + JWT token
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Step 1: Basic input validation ───────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    // ── Step 2: Check if email already registered ─────────────────────────────
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // ── Step 3: Public registration ALWAYS creates a citizen ─────────────────
    const roleDoc = await Role.findOne({ name: "citizen" });

    if (!roleDoc) {
      return res.status(500).json({
        success: false,
        message: "Citizen role is not configured.",
      });
    }

    // ── Step 4: Create user ───────────────────────────────────────────────────
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: roleDoc._id,
    });

    // ── Step 5: Generate JWT ──────────────────────────────────────────────────
    const token = generateToken(newUser._id);

    const userResponse = await User.findById(newUser._id)
      .populate("role", "name description")
      .select("-password");

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: userResponse,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);

      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during signup. Please try again.",
    });
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────

/**
 * login — Authenticate an existing user
 * 
 * Request body should contain:
 *   - email: string
 *   - password: string (plain text — will be compared with hash)
 * 
 * Steps:
 *   1. Validate input fields
 *   2. Find user by email (explicitly selecting password field)
 *   3. Compare provided password with stored hash using bcrypt
 *   4. Generate and return JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Step 1: Validate input ────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // ── Step 2: Find user and include password field ───────────────────────────
    // We use .select('+password') because the schema hides password by default
    // We also populate role so we can return the role name in the response
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')               // Include the hidden password field
      .populate('role', 'name description permissions');

    // If no user found with that email
    if (!user) {
      // Use generic message for security (don't reveal if email exists)
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Step 3: Compare plain text password with bcrypt hash ──────────────────
    // user.comparePassword() is defined as an instance method in the User model
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact an administrator.',
      });
    }

    // ── Step 4: Generate JWT token ────────────────────────────────────────────
    const token = generateToken(user._id);

    // Remove password from response object
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user,
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

/**
 * getMe — Get the currently logged-in user's profile
 * 
 * This route is protected (requires JWT token).
 * req.user is already set by the protect middleware.
 * No need to query DB again.
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch profile.',
    });
  }
};

module.exports = { signup, login, getMe };
