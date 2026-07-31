import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/complaints/${id}`);

      setComplaint(response.data.complaint);
    } catch (err) {
      console.error("Fetch Complaint Error:", err);

      setError(
        err.response?.data?.message || "Unable to load complaint details.",
      );
    } finally {
      setLoading(false);
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
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
          <p className="text-slate-400">Loading complaint...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Link
            to="/citizen/complaints"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to My Complaints
          </Link>

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
        <Link
          to="/citizen/complaints"
          className="inline-block text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to My Complaints
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Complaint Details</h1>

          <p className="text-slate-400 mt-2">
            View information and current status of your complaint.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-2">Complaint Title</p>

              <h2 className="text-2xl font-bold text-white">
                {complaint.title}
              </h2>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${getStatusStyle(
                complaint.status,
              )}`}
            >
              {complaint.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-sm text-slate-500">Category</p>

              <p className="text-white font-medium mt-1">
                {complaint.category}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-sm text-slate-500">Submitted</p>

              <p className="text-white font-medium mt-1">
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-sm text-slate-500 mb-2">Description</p>

            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Assigned Worker</p>

            <div className="bg-slate-800 rounded-lg p-5">
              {complaint.assignedTo ? (
                <>
                  <p className="text-white font-medium">
                    {complaint.assignedTo.name}
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    {complaint.assignedTo.email}
                  </p>
                </>
              ) : (
                <p className="text-slate-400">Not assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ComplaintDetails;
  