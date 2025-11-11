// src/components/BookManagement/AllBooks.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, Edit2, Trash2, X, Upload } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import toast from "react-hot-toast";

const FALLBACK_CATEGORIES = [
  { _id: "1", name: "Fiction" },
  { _id: "2", name: "Non-Fiction" },
  { _id: "3", name: "Science" },
  { _id: "4", name: "History" },
  { _id: "5", name: "Romance" },
  { _id: "6", name: "Thriller" },
  { _id: "7", name: "Biography" },
];

const languages = ["English", "Spanish", "French", "German"];
const years = Array.from({ length: 30 }, (_, i) => `${2025 - i}`);

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // FETCH CATEGORIES — SILENT (NO TOAST!)
  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await axiosInstance.get("/api/admin/categories");
        const apiCats = Array.isArray(res.data) ? res.data : [];

        const activeCats = apiCats
          .filter((cat) => cat.isActive !== false)
          .map((cat) => ({ _id: cat._id, name: cat.name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        if (isMounted) {
          setCategories(
            activeCats.length > 0 ? activeCats : FALLBACK_CATEGORIES
          );
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using fallback categories");
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // FETCH BOOKS — ONLY ONE TOAST (React 18 PROOF)
  useEffect(() => {
    let isMounted = true;
    let toastId = null;

    async function fetchBooks() {
      if (!isMounted) return;

      // Only show toast on first real load
      if (!toastId) {
        toastId = toast.loading("Loading books...");
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/admin/books");

        const formattedBooks = (res.data || []).map((book) => ({
          ...book,
          category: book.categoryId?.name || "Uncategorized",
          coverUrl:
            book.coverUrl || book.coverImage || "/default-book-cover.jpg",
          publishedYear: book.publishedYear || 2025,
        }));

        if (isMounted) {
          setBooks(formattedBooks);
          if (toastId) {
            toast.success("Books loaded successfully", { id: toastId });
            toastId = null; // Prevent double success
          }
        }
      } catch (err) {
        if (isMounted && toastId) {
          toast.error("Failed to load books", { id: toastId });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBooks();

    return () => {
      isMounted = false;
      if (toastId) toast.dismiss(toastId);
    };
  }, []);

  // DELETE
  async function handleDelete(id) {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="font-medium">
            Are you sure you want to delete this book?
          </p>
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
      ),
      { duration: 10000 }
    );
  }

  async function performDelete(id) {
    const toastId = toast.loading("Deleting book...");
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/api/admin/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error(
        "Delete failed: " + (err.response?.data?.message || "Try again"),
        { id: toastId }
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(book) {
    setEditingBook(book);
    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.categoryId?._id || "",
      language: book.language || "English",
      publisher: book.publisher || "",
      year: String(book.publishedYear || 2025),
      description: book.description || "",
      longDescription: book.longDescription || "",
      isActive: book.isActive ?? true,
    });
    setFile(null);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFilePick(e) {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      setFile(Object.assign(f, { preview: URL.createObjectURL(f) }));
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFilePick({ target: { files: [f] } });
  }

  async function handleSave() {
    if (!editingBook) return;

    const toastId = toast.loading("Saving changes...");
    setUploading(true);
    let coverImageUrl = editingBook.coverUrl || "/default-book-cover.jpg";

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "book_covers");
      data.append("cloud_name", "dwbsdqaml");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dwbsdqaml/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const cloudData = await res.json();
        if (cloudData.secure_url) coverImageUrl = cloudData.secure_url;
        else throw new Error("Upload failed");
      } catch (err) {
        toast.error("Image upload failed", { id: toastId });
        setUploading(false);
        return;
      }
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      categoryId: form.category,
      language: form.language,
      publisher: form.publisher.trim(),
      publishedYear: parseInt(form.year),
      description: form.description.trim(),
      longDescription: form.longDescription,
      coverImage: coverImageUrl,
      isActive: form.isActive,
    };

    try {
      const res = await axiosInstance.patch(
        `/api/admin/books/${editingBook._id}`,
        payload
      );
      setBooks((prev) =>
        prev.map((b) =>
          b._id === editingBook._id
            ? {
                ...b,
                ...res.data,
                category: res.data.categoryId?.name || "Uncategorized",
              }
            : b
        )
      );
      toast.success("Book updated successfully!", { id: toastId });
      setEditingBook(null);
      setFile(null);
    } catch (err) {
      toast.error(
        "Update failed: " + (err.response?.data?.message || "Try again"),
        { id: toastId }
      );
    } finally {
      setUploading(false);
    }
  }

  const filtered = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(term) ||
      book.author?.toLowerCase().includes(term) ||
      book.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
            All Books
          </h2>
          <p className="text-gray-500">
            Manage your library — view, edit, or remove books.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E0DDDD] rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by title, author, or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading books...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No books found.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="text-[#1F1E1E]">
                  <tr className="border-b border-[#E0DDDD]">
                    {[
                      "Cover",
                      "Title",
                      "Author",
                      "Category",
                      "Year",
                      "Language",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-bold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b border-[#E0DDDD] hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-16 rounded overflow-hidden border border-gray-200">
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            width={48}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1F1E1E] max-w-xs truncate">
                        {book.title}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {book.author}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {book.category}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {book.publishedYear}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {book.language}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            book.isActive
                              ? "bg-[#CAF9DB] text-[#166534]"
                              : "bg-[#FFF0F0] text-[#A70909]"
                          }`}
                        >
                          {book.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-gray-600 hover:text-blue-600"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEdit(book)}
                            className="text-gray-600 hover:text-green-600"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            disabled={deletingId === book._id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === book._id ? (
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filtered.map((book) => (
                <div
                  key={book._id}
                  className="border rounded-lg p-4 bg-white shadow-sm flex gap-4"
                >
                  <div className="w-20 h-28 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={80}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {book.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {book.publishedYear}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {book.language}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          book.isActive
                            ? "bg-[#CAF9DB] text-[#166534]"
                            : "bg-[#FFF0F0] text-[#A70909]"
                        }`}
                      >
                        {book.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-4">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEdit(book)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          disabled={deletingId === book._id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === book._id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* /* EDIT MODAL */}
      {editingBook && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold">Edit Book</h3>
              <button
                onClick={() => setEditingBook(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={28} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Book Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Author Name
                    </label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Language
                    </label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                    >
                      {languages.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Publisher
                    </label>
                    <input
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Publication Year
                    </label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Category / Genre
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-gray-500 border rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold  mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full text-gray-500 px-2 py-3 border rounded-md h-20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Long Description
                  </label>
                  <div className="border border-[#E0DDDD] rounded-md max-h-[220px] overflow-auto">
                    <Editor
                      apiKey="zhpffn2rq4yoy8kkmyu9zmnixtgnckgczc5cffw5s0ik5w8s"
                      value={form.longDescription}
                      onEditorChange={(c) =>
                        setForm((prev) => ({ ...prev, longDescription: c }))
                      }
                      init={{
                        height: 220, // reduced from 350
                        menubar: true,
                        plugins: "lists link image code preview table",
                        toolbar:
                          "undo redo | bold italic | bullist numlist | link image | code",
                        resize: false,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="isActive"
                    className="font-medium text-gray-700"
                  >
                    Active (Visible in library)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      form.isActive ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        form.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">
                  Book Cover Image
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 flex items-center justify-center h-64 ${
                    dragging
                      ? "border-blue-400 bg-blue-50"
                      : "border-[#E0DDDD] bg-[#FFFBF5]"
                  } cursor-pointer`}
                  onClick={() => fileRef.current?.click()}
                >
                  {file?.preview ? (
                    <img
                      src={file.preview}
                      alt="preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : editingBook.coverUrl ? (
                    <img
                      src={editingBook.coverUrl}
                      alt="current"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload
                        size={40}
                        className="mx-auto mb-3 text-gray-400"
                      />
                      <p className="font-medium">Click or Drag & Drop</p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG/PNG up to 5MB
                      </p>
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
                {uploading && (
                  <p className="text-sm text-blue-600 mt-2">
                    Uploading image...
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-1">
              <button
                onClick={() => setEditingBook(null)}
                className="px-6 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="px-8 py-2 bg-[#1F1E1E] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 font-medium"
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
