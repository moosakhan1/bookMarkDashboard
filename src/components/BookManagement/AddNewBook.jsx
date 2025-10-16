"use client";

import React, { useState, useRef } from "react";

const languages = ["English", "Spanish", "French", "German"];
const years = Array.from({ length: 30 }).map((_, i) => `${2025 - i}`);
const categories = ["Fiction", "Non-Fiction", "Science", "History"];

export default function AddNewBook() {
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
    alert("Saved (demo)");
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">Add New Book</h1>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details below to add a new book to your library.
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
                  Book ID
                </label>
                <input
                  name="id"
                  value={form.id}
                  placeholder="BK-00123"
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Book Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Atomic Habits"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Author Name
                </label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="James Clear"
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Category / Genre
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Publisher
                </label>
                <input
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1E1E] mb-2">
                  Publication Year
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full rounded-md border border-[#E0DDDD] px-3 py-2 text-sm bg-white"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
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
                placeholder="Brief summary or synopsis of the book"
                className="focus:outline-none focus:ring-2 focus:ring-[#737373] w-full sm:w-[90%] md:w-[70%] rounded-md border border-[#E0DDDD] px-3 py-2 text-sm"
              />
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
            <label className="block text-sm font-bold text-[#1F1E1E] mb-2">
              Book Cover Image
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-md p-4 flex items-center justify-center h-48 ${
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-[#E0DDDD] bg-[#FFFBF5]"
              }`}
            >
              {file ? (
                <img
                  src={file.preview}
                  alt="preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mb-2 text-2xl relative left-[65px]">
                    <svg
                      width="50"
                      height="44"
                      viewBox="0 0 60 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M42.585 31.415L38 26.8275V42C38 42.5304 37.7893 43.0391 37.4142 43.4142C37.0392 43.7893 36.5304 44 36 44C35.4696 44 34.9609 43.7893 34.5858 43.4142C34.2107 43.0391 34 42.5304 34 42V26.8275L29.415 31.415C29.2292 31.6008 29.0086 31.7482 28.7658 31.8488C28.523 31.9494 28.2628 32.0011 28 32.0011C27.7372 32.0011 27.477 31.9494 27.2342 31.8488C26.9914 31.7482 26.7708 31.6008 26.585 31.415C26.3992 31.2292 26.2518 31.0086 26.1512 30.7658C26.0507 30.523 25.9989 30.2628 25.9989 30C25.9989 29.7372 26.0507 29.477 26.1512 29.2342C26.2518 28.9914 26.3992 28.7708 26.585 28.585L34.585 20.585C34.7708 20.399 34.9913 20.2515 35.2341 20.1509C35.4769 20.0502 35.7372 19.9984 36 19.9984C36.2628 19.9984 36.5231 20.0502 36.7659 20.1509C37.0087 20.2515 37.2293 20.399 37.415 20.585L45.415 28.585C45.6008 28.7708 45.7482 28.9914 45.8488 29.2342C45.9494 29.477 46.0011 29.7372 46.0011 30C46.0011 30.2628 45.9494 30.523 45.8488 30.7658C45.7482 31.0086 45.6008 31.2292 45.415 31.415C45.2292 31.6008 45.0086 31.7482 44.7658 31.8488C44.523 31.9494 44.2628 32.0011 44 32.0011C43.7372 32.0011 43.477 31.9494 43.2342 31.8488C42.9914 31.7482 42.7708 31.6008 42.585 31.415ZM38 3.32128e-07C33.9139 0.0030828 29.9092 1.14304 26.4341 3.29234C22.9589 5.44164 20.1503 8.51549 18.3225 12.17C16.1463 11.8502 13.9276 11.9826 11.8048 12.5588C9.68208 13.135 7.70094 14.1427 5.98514 15.519C4.26934 16.8952 2.85574 18.6105 1.83262 20.5576C0.809494 22.5047 0.198829 24.6419 0.0387619 26.8356C-0.121305 29.0294 0.172663 31.2325 0.902308 33.3076C1.63195 35.3826 2.7816 37.2849 4.27945 38.8956C5.7773 40.5064 7.59117 41.791 9.60779 42.6692C11.6244 43.5475 13.8005 44.0005 16 44H26C26.5304 44 27.0392 43.7893 27.4142 43.4142C27.7893 43.0391 28 42.5304 28 42C28 41.4696 27.7893 40.9609 27.4142 40.5858C27.0392 40.2107 26.5304 40 26 40H16C12.8174 40 9.76517 38.7357 7.51473 36.4853C5.2643 34.2348 4.00001 31.1826 4.00001 28C4.00001 24.8174 5.2643 21.7652 7.51473 19.5147C9.76517 17.2643 12.8174 16 16 16C16.275 16 16.55 16 16.8225 16.03C16.2758 17.9729 15.999 19.9817 16 22C16 22.5304 16.2107 23.0391 16.5858 23.4142C16.9609 23.7893 17.4696 24 18 24C18.5304 24 19.0392 23.7893 19.4142 23.4142C19.7893 23.0391 20 22.5304 20 22C20.0005 18.7549 20.8783 15.5703 22.5404 12.7832C24.2025 9.99606 26.5872 7.71012 29.4421 6.16727C32.297 4.62441 35.5158 3.88204 38.758 4.0187C42.0003 4.15536 45.1452 5.16597 47.8602 6.94359C50.5751 8.72122 52.7589 11.1997 54.1806 14.1168C55.6023 17.0339 56.209 20.2811 55.9364 23.5147C55.6638 26.7484 54.5221 29.8482 52.6321 32.4861C50.7422 35.124 48.1742 37.202 45.2 38.5C44.7777 38.6831 44.4314 39.0062 44.2197 39.4149C44.0079 39.8236 43.9436 40.2928 44.0376 40.7434C44.1316 41.194 44.3782 41.5984 44.7357 41.8883C45.0932 42.1783 45.5397 42.336 46 42.335C46.2756 42.3348 46.5481 42.2769 46.8 42.165C51.4334 40.1439 55.2294 36.5888 57.5495 32.0978C59.8697 27.6068 60.5726 22.4537 59.5398 17.5054C58.5071 12.557 55.8018 8.11525 51.8789 4.92715C47.9561 1.73905 43.055 -0.000877669 38 3.32128e-07Z"
                        fill="#1F1E1E"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-[#1A1F2C]">
                    Drag & Drop Files Or{" "}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="font-medium underline"
                    >
                      Browse
                    </button>
                  </div>
                  <div className="text-xs text-[#676767] mt-1">
                    Upload JPG/PNG (Max 5MB)
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFilePick}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
