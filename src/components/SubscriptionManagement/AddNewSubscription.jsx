"use client";

import React, { useState, useRef } from "react";

const languages = ["English", "Spanish", "French", "German"];
const years = Array.from({ length: 30 }).map((_, i) => `${2025 - i}`);
const categories = ["Fiction", "Non-Fiction", "Science", "History"];

export default function AddNewSubscription() {
  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    category: "",
    language: "English",
    publisher: "",
    year: "2025",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
   const [autoRenew, setAutoRenew] = useState(false);
  const [cancelAfterGrace, setCancelAfterGrace] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFilePick(e) {
    const f = e.target.files?.[0];
    if (f) setFile(Object.assign(f, { preview: URL.createObjectURL(f) }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(Object.assign(f, { preview: URL.createObjectURL(f) }));
  }

  function handleSave(e) {
    e.preventDefault();
    console.log("Saving book", form, file);
    // alert("Saved (demo)");
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
        Add New Subscription
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E0DDDD] rounded-lg p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Plan ID
                </label>
                <input
                  name="id"
                  value={form.id}
                  placeholder="PLAN-00123"
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Plan Name
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Premium Yearly Plan"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Duration
                </label>
                <select className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm">
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Duration
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white"
                >
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  placeholder="E.g., 3 (after failed payment before suspension)"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Retry Attempts for Failed Payments
                </label>
                <select className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief summary of what this plan includes — e.g., “Access to 3 books per month with auto-renewal.”"
                className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full  rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
              />
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {/* Auto Renewal */}
            <div className="flex items-center justify-between  rounded-lg px-4 py-3">
              <div>
                <p className="font-medium text-sm">Auto Renewal</p>
                <p className="text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <button
                onClick={() => setAutoRenew(!autoRenew)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  autoRenew ? "bg-black" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                    autoRenew ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {/* Cancel After Grace */}
            <div className="flex items-center justify-between  rounded-lg px-4 py-3">
              <div>
                <p className="font-medium text-sm">
                  Cancel Plan Automatically After Grace Period
                </p>
                <p className="text-xs text-gray-500">
                  If ON, plan cancels when grace period expires
                </p>
              </div>
              <button
                onClick={() => setCancelAfterGrace(!cancelAfterGrace)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  cancelAfterGrace ? "bg-black" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                    cancelAfterGrace ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
         <div className="mt-6">
           <button
             type="submit"
             className="inline-flex items-center gap-2 rounded-md bg-[#1F1E1E] text-white px-5 py-3 text-sm hover:bg-gray-800 transition"
           >
             Save Book
           </button>
         </div>
       </div>
       <div className="mt-6 lg:mt-0">
         <div className="flex flex-col">
           <label className="text-sm font-medium mb-1">Status</label>
           <select className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white">
             <option>Active</option>
             <option>Inactive</option>
           </select>
         </div>
         <div className="flex flex-col">
           <label className="text-sm font-medium mb-1">Status</label>
           <select className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white">
             <option>Active</option>
             <option>Inactive</option>
           </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}