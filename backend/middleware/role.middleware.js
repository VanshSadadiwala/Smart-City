/**
 * middleware/role.middleware.js — Role-Based Access Control (RBAC) Middleware
 * 
 * PURPOSE:
 *   After authentication (protect middleware verifies WHO you are),
 *   this middleware checks WHAT you are allowed to do based on your role.
 * 
 * HOW IT WORKS:
 *   - authorize(...roles) returns a middleware function
 *   - That function checks if req.user.role.name is in the allowed roles list
 *   - If yes → proceed (call next())
 *   - If no  → return 403 Forbidden
 * 
 * IMPORTANT:
 *   This middleware MUST be used AFTER the protect middleware,
 *   because it depends on req.user being set.
 * 
 * USAGE EXAMPLE:
 *   // Only citizens can access this route
 *   router.post('/', protect, authorize('citizen'), createComplaint);
 *
 *   // Both officers and admins can access this route
 *   router.get('/', protect, authorize('officer', 'admin'), getAllComplaints);
 */

/**
 * authorize — Factory function that creates role-checking middleware
 * 
 * @param {...string} roles — One or more allowed role names
 * @returns {Function} Express middleware function
 * 
 * HOW authorize WORKS:
 *   authorize('officer', 'admin') returns a middleware function.
 *   When that middleware runs, it checks:
 *     - Does req.user exist? (set by protect middleware)
 *     - Is req.user.role.name one of the allowed roles?
 *   If both are true, the request is allowed through.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // ── Sanity check: protect middleware must run first ───────────────────────
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    // ── Get the current user's role name ─────────────────────────────────────
    // req.user.role is populated by the protect middleware
    // req.user.role.name is the string like 'citizen', 'officer', etc.
    const userRole = req.user.role.name;

    // ── Check if user's role is in the allowed roles list ────────────────────
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of these roles: [${roles.join(', ')}]. Your role: ${userRole}`,
      });
    }

    // ✅ Role check passed — user is authorized
    next();
  };
};

module.exports = { authorize };
