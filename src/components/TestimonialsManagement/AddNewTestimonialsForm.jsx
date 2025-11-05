// src/components/TestimonialManagement/AddNewTestimonial.jsx
"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";

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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setForm((prev) => ({ ...prev, imageUrl: preview }));
    setUploading(false);
  };

  function handleSave(e) {
    e.preventDefault();

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
      .then(() => {
        alert("Testimonial created successfully!");
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
        console.error("Error:", err.response?.data || err.message);
        alert("Failed: " + JSON.stringify(err.response?.data));
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
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 text-xs">No image</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EEFF00] file:text-black hover:file:bg-yellow-400"
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
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-md bg-[#1F1E1E] text-white px-6 py-3 text-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Save Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}
