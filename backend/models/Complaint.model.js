/**
 * models/Complaint.model.js — Complaint Schema
 * 
 * PURPOSE:
 *   Represents a complaint submitted by a Citizen.
 *   Tracks who created it, who it's assigned to, and its current status.
 * 
 * COMPLAINT LIFECYCLE:
 *   Citizen creates → Officer assigns to Worker → Worker updates status
 *   
 *   Status flow: Pending → In Progress → Completed
 *              (can also be Rejected by Officer)
 * 
 * KEY FIELDS:
 *   - createdBy: Reference to the Citizen User who submitted it
 *   - assignedTo: Reference to the Worker User assigned by an Officer
 *   - status: Current state of the complaint
 */

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    // Short title that describes the complaint
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // Detailed description of the complaint
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // The Citizen who created this complaint
    // 'ref: User' means Mongoose can populate this with full user data
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must have a creator'],
    },

    // The Worker assigned to resolve this complaint (null initially)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Not assigned when first created
    },

    // Current status of the complaint
    // Restricted to specific values using enum
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed', 'Rejected'],
        message: 'Status must be Pending, In Progress, Completed, or Rejected',
      },
      default: 'Pending', // All new complaints start as Pending
    },

    // Category of the complaint (optional, useful for filtering)
    category: {
      type: String,
      trim: true,
      enum: {
        values: ['Roads', 'Water', 'Electricity','Roads', 'Sanitation', 'Parks', 'Other'],
        message: 'Invalid category',
      },
      default: 'Other',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Index for faster queries ─────────────────────────────────────────────────

// Citizens will frequently query complaints by their own user ID
complaintSchema.index({ createdBy: 1 });

// Officers/Workers will filter by status frequently
complaintSchema.index({ status: 1 });

// Workers look up their assigned complaints
complaintSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
