import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.name;

  const dashboardPath = `/${role}`;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `px-5 py-4 transition ${
      isActive
        ? "bg-slate-700 text-white font-semibold border-l-4 border-blue-500"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 text-xl font-bold border-b border-slate-700">
        Smart City
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1">
        {/* Dashboard */}
        <NavLink to={dashboardPath} end className={navClass}>
          Dashboard
        </NavLink>

        {/* ================= Citizen ================= */}
        {role === "citizen" && (
          <>
            <NavLink to="/citizen/create" className={navClass}>
              Create Complaint
            </NavLink>

            <NavLink to="/citizen/complaints" end className={navClass}>
              My Complaints
            </NavLink>
          </>
        )}

        {/* ================= Worker ================= */}
        {role === "worker" && (
          <div className="px-5 py-4 text-sm text-slate-400">
            Assigned complaints are shown on your dashboard.
          </div>
        )}

        {/* ================= Officer ================= */}
        {role === "officer" && (
          <div className="px-5 py-4 text-sm text-slate-400">
            All complaints are managed from your dashboard.
          </div>
        )}

        {/* Admin Navigation */}
        {role === "admin" && (
          <>
            <NavLink to="/admin/complaints" className={navClass}>
              Manage Complaints
            </NavLink>

            <NavLink to="/admin/staff" className={navClass}>
              Staff Management
            </NavLink>
          </>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto text-left px-5 py-4 text-slate-300 hover:bg-red-600 hover:text-white transition border-t border-slate-700"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
