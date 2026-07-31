import { useRef, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminStaff() {
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
  });

  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffSuccess, setStaffSuccess] = useState("");
  const [staffError, setStaffError] = useState("");

  const staffMessageRef = useRef(null);

  const handleStaffChange = (e) => {
    const { name, value } = e.target;

    setStaffData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStaffSuccess("");
    setStaffError("");
  };

  const scrollToMessage = () => {
    setTimeout(() => {
      staffMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const createStaff = async (e) => {
    e.preventDefault();

    setStaffSuccess("");
    setStaffError("");

    if (
      !staffData.name.trim() ||
      !staffData.email.trim() ||
      !staffData.password
    ) {
      setStaffError("Please fill in all fields.");
      scrollToMessage();
      return;
    }

    if (staffData.password.length < 6) {
      setStaffError("Password must be at least 6 characters long.");
      scrollToMessage();
      return;
    }

    try {
      setCreatingStaff(true);

      const response = await api.post("/users/staff", {
        name: staffData.name.trim(),
        email: staffData.email.trim(),
        password: staffData.password,
        role: staffData.role,
      });

      setStaffSuccess(
        response.data.message ||
          `${staffData.role} account created successfully.`,
      );

      setStaffData({
        name: "",
        email: "",
        password: "",
        role: "worker",
      });

      scrollToMessage();
    } catch (err) {
      console.error("Create Staff Error:", err);

      setStaffError(
        err.response?.data?.message || "Unable to create staff account.",
      );

      scrollToMessage();
    } finally {
      setCreatingStaff(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Management</h1>

          <p className="text-slate-400 mt-2">
            Create accounts for workers and officers.
          </p>
        </div>

        {/* Staff Form */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Create Staff Account
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Only administrators can create staff accounts.
            </p>
          </div>

          <form onSubmit={createStaff} className="p-6 space-y-5">
            {/* Message */}
            {(staffSuccess || staffError) && (
              <div ref={staffMessageRef}>
                {staffSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-lg">
                    {staffSuccess}
                  </div>
                )}

                {staffError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-lg">
                    {staffError}
                  </div>
                )}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={staffData.name}
                onChange={handleStaffChange}
                placeholder="Enter staff member name"
                disabled={creatingStaff}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={staffData.email}
                onChange={handleStaffChange}
                placeholder="Enter staff member email"
                disabled={creatingStaff}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={staffData.password}
                onChange={handleStaffChange}
                placeholder="Create a password"
                disabled={creatingStaff}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Staff Role
              </label>

              <select
                name="role"
                value={staffData.role}
                onChange={handleStaffChange}
                disabled={creatingStaff}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="worker">Worker</option>
                <option value="officer">Officer</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creatingStaff}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingStaff ? "Creating..." : "Create Staff Account"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminStaff;
