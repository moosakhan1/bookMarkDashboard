// src/components/BookManagement/CategoryManagement.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // FIXED: NO DOUBLE TOAST — REACT 18 PROOF
  useEffect(() => {
    let isMounted = true;
    let toastId = null;

    async function fetchCategories() {
      if (!isMounted) return;

      // Only show toast once
      if (!toastId) {
        toastId = toast.loading("Loading categories...");
      }

      try {
        setFetching(true);
        const res = await axiosInstance.get("/api/admin/categories");

        if (isMounted) {
          setCategories(res.data || []);
          if (toastId) {
            toast.success("Categories loaded", { id: toastId });
            toastId = null; // Prevent double success
          }
        }
      } catch (err) {
        if (isMounted && toastId) {
          toast.error("Failed to load categories", { id: toastId });
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
      if (toastId) toast.dismiss(toastId);
    };
  }, []); // ← EMPTY = RUN ONCE

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    const toastId = toast.loading(editingId ? "Updating category..." : "Adding category...");
    setLoading(true);
    try {
      if (editingId) {
        await axiosInstance.patch(`/api/admin/categories/${editingId}`, {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        toast.success("Category updated successfully!", { id: toastId });
      } else {
        await axiosInstance.post("/api/admin/categories", {
          name: form.name.trim(),
          description: form.description.trim(),
        });
        toast.success("Category added successfully!", { id: toastId });
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      // Re-fetch silently (no toast)
      const res = await axiosInstance.get("/api/admin/categories");
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.message || err.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(cat) {
    setForm({ 
      name: cat.name, 
      description: cat.description || "" 
    });
    setEditingId(cat._id);
    toast.success("Edit mode activated", { duration: 1500 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-medium">Delete this category?</p>
        <p className="text-sm text-gray-600">Books using it will keep their category name.</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 12000 });
  }

  async function performDelete(id) {
    const toastId = toast.loading("Deleting category...");
    try {
      await axiosInstance.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted!", { id: toastId });
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || "Try again"), { id: toastId });
    }
  }

  function cancelEdit() {
    setForm({ name: "", description: "" });
    setEditingId(null);
    toast.success("Edit cancelled", { duration: 1500 });
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
        Category Management
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Add, edit, or remove book categories. Used to organize your library.
      </p>

      {/* ADD / EDIT FORM */}
      <div className="bg-white border border-[#E0DDDD] rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-black mb-5 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit2 size={20} className="text-blue-600" />
              Edit Category
            </>
          ) : (
            <>
              Add New Category
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base font-bold text-black mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Science Fiction"
              className="w-full rounded-lg border border-[#E0DDDD] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#737373] transition"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-black mb-2">
              Description <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of what this category includes..."
              className="w-full rounded-lg border border-[#E0DDDD] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#737373] transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F1E1E] text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition font-medium flex items-center gap-2"
            >
              {loading ? (
                <>Saving...</>
              ) : editingId ? (
                <>Update Category</>
              ) : (
                <>Add Category</>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* CATEGORIES LIST */}
      <div className="bg-white border border-[#E0DDDD] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-black mb-6">
          All Categories ({categories.length})
        </h2>

        {fetching ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#1F1E1E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-3">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            No categories yet. Add your first one above!
          </p>
        ) : (
          <div className="grid gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[#E0DDDD] rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#1F1E1E] capitalize">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{cat.description}"
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Created {new Date(cat.createdAt).toLocaleDateString()}</span>
                    {cat.updatedAt !== cat.createdAt && (
                      <span>• Updated {new Date(cat.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}