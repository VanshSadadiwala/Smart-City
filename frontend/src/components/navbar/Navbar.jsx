import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="h-16 bg-slate-900 border-b flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-blue-600">Smart City</h1>

      <div className="text-right">
        <p className="font-semibold">{user?.name}</p>

        <p className="text-sm text-gray-500 capitalize">{user?.role?.name}</p>
      </div>
    </nav>
  );
}

export default Navbar;
