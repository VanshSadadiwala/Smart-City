/**
 * controllers/complaint.controller.js — Complaint Management Logic
 * 
 * Contains business logic for all complaint-related operations.
 * Each function corresponds to one API endpoint.
 * 
 * ROLE-BASED LOGIC SUMMARY:
 * ┌────────────┬───────────────────────────────────────────────────────────┐
 * │ Role       │ What they can do                                          │
 * ├────────────┼───────────────────────────────────────────────────────────┤
 * │ Citizen    │ Create complaints, view ONLY their own complaints         │
 * │ Officer    │ View ALL complaints, assign complaints to workers         │
 * │ Worker     │ View complaints assigned to them, update complaint status │
 * │ Admin      │ Full access — can do everything above                     │
 * └────────────┴───────────────────────────────────────────────────────────┘
 */

const Complaint = require('../models/Complaint.model');
const User = require('../models/User.model');
const Role = require('../models/Role.model');

// ─── POST /api/complaints ─────────────────────────────────────────────────────

/**
 * createComplaint — Citizen creates a new complaint
 * 
 * Access: Citizen, Admin
 * 
 * Request body:
 *   - title: string
 *   - description: string
 *   - category: string (optional, defaults to 'Other')
 * 
 * The 'createdBy' field is automatically set from req.user (logged-in user).
 * Citizens should NOT be able to set this manually (security!).
 */
const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    // Create complaint and link it to the currently logged-in citizen
    const complaint = await Complaint.create({
      title,
      description,
      category: category || 'Other',
      createdBy: req.user._id, // Set automatically from JWT — secure
    });

    // Populate the creator's info before responding
    await complaint.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint,
    });

  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }

    console.error('Create Complaint Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create complaint.' });
  }
};

// ─── GET /api/complaints ──────────────────────────────────────────────────────

/**
 * getComplaints — Fetch complaints based on the user's role
 * 
 * Access: All authenticated users (role determines what they see)
 * 
 * Filtering logic:
 *   - Citizen → Only their own complaints (createdBy = req.user._id)
 *   - Worker  → Only complaints assigned to them (assignedTo = req.user._id)
 *   - Officer → All complaints (no filter)
 *   - Admin   → All complaints (no filter)
 * 
 * Optional query params:
 *   - ?status=Pending (filter by status)
 *   - ?category=Roads (filter by category)
 */
