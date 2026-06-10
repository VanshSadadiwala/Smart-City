/**
 * models/Role.model.js — Role Schema
 * 
 * PURPOSE:
 *   Stores all available roles in the database (NOT hardcoded in code).
 *   This is the foundation of our RBAC (Role-Based Access Control) system.
 * 
 * WHY STORE ROLES IN DB?
 *   - Easy to add/remove roles without changing code
 *   - Roles can be managed by an Admin at runtime
 *   - Scalable design for future permissions system
 * 
 * ROLES:
 *   citizen  — Can create and view their own complaints
 *   worker   — Can view assigned complaints, update status
 *   officer  — Can view all complaints, assign to workers
 *   admin    — Full access to everything
 */

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    // Role name (unique, lowercase for consistency)
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      enum: {
        values: ['citizen', 'worker', 'officer', 'admin'],
        message: 'Role must be citizen, worker, officer, or admin',
      },
    },

    // Human-readable description of what this role can do
    description: {
      type: String,
      default: '',
      trim: true,
    },

    // Array of permission strings (for potential future granular permissions)
    // Example: ['complaint:create', 'complaint:view_own']
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Role', roleSchema);
