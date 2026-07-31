import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function WorkerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Used to automatically scroll to success/error messages
  const messageRef = useRef(null);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/complaints/${id}`);

      const data = response.data.complaint;

      setComplaint(data);
      setStatus(data.status);
    } catch (err) {
      console.error("Fetch Complaint Error:", err);

      setError(err.response?.data?.message || "Unable to load complaint.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToMessage = () => {
    setTimeout(() => {
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleStatusUpdate = async () => {
    if (!status || status === complaint.status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/complaints/${id}/status`, {
        status,
      });

      // Update complaint with latest server data
      setComplaint(response.data.complaint);

      // Keep selected status synchronized
      setStatus(response.data.complaint.status);

      setSuccess(
        response.data.message || "Complaint status updated successfully.",
      );

      // Bring success message into view
      scrollToMessage();
    } catch (err) {
      console.error("Update Status Error:", err);

      setError(
        err.response?.data?.message || "Unable to update complaint status.",
      );

      // Restore original status if update failed
      setStatus(complaint.status);

      // Bring error message into view
      scrollToMessage();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-slate-400">Loading complaint...</div>
      </DashboardLayout>
    );
  }

  if (error && !complaint) {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <button
            onClick={() => navigate("/worker")}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!complaint) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/worker")}
          className="text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Complaint Details</h1>

          <p className="text-slate-400 mt-2">
            Review the complaint and update its status.
          </p>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div ref={messageRef}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
                {error}
              </div>
            )}

            {success && !error && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-lg">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Complaint Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">Complaint</p>

                <h2 className="text-2xl font-bold text-white">
                  {complaint.title}
                </h2>
              </div>

              <span className="px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {complaint.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">
                Description
              </p>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-200 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Citizen */}
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">
                Submitted By
              </p>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-white font-medium">
                  {complaint.createdBy?.name || "Unknown"}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  {complaint.createdBy?.email || ""}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400">Submitted</p>

                <p className="text-white mt-1">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400">Last Updated</p>

                <p className="text-white mt-1">
                  {new Date(complaint.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Update Status
            </h3>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                disabled={updating}
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>

                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === complaint.status}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>

            {updating && (
              <p className="text-sm text-blue-400 mt-3">
                Updating complaint status...
              </p>
            )}

            {!updating && status === complaint.status && (
              <p className="text-sm text-slate-500 mt-3">
                Select a different status to update the complaint.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WorkerComplaintDetails;
