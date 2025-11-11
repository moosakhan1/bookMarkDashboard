// src/components/SubscriptionManagement/AddNewSubscription.jsx
"use client";
import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast"; // ← ONLY THIS LINE ADDED

export default function AddNewSubscription() {
  const [form, setForm] = useState({
    planName: "",
    price: "",
    duration: "",
    maxBooks: "",
    gracePeriod: "",
    retryAttempts: "1",
    description: "",
    longDescription: "",
    status: "Active",
  });

  const [autoRenew, setAutoRenew] = useState(false);
  const [cancelAfterGrace, setCancelAfterGrace] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ← ONLY THIS LINE ADDED

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    if (submitting) return; // prevent double click

    const toastId = toast.loading("Creating subscription plan..."); // ← TOAST START
    setSubmitting(true);

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

    axiosInstance
      .post("/api/plans", payload)
      .then((res) => {
        toast.success("Subscription plan created successfully!", { id: toastId }); // ← TOAST SUCCESS
        setForm({
          planName: "",
          price: "",
          duration: "1 Month",
          maxBooks: "",
          gracePeriod: "",
          retryAttempts: "1",
          description: "",
          longDescription: "",
          status: "Active",
        });
        setAutoRenew(false);
        setCancelAfterGrace(false);
      })
      .catch((err) => {
        console.error("Error creating plan:", err.response?.data || err.message);
        toast.error("Failed: " + (err.response?.data?.message || "Something went wrong"), { id: toastId }); // ← TOAST ERROR
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
        Add New Subscription
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Create and manage your book subscription plans with flexible options.
      </p>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E0DDDD] rounded-lg p-4 sm:p-6"
      >
        <div className="grid grid-cols-1">
          <div className="lg:col-span-2">
            {/* Plan Name + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="planName"
                  value={form.planName}
                  onChange={handleChange}
                  placeholder="Enter plan name"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price for this plan"
                  step="0.01"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [appearance:textfield]"
                  required
                />
              </div>
            </div>

            {/* Duration + Max Books Allowed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Enter duration (e.g., 1 Month, 3 Weeks or 30days 12hours)"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Max Books Allowed
                </label>
                <input
                  name="maxBooks"
                  type="number"
                  value={form.maxBooks}
                  onChange={handleChange}
                  placeholder="E.g. 4 books"
                  className="focus blessed:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Retry Attempts + Grace Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Retry Attempts for Failed Payments
                </label>
                <select
                  name="retryAttempts"
                  value={form.retryAttempts}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-black mb-2">
                  Grace Period (Days)
                </label>
                <input
                  name="gracePeriod"
                  type="number"
                  value={form.gracePeriod}
                  onChange={handleChange}
                  placeholder="E.g., 3 days"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="mt-4">
              <label className="block text-base font-bold text-black mb-2">
                Short Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief summary of what this plan includes."
                className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Long Description */}
            <div className="mt-4">
              <label className="block text-base font-bold text-black mb-2">
                Long Description Features (List main benefits)
              </label>
              <div className="border border-[#E0DDDD] rounded-md focus-within:ring-2 focus-within:ring-[#737373] text-gray-600">
                <Editor
                  apiKey="zhpffn2rq4yoy8kkmyu9zmnixtgnckgczc5cffw5s0ik5w8s"
                  value={form.longDescription}
                  onEditorChange={(content) =>
                    setForm((prev) => ({ ...prev, longDescription: content }))
                  }
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      "lists",
                      "link",
                      "code",
                      "advlist",
                      "autolink",
                      "image",
                      "charmap",
                      "print",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "paste",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist | outdent indent | removeformat | code",
                    content_style:
                      "body { font-family:Arial,sans-serif; font-size:14px; color:#4B5563 }",
                  }}
                />
              </div>
            </div>

            {/* Status + Toggles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
              <div className="flex items-center justify-between rounded-lg px-4 py-3 border border-[#E0DDDD]">
                <div>
                  <p className="text-base font-bold text-black mb-2">Status</p>
                  <p className="text-xs text-gray-500">
                    Select whether this plan is active or inactive.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      status: prev.status === "Active" ? "Inactive" : "Active",
                    }))
                  }
                  className={`w-10 h-5 flex items-center rounded-full p-1 transition-all 
      ${form.status === "Active" ? "bg-black" : "bg-gray-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all 
        ${form.status === "Active" ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            {/* Save */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-[#1F1E1E] text-white px-5 py-3 text-sm hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Subscription"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}