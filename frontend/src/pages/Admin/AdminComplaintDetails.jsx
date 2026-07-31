import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [workers, setWorkers] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintResponse, workersResponse] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get("/users/workers"),
      ]);

      const complaintData = complaintResponse.data.complaint;

      setComplaint(complaintData);
      setWorkers(workersResponse.data.users || []);

      setSelectedStatus(complaintData.status);

      if (complaintData.assignedTo) {
        setSelectedWorker(complaintData.assignedTo._id);
      }
    } catch (err) {
      console.error("Admin Complaint Details Error:", err);

      setError(
        err.response?.data?.message || "Unable to load complaint details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAssign = async () => {
    if (!selectedWorker) {
      setError("Please select a worker.");
      scrollToTop();
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/complaints/${id}/assign`, {
        workerId: selectedWorker,
      });

      setComplaint(response.data.complaint);

      setSuccess(response.data.message || "Worker assigned successfully.");

      scrollToTop();
    } catch (err) {
      console.error("Assign Worker Error:", err);

      setError(err.response?.data?.message || "Unable to assign worker.");

      scrollToTop();
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setError("Please select a status.");
      scrollToTop();
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/complaints/${id}/status`, {
        status: selectedStatus,
      });

      setComplaint(response.data.complaint);

      setSuccess(
        response.data.message || "Complaint status updated successfully.",
      );

      scrollToTop();
    } catch (err) {
      console.error("Update Status Error:", err);

      setError(
        err.response?.data?.message || "Unable to update complaint status.",
      );

      scrollToTop();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

      case "Completed":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "Rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Loading complaint...</p>
      </DashboardLayout>
    );
  }

  if (!complaint) {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <button
            onClick={() => navigate("/admin")}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
            {error || "Complaint not found."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/admin")}
          className="text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Complaint Details</h1>

          <p className="text-slate-400 mt-2">
            Manage complaint assignment and status.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-lg">
            {success}
          </div>
        )}

        {/* Complaint Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">Complaint</p>

                <h2 className="text-2xl font-bold text-white">
                  {complaint.title}
                </h2>
              </div>

              <div className="flex gap-2 items-start">
                <span className="px-3 py-1 rounded-full text-sm bg-slate-800 text-slate-300 border border-slate-700">
                  {complaint.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                    complaint.status,
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
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

                <p className="text-sm text-slate-400 mt-1">
                  {complaint.createdBy?.email || ""}
                </p>
              </div>
            </div>

            {/* Assigned Worker */}
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">
                Current Worker
              </p>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-white">
                  {complaint.assignedTo?.name || "Not assigned"}
                </p>

                {complaint.assignedTo?.email && (
                  <p className="text-sm text-slate-400 mt-1">
                    {complaint.assignedTo.email}
                  </p>
                )}
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

          {/* Assignment */}
          <div className="border-t border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Assign Worker
            </h3>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={selectedWorker}
                onChange={(e) => {
                  setSelectedWorker(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                disabled={assigning}
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Select Worker</option>

                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssign}
                disabled={assigning || !selectedWorker}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? "Assigning..." : "Assign Worker"}
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Update Status
            </h3>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                disabled={updatingStatus}
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>

                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminComplaintDetails;
