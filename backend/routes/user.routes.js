const express = require("express");

const router = express.Router();

const { getWorkers, createStaff } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// GET /api/users/workers
// Officer and Admin only
router.get("/workers", protect, authorize("officer", "admin"), getWorkers);
// POST /api/users/staff
// Admin only
router.post(
  "/staff",
  protect,
  authorize("admin"),
  createStaff
);
module.exports = router;
