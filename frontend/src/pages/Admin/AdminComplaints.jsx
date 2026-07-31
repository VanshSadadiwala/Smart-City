import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintsResponse, workersResponse] = await Promise.all([
        api.get("/complaints"),
        api.get("/users/workers"),
      ]);

      setComplaints(complaintsResponse.data.complaints || []);

      setWorkers(workersResponse.data.users || []);
    } catch (err) {
      console.error("Admin Complaints Error:", err);

      setError(err.response?.data?.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async (complaintId, workerId) => {
    if (!workerId) return;

    try {
      setAssigning(complaintId);
      setError("");

      await api.put(`/complaints/${complaintId}/assign`, {
        workerId,
      });

      await fetchData();
    } catch (err) {
      console.error("Assign Worker Error:", err);

      setError(err.response?.data?.message || "Unable to assign complaint.");
    } finally {
      setAssigning("");
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
          <h1 className="text-3xl font-bold text-white">Manage Complaints</h1>

          <p className="text-slate-400 mt-2">
            View all complaints and assign them to workers.
          </p>
        </div>

        
        {/* Complaints */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">All Complaints</h2>

            <p className="text-sm text-slate-400 mt-1">
              Assign complaints to available workers.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-slate-400">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-400">No complaints found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Complaint
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Citizen
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Assigned Worker
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-t border-slate-700 hover:bg-slate-800/60 transition"
                    >
                      {/* Complaint */}
                      <td className="px-6 py-5">
                        <Link
                          to={`/admin/complaints/${complaint._id}`}
                          className="font-medium text-white hover:text-blue-400 transition"
                        >
                          {complaint.title}
                        </Link>

                        <p className="text-sm text-slate-500 mt-1">
                          {complaint.description}
                        </p>
                      </td>

                      {/* Citizen */}
                      <td className="px-6 py-5">
                        <p className="text-slate-300">
                          {complaint.createdBy?.name || "Unknown"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {complaint.createdBy?.email || ""}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5 text-slate-300">
                        {complaint.category}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            complaint.status,
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      {/* Worker Assignment */}
                      <td className="px-6 py-5">
                        {complaint.assignedTo ? (
                          <div>
                            <p className="text-white font-medium">
                              {complaint.assignedTo.name}
                            </p>

                            <p className="text-sm text-slate-500">
                              {complaint.assignedTo.email}
                            </p>
                          </div>
                        ) : (
                          <select
                            defaultValue=""
                            disabled={assigning === complaint._id}
                            onChange={(e) =>
                              assignWorker(complaint._id, e.target.value)
                            }
                            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="" disabled hidden>
                              {assigning === complaint._id
                                ? "Assigning..."
                                : "Select Worker"}
                            </option>

                            {workers.map((worker) => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminComplaints;
