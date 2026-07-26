import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">
      <div className="p-5 text-xl font-bold border-b">Dashboard</div>

      <nav className="flex flex-col">
        <NavLink to="#" className="px-5 py-3 hover:bg-slate-700">
          Home
        </NavLink>

        <NavLink to="#" className="px-5 py-3 hover:bg-slate-700">
          Complaints
        </NavLink>

        <button
          onClick={handleLogout}
          className="text-left px-5 py-3 hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
