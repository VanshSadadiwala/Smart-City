import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import OfficerDashboard from "./pages/Officer/OfficerDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
