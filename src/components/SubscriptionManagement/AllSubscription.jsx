// src/components/SubscriptionManagement/AllSubscription.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, Edit2, Trash2, X } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast"; // ← ONLY THIS LINE ADDED

export default function AllSubscription() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState({});
  const [autoRenew, setAutoRenew] = useState(false);
  const [cancelAfterGrace, setCancelAfterGrace] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch plans
 const hasFetched = useRef(false);

useEffect(() => {
  if (!hasFetched.current) {
    fetchPlans();
    hasFetched.current = true;
  }
}, []);

  async function fetchPlans() {
    const toastId = toast.loading("Loading subscription plans...");
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/plans");
      setPlans(res.data || []);
      toast.success("Plans loaded successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to load plans", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // DELETE PLAN
  async function handleDelete(id) {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p>Are you sure you want to delete this plan?</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  }

  async function performDelete(id) {
    const toastId = toast.loading("Deleting plan...");
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/api/plans/${id}`);
      setPlans(prev => prev.filter(p => p._id !== id));
      toast.success("Plan deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || "Try again"), { id: toastId });
    } finally {
      setDeletingId(null);
    }
  }

  // OPEN EDIT MODAL
  function openEdit(plan) {
    setEditingPlan(plan);
    setForm({
      planName: plan.planName || "",
      price: plan.price || "",
      duration: plan.duration || "",
      maxBooks: plan.maxBooks || "",
      gracePeriod: plan.gracePeriod || "",
      retryAttempts: plan.retryAttempts || "1",
      description: plan.description || "",
      longDescription: plan.longDescription || "",
      status: plan.isActive ? "Active" : "Inactive",
    });
    setAutoRenew(plan.autoRenew || false);
    setCancelAfterGrace(plan.cancelAfterGrace || false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // SAVE EDIT
  async function handleSave() {
    if (!editingPlan) return;

    const toastId = toast.loading("Saving changes...");
    setSaving(true);

    const payload = {
      planName: form.planName,
      price: parseFloat(form.price) || 0,
      duration: form.duration || "1 Month",
      maxBooks: parseInt(form.maxBooks) || 0,
      retryAttempts: parseInt(form.retryAttempts) || 1,
      gracePeriod: parseInt(form.gracePeriod) || 0,
      description: form.description,
      longDescription: form.longDescription,
      status: form.status,
      autoRenew,
      cancelAfterGrace,
      isActive: form.status === "Active",
    };

    try {
      const res = await axiosInstance.patch(`/api/plans/${editingPlan._id}`, payload);
      setPlans(prev => prev.map(p => p._id === editingPlan._id ? { ...p, ...res.data } : p));
      toast.success("Plan updated successfully!", { id: toastId });
      setEditingPlan(null);
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || "Try again"), { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  // Filter
  const filteredPlans = plans.filter(p =>
    p.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.planId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
        Subscription Plans
      </h2>
      <p className="text-gray-500 mb-6">
        Manage and view all available subscription plans in the system.
      </p>

      {/* Desktop Table */}
      <div className="bg-white border border-[#E0DDDD] rounded-xl p-4 md:p-6 hidden md:block">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading plans...</p>
        ) : filteredPlans.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No plans found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="text-[#1F1E1E]">
                <tr className="border-b border-[#E0DDDD]">
                  {["Plan ID", "Plan Name", "Duration", "Books Allowed", "Price", "Status", "Created On", "Action"].map((title) => (
                    <th key={title} className="px-4 py-3 text-left font-bold whitespace-nowrap">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan._id} className="border-b border-[#E0DDDD] hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-[#2a2828] whitespace-nowrap">
                      {plan.planId}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                      {plan.planName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{plan.duration}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{plan.maxBooks} Books</td>
                    <td className="px-4 py-3 whitespace-nowrap">${plan.price.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-4 py-2 text-xs font-medium rounded-full ${plan.isActive ? "bg-[#CAF9DB] text-[#166534]" : "bg-[#FFF0F0] text-[#A70909]"}`}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-blue-600" title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => openEdit(plan)} className="text-gray-600 hover:text-green-600" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          disabled={deletingId === plan._id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === plan._id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : filteredPlans.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No plans found.</p>
        ) : (
          filteredPlans.map((plan) => (
            <div key={plan._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{plan.planName}</div>
                  <div className="text-xs text-gray-500 font-mono">{plan.planId}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${plan.isActive ? "bg-[#CAF9DB] text-[#166534]" : "bg-[#FFF0F0] text-[#A70909]"}`}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Duration:</strong> {plan.duration}</div>
                <div><strong>Books:</strong> {plan.maxBooks}</div>
                <div><strong>Price:</strong> ${plan.price.toFixed(2)}</div>
                <div><strong>Created:</strong> {new Date(plan.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-4 flex gap-4">
                <button className="text-gray-600 hover:text-blue-600"><Eye size={18} /></button>
                <button onClick={() => openEdit(plan)} className="text-gray-600 hover:text-green-600"><Edit2 size={18} /></button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  disabled={deletingId === plan._id}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {deletingId === plan._id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingPlan && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[100vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 ">
        <h3 className="text-2xl font-semibold text-[#1F1E1E]">
          Edit Subscription Plan
        </h3>
        <button
          onClick={() => setEditingPlan(null)}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X size={26} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 space-y-2">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <label className="block text-sm font-bold mb-2">
              Plan Name
            </label>
            <input
              name="planName"
              value={form.planName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
              placeholder="Enter plan name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
              placeholder="Enter price"
            />
          </div>
        </div>

        {/* Duration + Max Books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <label className="block text-sm font-bold mb-2">
              Duration
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 1 Month"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Max Books Allowed
            </label>
            <input
              name="maxBooks"
              type="number"
              value={form.maxBooks}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            />
          </div>
        </div>

        {/* Retry + Grace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <label className="block text-sm font-bold mb-2">
              Retry Attempts
            </label>
            <select
              name="retryAttempts"
              value={form.retryAttempts}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Grace Period (Days)
            </label>
            <input
              name="gracePeriod"
              type="number"
              value={form.gracePeriod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Short Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={1}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            placeholder="Enter short summary of the plan"
          />
        </div>

        {/* Long Description (TinyMCE)  */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Long Description (Features)
            </label>
            <div className="border border-[#E0DDDD] rounded-md overflow-hidden">
              <Editor
                apiKey="zhpffn2rq4yoy8kkmyu9zmnixtgnckgczc5cffw5s0ik5w8s"
                value={form.longDescription}
                onEditorChange={(content) =>
            setForm((prev) => ({ ...prev, longDescription: content }))
                }
                init={{
            height: 200, // Reduced from 300 to 200
            menubar: true,
            plugins:
              "lists link code advlist autolink image charmap preview anchor searchreplace visualblocks fullscreen insertdatetime media table paste help wordcount",
            toolbar:
              "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | removeformat | code",
            content_style:
              "body { font-family:Arial,sans-serif; font-size:14px; color:#4B5563 }",
                }}
              />
            </div>
          </div>

          {/* Status Toggle */}
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <span className="font-bold mr-3">Status:</span>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  status: prev.status === "Active" ? "Inactive" : "Active",
                }))
              }
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                form.status === "Active" ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all ${
                  form.status === "Active" ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="ml-3 font-medium">{form.status}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-2  rounded-b-2xl">
        <button
          onClick={() => setEditingPlan(null)}
          className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-1 bg-[#1F1E1E] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition font-medium"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}