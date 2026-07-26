/**
 * routes/complaint.routes.js — Complaint API Routes
 * 
 * Base path: /api/complaints
 * 
 * ALL routes here are protected (require JWT token).
 * Role-based access is applied per route using the authorize() middleware.
 * 
 * Route Summary:
 * ┌──────────────────────────────────────┬─────────────────────────────────────┐
 * │ Endpoint                             │ Access                              │
 * ├──────────────────────────────────────┼─────────────────────────────────────┤
 * │ POST   /api/complaints               │ Citizen, Admin                      │
 * │ GET    /api/complaints               │ All (role-based filtering in ctrl)  │
 * │ GET    /api/complaints/:id           │ All (role-based ownership check)    │
 * │ PUT    /api/complaints/:id/assign    │ Officer, Admin                      │
 * │ PUT    /api/complaints/:id/status    │ Worker, Admin                       │
 * └──────────────────────────────────────┴─────────────────────────────────────┘
 * 
 * MIDDLEWARE CHAIN EXPLAINED:
 *   protect → verifies who the user is (JWT check)
 *   authorize(...roles) → verifies what the user is allowed to do (role check)
 *   controller → executes the business logic
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateStatus,
  getComplaintById,
} = require('../controllers/complaint.controller');

// Import middleware
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// ─── Complaint Routes ─────────────────────────────────────────────────────────

/**
 * POST /api/complaints
 * Create a new complaint
 * 
 * Only citizens (and admin for testing) can submit complaints.
 * The citizen's ID is taken from req.user (set by protect middleware).
 */
router.post(
  '/',
  protect,                         // 1. Must be logged in
  authorize('citizen', 'admin'),   // 2. Must be citizen or admin
  createComplaint                  // 3. Execute controller logic
);

/**
 * GET /api/complaints
 * Fetch complaints based on role:
 *   - Citizen → only their complaints
 *   - Worker  → only assigned complaints
 *   - Officer/Admin → ALL complaints
 * 
 * All authenticated users can access this — role filtering happens in controller.
 * 
 * Optional query params:
 *   ?status=Pending
 *   ?category=Roads
 */
router.get(
  '/',
  protect,                                          // Must be logged in
  authorize('citizen', 'worker', 'officer', 'admin'), // All roles allowed
  getComplaints
);

/**
 * GET /api/complaints/:id
 * Fetch a single complaint by ID
 * Role-based ownership check happens inside the controller.
 */
router.get(
  '/:id',
  protect,
  authorize('citizen', 'worker', 'officer', 'admin'),
  getComplaintById
);

/**
 * PUT /api/complaints/:id/assign
 * Officer assigns a complaint to a specific worker
 * 
 * Body: { workerId: "<worker's MongoDB ObjectId>" }
 */
router.put(
  '/:id/assign',
  protect,
  authorize('officer', 'admin'),   // Only officers and admins can assign
  assignComplaint
);

/**
 * PUT /api/complaints/:id/status
 * Worker updates the status of a complaint assigned to them
 * 
 * Body: { status: "In Progress" | "Completed" | "Rejected" }
 */
router.put(
  '/:id/status',
  protect,
  authorize('worker', 'admin'),    // Only workers and admins can update status
  updateStatus
);

module.exports = router;
