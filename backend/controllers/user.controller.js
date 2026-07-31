const User = require("../models/User.model");
const Role = require("../models/Role.model");

// GET /api/users/workers
// Access: Officer, Admin
const getWorkers = async (req, res) => {
  try {
    // Find the Worker role
    const workerRole = await Role.findOne({ name: "worker" });

    if (!workerRole) {
      return res.status(404).json({
        success: false,
        message: "Worker role not found.",
      });
    }

    // Find all active workers
    const workers = await User.find({
      role: workerRole._id,
      isActive: true,
    })
      .select("_id name email")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: workers.length,
      users: workers,
    });
  } catch (error) {
    console.error("Get Workers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers.",
    });
  }
};

// POST /api/users/staff
// Access: Admin only
const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and role.",
      });
    }

    // Only worker and officer accounts can be created through this endpoint
    if (!["worker", "officer"].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Staff role must be either worker or officer.",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Find requested role
    const roleDoc = await Role.findOne({
      name: role.toLowerCase(),
    });

    if (!roleDoc) {
      return res.status(404).json({
        success: false,
        message: `${role} role not found.`,
      });
    }

    // Create staff account
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: roleDoc._id,
    });

    // Return user without password
    const userResponse = await User.findById(newUser._id)
      .populate("role", "name description")
      .select("-password");

    res.status(201).json({
      success: true,
      message: `${role} account created successfully.`,
      user: userResponse,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (e) => e.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    console.error("Create Staff Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating staff account.",
    });
  }
};

module.exports = {
  getWorkers,
  createStaff,
};
