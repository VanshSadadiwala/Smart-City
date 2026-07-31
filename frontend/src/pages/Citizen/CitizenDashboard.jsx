import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function CitizenDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Here's an overview of your complaints.
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400">Total Complaints</p>
            <h2 className="text-4xl font-bold mt-3">5</h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-yellow-600">
            <p className="text-yellow-400">Pending</p>
            <h2 className="text-4xl font-bold mt-3">2</h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-blue-600">
            <p className="text-blue-400">In Progress</p>
            <h2 className="text-4xl font-bold mt-3">1</h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-green-600">
            <p className="text-green-400">Completed</p>
            <h2 className="text-4xl font-bold mt-3">2</h2>
          </div>

        </div>

        {/* Quick Actions */}

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

          <h2 className="text-xl font-semibold mb-5">
            Quick Actions
          </h2>

          <div className="flex gap-4">

            <Link
              to="/citizen/create"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg"
            >
              + Create Complaint
            </Link>

            <Link
              to="/citizen/complaints"
              className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-lg"
            >
              My Complaints
            </Link>

          </div>

        </div>

        {/* Recent Complaints */}

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">

          <h2 className="text-xl font-semibold mb-5">
            Recent Complaints
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span>Broken Street Light</span>
              <span className="text-yellow-400">Pending</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span>Water Leakage</span>
              <span className="text-green-400">Completed</span>
            </div>

            <div className="flex justify-between">
              <span>Garbage Collection</span>
              <span className="text-blue-400">In Progress</span>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default CitizenDashboard;