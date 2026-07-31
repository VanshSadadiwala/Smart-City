import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import OfficerDashboard from "./pages/Officer/OfficerDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import AdminComplaints from "./pages/Admin/AdminComplaints";
import AdminStaff from "./pages/Admin/AdminStaff";

import CreateComplaint from "./pages/Citizen/CreateComplaint";
import MyComplaints from "./pages/Citizen/MyComplaints";
import ComplaintDetails from "./pages/Citizen/ComplaintDetails";
import WorkerComplaintDetails from "./pages/Worker/WorkerComplaintDetails";
import OfficerComplaintDetails from "./pages/Officer/OfficerComplaintDetails";
import AdminComplaintDetails from "./pages/Admin/AdminComplaintDetails";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Redirect logged-in users away from Login page
function LoginRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  switch (user.role.name) {
    case "citizen":
      return <Navigate to="/citizen" replace />;

    case "worker":
      return <Navigate to="/worker" replace />;

    case "officer":
      return <Navigate to="/officer" replace />;

    case "admin":
      return <Navigate to="/admin" replace />;

    default:
      return <Login />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginRedirect />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Citizen */}
        {/* Citizen Dashboard */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Complaint */}
        <Route
          path="/citizen/create"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        {/* My Complaints */}
        <Route
          path="/citizen/complaints"
          element={
            <ProtectedRoute allowedRole="citizen">
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* Complaint Details */}
        <Route
          path="/citizen/complaints/:id"
          element={
            <ProtectedRoute allowedRole="citizen">
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Worker */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRole="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/complaints/:id"
          element={
            <ProtectedRoute allowedRole="worker">
              <WorkerComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Officer */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/complaints/:id"
          element={
            <ProtectedRoute allowedRole="officer">
              <OfficerComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminComplaintDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