const getComplaints = async (req, res) => {
  try {
    const userRole = req.user.role.name; // e.g., 'citizen', 'officer'
    let filter = {};                      // MongoDB query filter object

    // ── Build filter based on role ────────────────────────────────────────────

    if (userRole === 'citizen') {
      // Citizens see ONLY their own complaints
      filter.createdBy = req.user._id;

    } else if (userRole === 'worker') {
      // Workers see ONLY complaints assigned to them
      filter.assignedTo = req.user._id;

    } else if (userRole === 'officer' || userRole === 'admin') {
      // Officers and Admins see ALL complaints → no filter needed
      // filter stays as {}
    }

    // ── Optional query param filters ──────────────────────────────────────────
    if (req.query.status) {
      filter.status = req.query.status; // e.g., ?status=Pending
    }
    if (req.query.category) {
      filter.category = req.query.category; // e.g., ?category=Roads
    }

    // ── Execute the query ──────────────────────────────────────────────────────
    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email')        // Show citizen's name & email
      .populate('assignedTo', 'name email')       // Show worker's name & email
      .sort({ createdAt: -1 });                   // Newest first

    res.status(200).json({
      success: true,
      count: complaints.length,
      role: userRole,                             // Include role for client-side info
      complaints,
    });

  } catch (error) {
    console.error('Get Complaints Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
};

// ─── PUT /api/complaints/:id/assign ───────────────────────────────────────────

/**
 * assignComplaint — Officer assigns a complaint to a Worker
 * 
 * Access: Officer, Admin
 * 
 * Request body:
 *   - workerId: string (MongoDB ObjectId of the Worker user)
 * 
 * Validations:
 *   - Complaint must exist
 *   - Worker must exist
 *   - The assigned user must actually have the 'worker' role
 */
const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;     // Complaint ID from URL
    const { workerId } = req.body; // Worker's user ID from request body

    // ── Validate input ────────────────────────────────────────────────────────
    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a workerId to assign the complaint.',
      });
    }

    // ── Verify the complaint exists ───────────────────────────────────────────
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID: ${id}`,
      });
    }

    // ── Verify the worker user exists and has 'worker' role ───────────────────
    // We look up the Role document first to get the worker role's ObjectId
    const workerRole = await Role.findOne({ name: 'worker' });
    
    const worker = await User.findOne({
      _id: workerId,
      role: workerRole._id, // Ensure the user actually has the worker role
      isActive: true,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'No active worker found with that ID. Make sure the user has the worker role.',
      });
    }

    // ── Assign the complaint ──────────────────────────────────────────────────
    complaint.assignedTo = workerId;

    // Automatically move status from Pending → In Progress when assigned
    if (complaint.status === 'Pending') {
      complaint.status = 'In Progress';
    }

    await complaint.save();

    // Populate for response
    await complaint.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: `Complaint assigned to ${worker.name} successfully!`,
      complaint,
    });

  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format. Please provide a valid MongoDB ObjectId.',
      });
    }

    console.error('Assign Complaint Error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign complaint.' });
  }
};

// ─── PUT /api/complaints/:id/status ───────────────────────────────────────────

/**
 * updateStatus — Worker updates the status of an assigned complaint
 * 
 * Access: Worker, Admin
 * 
 * Request body:
 *   - status: 'In Progress' | 'Completed' | 'Rejected'
 * 
 * Business rules:
 *   - Workers can ONLY update complaints assigned to THEM
 *   - Admin can update any complaint's status
 *   - Status must be one of the allowed enum values
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role.name;

    // ── Validate input ────────────────────────────────────────────────────────
    const allowedStatuses = ['Pending', 'In Progress', 'Completed', 'Rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    // ── Find the complaint ────────────────────────────────────────────────────
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID: ${id}`,
      });
    }

    // ── Authorization: Workers can only update THEIR assigned complaints ───────
    if (userRole === 'worker') {
      // Convert ObjectIds to strings for comparison
      const isAssignedToThisWorker =
        complaint.assignedTo &&
        complaint.assignedTo.toString() === req.user._id.toString();

      if (!isAssignedToThisWorker) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update complaints assigned to you.',
        });
      }
    }

    // ── Update the status ─────────────────────────────────────────────────────
    complaint.status = status;
    await complaint.save();

    await complaint.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: `Complaint status updated to "${status}" successfully!`,
      complaint,
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID format.',
      });
    }

    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update complaint status.' });
  }
};

// ─── GET /api/complaints/:id ───────────────────────────────────────────────────

/**
 * getComplaintById — Fetch a single complaint by its ID
 * 
 * Access: All authenticated users (with role-based ownership checks)
 * 
 * Rules:
 *   - Citizens can only view their OWN complaints
 *   - Workers can only view complaints assigned to THEM
 *   - Officers and Admins can view ANY complaint
 */
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role.name;

    const complaint = await Complaint.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID: ${id}`,
      });
    }

    // ── Role-based ownership check ─────────────────────────────────────────────
    if (userRole === 'citizen') {
      if (complaint.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This complaint does not belong to you.',
        });
      }
    } else if (userRole === 'worker') {
      const isAssigned =
        complaint.assignedTo &&
        complaint.assignedTo._id.toString() === req.user._id.toString();
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This complaint is not assigned to you.',
        });
      }
    }

    res.status(200).json({ success: true, complaint });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid complaint ID format.' });
    }
    console.error('Get Complaint By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch complaint.' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateStatus,
  getComplaintById,
};
