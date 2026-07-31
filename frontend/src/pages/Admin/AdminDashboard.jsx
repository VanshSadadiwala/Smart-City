import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints");

      setComplaints(response.data.complaints || []);
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err.response?.data?.message || "Unable to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending",
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress",
  ).length;

  const completedComplaints = complaints.filter(
    (complaint) => complaint.status === "Completed",
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

          <p className="text-slate-400 mt-2">
            Overview of the Smart City complaint management system.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistics */}
        {loading ? (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
            <p className="text-slate-400">Loading statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Total */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Total Complaints</p>

              <p className="text-3xl font-bold text-white mt-2">
                {totalComplaints}
              </p>
            </div>

            {/* Pending */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Pending</p>

              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {pendingComplaints}
              </p>
            </div>

            {/* In Progress */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">In Progress</p>

              <p className="text-3xl font-bold text-blue-400 mt-2">
                {inProgressComplaints}
              </p>
            </div>

            {/* Completed */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Completed</p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                {completedComplaints}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
