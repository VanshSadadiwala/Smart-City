import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");

      setComplaints(response.data.complaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "In Progress":
        return "bg-blue-500/20 text-blue-400";

      case "Resolved":
      case "Completed":
        return "bg-green-500/20 text-green-400";

      default:
        return "bg-slate-700 text-white";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Complaints</h1>

          <p className="text-slate-400 mt-2">
            Track all complaints you've submitted.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading complaints...
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No complaints found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="border-t border-slate-700 hover:bg-slate-800"
                  >
                    <td className="px-6 py-4">{complaint.title}</td>

                    <td className="px-6 py-4">{complaint.category}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${badgeColor(
                          complaint.status,
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyComplaints;
