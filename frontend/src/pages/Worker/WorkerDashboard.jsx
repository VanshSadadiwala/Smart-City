import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function WorkerDashboard() {
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
      console.error("Fetch Worker Complaints Error:", err);

      setError(
        err.response?.data?.message || "Unable to load assigned complaints.",
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Worker Dashboard</h1>

          <p className="text-slate-400 mt-2">
            View and manage complaints assigned to you.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total Assigned</p>

            <p className="text-3xl font-bold text-white mt-2">
              {complaints.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">In Progress</p>

            <p className="text-3xl font-bold text-blue-400 mt-2">
              {
                complaints.filter(
                  (complaint) => complaint.status === "In Progress",
                ).length
              }
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Completed</p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {
                complaints.filter(
                  (complaint) => complaint.status === "Completed",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Complaints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Assigned Complaints
            </h2>
          </div>

          {loading ? (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
              <p className="text-slate-400">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
              <p className="text-slate-400">
                No complaints have been assigned to you.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                        Complaint
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                        Submitted
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {complaints.map((complaint) => (
                      <tr
                        key={complaint._id}
                        className="border-t border-slate-700 hover:bg-slate-800/60 transition"
                      >
                        <td className="px-6 py-5">
                          <Link
                            to={`/worker/complaints/${complaint._id}`}
                            className="font-medium text-white hover:text-blue-400 transition"
                          >
                            {complaint.title}
                          </Link>

                          <p className="text-sm text-slate-500 mt-1">
                            ID: {complaint._id.slice(-8)}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {complaint.category}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              complaint.status,
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WorkerDashboard;
