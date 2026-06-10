/**
 * models/User.model.js — User Schema
 * 
 * PURPOSE:
 *   Represents every person registered in the Smart City system.
 *   Each user has a role (citizen, worker, officer, admin) which determines
 *   what they can and cannot access.
 * 
 * KEY DESIGN DECISIONS:
 *   - Password is hashed with bcrypt BEFORE saving (pre-save hook)
 *   - Role is stored as a reference (ObjectId) to the Role collection
 *   - comparePassword method makes login check easy and clean
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // Email address — must be unique and in valid format
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // Password — stored as bcrypt hash, NEVER plain text
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // ⚠️ IMPORTANT: Password excluded from query results by default
    },

    // Reference to the Role document
    // This links user to citizen/worker/officer/admin role in DB
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },

    // Whether the user account is active (Admin can deactivate users)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-Save Hook: Hash Password ─────────────────────────────────────────────

/**
 * Before saving a User document, check if the password field was modified.
 * If yes, hash it using bcrypt with a salt of 12 rounds.
 * 
 * This ensures:
 *   - New users get their password hashed on signup
 *   - Existing users get password re-hashed if they change it
 *   - Other field updates (name, email) do NOT re-hash the password
 */
userSchema.pre('save', async function () {
  // Only hash if password field was actually changed
  if (!this.isModified('password')) return;

  // bcrypt salt rounds — higher = more secure but slower (12 is a good balance)
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ─── Instance Method: Compare Password ────────────────────────────────────────

/**
 * comparePassword — Compares plain text password with stored hash
 * 
 * Used during login to verify the user's password.
 * bcrypt.compare handles the comparison securely.
 * 
 * @param {string} candidatePassword — plain text password from login form
 * @returns {boolean} — true if match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
