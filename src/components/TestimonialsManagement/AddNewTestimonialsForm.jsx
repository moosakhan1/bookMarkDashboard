// src/components/TestimonialManagement/AddNewTestimonial.jsx
"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AddNewTestimonial() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
    type: "customer",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ← NEW: Track form submit

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();

      if (cloudData.secure_url) {
        setForm((prev) => ({ ...prev, imageUrl: cloudData.secure_url }));
        setImagePreview(cloudData.secure_url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Upload failed. Try again.", { id: toastId });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  function handleSave(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const toastId = toast.loading("Creating testimonial...");

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      rating: Number(form.rating),
      type: form.type,
      imageUrl: form.imageUrl || "/default-avatar.png",
      isActive: true,
    };

    axiosInstance
      .post("/api/testimonials", payload)
      .then((res) => {
        toast.success("Testimonial created successfully!", { id: toastId });
        setForm({
          name: "",
          role: "",
          quote: "",
          rating: 5,
          type: "customer",
          imageUrl: "",
        });
        setImagePreview("");
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Failed to save testimonial";
        toast.error(message, { id: toastId });
        console.error("Error:", err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
        Add New Testimonial
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Add customer or professional testimonials to build trust.
      </p>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E0DDDD] rounded-lg p-4 sm:p-6 space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label className="block text-base font-bold text-black mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  unoptimized // ← FIXES THE WARNING
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-xs">No image</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EEFF00] file:text-black hover:file:bg-yellow-400 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 200x200px, PNG/JPG
              </p>
            </div>
          </div>
        </div>

        {/* Name + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-bold text-black mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. James Pattinson"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-base font-bold text-black mb-2">
              Role / Title
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Book Lover"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-base font-bold text-black mb-2">
            Rating
          </label>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Testimonial Type */}
        <div>
          <label className="block text-base font-bold text-black mb-2">
            Testimonial Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="customer"
                checked={form.type === "customer"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Happy Customer</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="professional"
                checked={form.type === "professional"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                Professional Recommendation
              </span>
            </label>
          </div>
        </div>

        {/* Quote */}
        <div>
          <label className="block text-base font-bold text-black mb-2">
            Testimonial Quote
          </label>
          <textarea
            name="quote"
            value={form.quote}
            onChange={handleChange}
            rows={4}
            placeholder="Write the full customer quote here..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="inline-flex items-center gap-2 rounded-md bg-[#1F1E1E] text-white px-6 py-3 text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : uploading ? "Uploading..." : "Save Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}