/**
 * utils/seedRoles.js — Database Seeder for Roles
 * 
 * PURPOSE:
 *   This script inserts the 4 default roles into the MongoDB database.
 *   It must be run ONCE before the application can accept users.
 * 
 * WHY THIS MATTERS:
 *   Our User model requires a role field that is a MongoDB ObjectId reference
 *   to the Role collection. If the roles don't exist in the DB, signup fails.
 * 
 * RUN COMMAND:
 *   npm run seed
 *   OR
 *   node utils/seedRoles.js
 * 
 * SAFE TO RUN MULTIPLE TIMES:
 *   Uses findOneAndUpdate with upsert: true, so it won't create duplicate roles.
 *   Each role is identified by its unique 'name' field.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Import the Role model
const Role = require('../models/Role.model');

// ─── Role Seed Data ───────────────────────────────────────────────────────────

/**
 * Default roles for the Smart City platform.
 * 
 * 'permissions' array uses a "resource:action" format.
 * These are stored in DB for future use with granular permission checks.
 */
const roles = [
  {
    name: 'citizen',
    description: 'Regular city resident who can submit and track their own complaints',
    permissions: [
      'complaint:create',
      'complaint:view_own',
    ],
  },
  {
    name: 'worker',
    description: 'Field worker who resolves complaints assigned to them by officers',
    permissions: [
      'complaint:view_assigned',
      'complaint:update_status',
    ],
  },
  {
    name: 'officer',
    description: 'Municipal officer who can review all complaints and assign them to workers',
    permissions: [
      'complaint:view_all',
      'complaint:assign',
    ],
  },
  {
    name: 'admin',
    description: 'System administrator with full access to all features and routes',
    permissions: [
      'complaint:create',
      'complaint:view_all',
      'complaint:assign',
      'complaint:update_status',
      'user:manage',
      'role:manage',
    ],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

const seedRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('🌱 Seeding roles...\n');

    // Insert or update each role
    for (const roleData of roles) {
      const result = await Role.findOneAndUpdate(
        { name: roleData.name },    // Find by name (unique field)
        roleData,                    // Update with full role data
        {
          upsert: true,              // Create if doesn't exist
          new: true,                 // Return the updated document
          runValidators: true,       // Run schema validators
        }
      );
      console.log(`  ✅ Role "${result.name}" — ${result.description}`);
    }

    console.log('\n🎉 All roles seeded successfully!');
    console.log('You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    // Always close the connection when done
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

// Run the seeder
seedRoles();
