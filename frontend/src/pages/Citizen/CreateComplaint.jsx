import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";


function CreateComplaint() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Electricity",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
        alert("Please fill all required fields.");
        return;
    }
    try {
      const response = await api.post("/complaints", formData);

      alert("Complaint submitted successfully!");

      console.log(response.data);

      navigate("/citizen/complaints");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white mb-2">
            📝 Create Complaint
          </h1>

          <p className="text-slate-400 mb-8">
            Fill in the details below to submit a new complaint.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Complaint Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter complaint title"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Electricity</option>
                <option>Road</option>
                <option>Water</option>
                <option>Garbage</option>
                <option>Drainage</option>
                <option>Other</option>
              </select>
            </div>

            {/* Description */}

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                rows="6"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateComplaint;
