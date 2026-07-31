import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function CreateComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Electricity",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
if (!formData.title.trim()) {
  setError("Please enter a complaint title.");
  return;
}

if (formData.title.trim().length < 4) {
  setError("Complaint title must be at least 4 characters.");
  return;
}

    if (!formData.description.trim()) {
      setError("Please describe your complaint.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/complaints", {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
      });

      console.log(response.data);

      setSuccess("Complaint submitted successfully!");

      // Wait briefly so the user can see the success message
      setTimeout(() => {
        navigate("/citizen/complaints");
      }, 1000);
    } catch (err) {
      console.error("Create Complaint Error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to create a complaint.");
      } else {
        setError("Unable to submit complaint. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create Complaint</h1>

          <p className="text-slate-400 mt-2">
            Report an issue in your area and help make your city better.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Complaint Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Street light not working"
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />

              <p className="text-xs text-slate-500 mt-2">
                Title must be at least 4 characters.
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="Electricity">Electricity</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Garbage">Garbage</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Description
              </label>

              <textarea
                id="description"
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem in detail..."
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 outline-none resize-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />

              <p className="text-xs text-slate-500 mt-2">
                Please provide enough detail to help the authorities understand
                the issue.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/citizen/complaints")}
                disabled={loading}
                className="px-5 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateComplaint;
