// src/components/TestimonialManagement/AllTestimonialsList.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Star, Eye, Edit2, Trash2, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import toast from "react-hot-toast"; // ← ADDED

export default function AllTestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

const hasFetched = useRef(false);

useEffect(() => {
  if (!hasFetched.current) {
    fetchTestimonials();
    hasFetched.current = true;
  }
}, []);

  async function fetchTestimonials() {
    const toastId = toast.loading("Loading testimonials...");
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/testimonials");
      setTestimonials(res.data || []);
      toast.success("Testimonials loaded", { id: toastId });
    } catch (err) {
      toast.error("Failed to load testimonials", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // DELETE
  async function handleDelete(id) {
    // if (!toast.loading("Deleting testimonial...")) return;
    const confirmToast = toast(
      (t) => (
        <div className="flex items-center gap-4">
          <span>Delete this testimonial?</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(id);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded text-sm"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  }

  async function performDelete(id) {
    const toastId = toast.loading("Deleting...");
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/api/testimonials/${id}`);
      setTestimonials(prev => prev.filter(t => t._id !== id));
      toast.success("Deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  }

  // OPEN EDIT
  function openEdit(t) {
    setEditingTestimonial(t);
    setForm({
      name: t.name || t.authorName || "",
      role: t.role || t.authorTitle || "",
      quote: t.quote || t.content || "",
      rating: t.rating || 5,
      type: t.type || "customer",
      isActive: t.isActive ?? true,
    });
    setImagePreview(t.imageUrl || t.avatarUrl || "");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  // IMAGE UPLOAD
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "testimonials_upload");
      data.append("cloud_name", "dwbsdqaml");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dwbsdqaml/image/upload`,
        { method: "POST", body: data }
      );

      const cloudData = await res.json();

      if (cloudData.secure_url) {
        setForm(prev => ({ ...prev, imageUrl: cloudData.secure_url }));
        setImagePreview(cloudData.secure_url);
        toast.success("Image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Image upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // SAVE EDIT
  async function handleSave() {
    if (!editingTestimonial) return;

    const toastId = toast.loading("Saving changes...");
    setUploading(true);

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      rating: Number(form.rating),
      type: form.type,
      imageUrl: form.imageUrl || imagePreview || "/default-avatar.jpg",
      isActive: form.isActive,
    };

    try {
      const res = await axiosInstance.patch(`/api/testimonials/${editingTestimonial._id}`, payload);
      setTestimonials(prev => prev.map(t => t._id === editingTestimonial._id ? { ...t, ...res.data } : t));
      toast.success("Updated successfully!", { id: toastId });
      setEditingTestimonial(null);
      setImagePreview("");
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || "Try again"), { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  const filtered = testimonials.filter((t) => {
    const name = (t.name || t.authorName || "").toLowerCase();
    const role = (t.role || t.authorTitle || "").toLowerCase();
    const quote = (t.quote || t.content || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || role.includes(term) || quote.includes(term);
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
    ));
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">All Testimonials</h2>
      <p className="text-gray-500 mb-6">View and manage all customer and professional testimonials.</p>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name, role, or quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white border border-[#E0DDDD] rounded-xl p-4 md:p-6 hidden md:block">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No testimonials found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="text-[#1F1E1E]">
                <tr className="border-b border-[#E0DDDD]">
                  {["Image", "Name", "Role", "Quote", "Rating", "Type", "Date", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id} className="border-b border-[#E0DDDD] hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={t.imageUrl || t.avatarUrl || "/default-avatar.jpg"}
                          alt={t.name || t.authorName}
                          width={48}
                          height={48}
                          unoptimized // ← FIXED WARNING
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1F1E1E] whitespace-nowrap">
                      {t.name || t.authorName || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                      {t.role || t.authorTitle || "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                      {t.quote || t.content || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">{renderStars(t.rating || 0)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${t.type === "professional" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {t.type || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-blue-600" title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => openEdit(t)} className="text-gray-600 hover:text-green-600" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          disabled={deletingId === t._id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === t._id ? (
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
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No testimonials found.</p>
        ) : (
          filtered.map((t) => (
            <div key={t._id} className="border rounded-lg p-4 bg-white shadow-sm flex gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <Image
                  src={t.imageUrl || t.avatarUrl || "/default-avatar.jpg"}
                  alt={t.name || t.authorName}
                  width={64}
                  height={64}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{t.name || t.authorName || "Anonymous"}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${t.type === "professional" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {t.type || "—"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic mb-2 line-clamp-2">"{t.quote || t.content || "No quote"}"</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{t.role || t.authorTitle || "—"}</span>
                  <span>•</span>
                  <div className="flex gap-1">{renderStars(t.rating || 0)}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(t.createdAt).toLocaleDateString()}</div>
                <div className="mt-3 flex items-center gap-4">
                  <button className="text-gray-600 hover:text-blue-600" title="View"><Eye size={18} /></button>
                  <button onClick={() => openEdit(t)} className="text-gray-600 hover:text-green-600" title="Edit"><Edit2 size={18} /></button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    disabled={deletingId === t._id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === t._id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
{editingTestimonial && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[100vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 ">
        <h3 className="text-2xl font-semibold text-[#1F1E1E]">
          Edit Testimonial
        </h3>
        <button
          onClick={() => setEditingTestimonial(null)}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X size={26} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-1">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
            Profile Image
          </label>
          <div className="flex items-center gap-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No image</span>
              )}
            </div>

            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-gray-600 
                           file:mr-4 file:py-3 file:px-6 
                           file:rounded-full file:border-0 
                           file:text-sm file:font-semibold 
                           file:bg-[#EEFF00] file:text-black 
                           hover:file:bg-yellow-400 transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
              Role / Title
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
              placeholder="Enter role or title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            >
              <option value="customer">Happy Customer</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quote */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#1F1E1E]">
            Quote
          </label>
          <textarea
            name="quote"
            value={form.quote}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-200 text-gray-500"
            placeholder="Enter testimonial quote"
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <span className="font-bold mr-3 text-[#1F1E1E]">Status:</span>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
              className={`w-13 h-7 rounded-full p-1 transition-all ${
                form.isActive ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all ${
                  form.isActive ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="ml-3 font-medium text-gray-700">
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 py-3 rounded-b-2xl">
        <button
          onClick={() => setEditingTestimonial(null)}
          className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={uploading}
          className="px-8 py-2 bg-[#1F1E1E] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition font-medium"
        >
          {uploading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}