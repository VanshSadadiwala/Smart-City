import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
