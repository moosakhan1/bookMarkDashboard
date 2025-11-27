// src/components/CreateOrder/CreateOrderForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Trash2,
  Package,
  FileText,
  CalendarDays,
  User,
  BookOpen,
} from "lucide-react";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=f3f4f6";
const DEFAULT_COVER =
  "https://via.placeholder.com/80x110/1F1E1E/FFFFFF?text=Book";

export default function CreateOrderForm({ initialUser, onSuccess }) {
  const [form, setForm] = useState({
    userId: initialUser?.id || "",
    books: [],
    status: "pending",
    notes: "",
    orderDate: new Date().toISOString().split("T")[0],
  });

  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-select user when initialUser is provided
  useEffect(() => {
    if (initialUser?.id) {
      setForm((prev) => ({ ...prev, userId: initialUser.id }));
    }
  }, [initialUser]);

  useEffect(() => {
    fetchBooks();
    if (!initialUser) {
      fetchUsers();
    }
  }, [initialUser]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.language?.toLowerCase().includes(term) ||
        book.publisher?.toLowerCase().includes(term)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  useEffect(() => {
    const term = userSearchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.userName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.id?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [userSearchTerm, users]);

  // ✅ FIXED: Normalize book IDs for API compatibility
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const response = await axiosInstance.get("/api/admin/books");

      // Normalize for Mongo `_id` compatibility
      const normalized = (response.data || []).map((b) => ({
        ...b,
        _id: b.id || b._id,
      }));

      setBooks(normalized.filter((book) => book.isActive !== false));
    } catch (error) {
      console.error("Books failed to load");
      toast.error("Failed to load books");
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axiosInstance.get("/api/admin/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Users failed to load");
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // ✅ FIXED: Use normalized _id for book comparison
  const handleAddBook = (book) => {
    if (form.books.some((b) => b._id === book._id)) {
      toast.error("Book already added");
      return;
    }
    const bookToAdd = {
      _id: book._id, // Using normalized _id
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || book.coverImage || DEFAULT_COVER,
      language: book.language,
      publishedYear: book.publishedYear,
      publisher: book.publisher,
    };
    setForm((prev) => ({ ...prev, books: [...prev.books, bookToAdd] }));
    setShowBookSearch(false);
    setSearchTerm("");
    toast.success(`"${book.title}" added`);
  };

  const handleRemoveBook = (bookId) => {
    const book = form.books.find((b) => b._id === bookId);
    setForm((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b._id !== bookId),
    }));
    toast.success(`Removed: ${book.title}`);
  };

  const handleUserSelect = (user) => {
    setForm((prev) => ({ ...prev, userId: user.id }));
    setShowUserSearch(false);
    setUserSearchTerm("");
    toast.success(`Selected: ${user.userName || user.email}`);
  };

  // ✅ FIXED: Correct API payload with proper bookIds
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error("Please select a customer");
    if (form.books.length === 0)
      return toast.error("Please add at least one book");

    const toastId = toast.loading("Creating order...");
    setSubmitting(true);

    try {
      await axiosInstance.post("/api/admin/orders", {
        userId: form.userId,
        bookIds: form.books.map((b) => b._id), // Correct IDs after normalization
        status: form.status,
        notes: form.notes.trim() || undefined,
        orderDate: form.orderDate,
      });

      toast.success("Order created successfully!", { id: toastId });
      setForm({
        userId: initialUser?.id || "",
        books: [],
        status: "pending",
        notes: "",
        orderDate: new Date().toISOString().split("T")[0],
      });
      setSearchTerm("");
      setUserSearchTerm("");
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order", {
        id: toastId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const selectedUser = users.find((u) => u.id === form.userId) || initialUser;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-2">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Create New Order
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details to generate a new book order
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8"
      >
        {/* Customer Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Information
            </h2>
          </div>

          {/* Show pre-filled user when initialUser is provided */}
          {initialUser && (
            <div className="flex items-center justify-between p-5 border-2 border-green-200 rounded-xl bg-green-50">
              <div className="flex items-center gap-4">
                <Image
                  src={initialUser.avatar || DEFAULT_AVATAR}
                  alt={initialUser.userName || "User"}
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-white shadow-md"
                  unoptimized
                />
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {initialUser.userName || "Unnamed User"}
                  </p>
                  <p className="text-gray-600">{initialUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Show user search ONLY when no initialUser (normal flow) */}
          {!initialUser && !selectedUser && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or User ID..."
                value={userSearchTerm}
                onChange={(e) => {
                  setUserSearchTerm(e.target.value);
                  setShowUserSearch(true);
                }}
                onFocus={() => setShowUserSearch(true)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                disabled={loadingUsers}
              />
              {showUserSearch && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserSearch(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 font-medium">
                          No users found
                        </p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full p-4 text-left hover:bg-gray-50 flex items-center gap-4 border-b border-gray-100 last:border-b-0"
                        >
                          <Image
                            src={user.avatar || DEFAULT_AVATAR}
                            alt=""
                            width={48}
                            height={48}
                            className="rounded-full border"
                            unoptimized
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.userName || "Unnamed User"}
                            </p>
                            <p className="text-gray-600 text-sm truncate">
                              {user.email}
                            </p>
                            <p className="text-xs font-medium text-gray-500 mt-1">
                              ID: {user.id}
                            </p>
                          </div>
                          <Plus className="h-5 w-5 text-green-600" />
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Show selected user (from search) when no initialUser */}
          {!initialUser && selectedUser && (
            <div className="flex items-center justify-between p-5 border-2 border-yellow-100 rounded-xl bg-yellow-50/50">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedUser.avatar || DEFAULT_AVATAR}
                  alt=""
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-white shadow-md"
                  unoptimized
                />
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedUser.userName || "Unnamed User"}
                  </p>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm font-medium text-gray-500 mt-1">
                    User ID: {selectedUser.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, userId: "" }))}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 size={22} />
              </button>
            </div>
          )}
        </section>

        {/* Book Selection Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Book Selection
            </h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {form.books.length} selected
            </span>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800" />
            <input
              type="text"
              placeholder="Search books by title, author, language, or publisher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowBookSearch(true);
              }}
              onFocus={() => setShowBookSearch(true)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-yellow-100 transition-all"
              disabled={loadingBooks}
            />
            {showBookSearch && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowBookSearch(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {filteredBooks.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 font-medium">
                        No books found
                      </p>
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <button
                        key={book._id}
                        type="button"
                        onClick={() => handleAddBook(book)}
                        className="w-full p-4 text-left hover:bg-gray-50 flex items-center gap-4 border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={
                              book.coverUrl || book.coverImage || DEFAULT_COVER
                            }
                            alt={book.title}
                            width={48}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {book.title}
                          </p>
                          <p className="text-gray-600 text-sm truncate">
                            {book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {book.language || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {book.publishedYear || "N/A"}
                            </span>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-green-600 group-hover:scale-110 transition" />
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {form.books.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-7 text-center bg-pink-50/50">
              <Package className="mx-auto h-10 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium text-lg mb-1">
                No books selected
              </p>
              <p className="text-gray-500">
                Search and add books to create an order
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.books.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg mb-1 truncate">
                      {book.title}
                    </p>
                    <p className="text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {book.language || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {book.publishedYear || "N/A"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBook(book._id)}
                    className="text-red-600 hover:text-red-800 p-2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Details Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Order Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Order Date
              </label>
              <input
                type="date"
                value={form.orderDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, orderDate: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Order Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium text-gray-900 mb-2">
              Order Notes (Optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
              placeholder="Add any special instructions or comments..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 resize-none"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-400 mt-1">
              {form.notes.length}/500
            </div>
          </div>
        </section>

        {/* Order Summary Section */}
        {(form.books.length > 0 || selectedUser) && (
          <section>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-gray-700" />
                Order Summary
              </h3>
              <div className="space-y-6">
                {selectedUser && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Customer
                    </p>
                    <div className="flex items-center gap-3">
                      <Image
                        src={selectedUser.avatar || DEFAULT_AVATAR}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedUser.userName || "Unnamed User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {form.books.length > 0 && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Books ({form.books.length})
                    </p>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {form.books.map((book) => (
                        <div
                          key={book._id}
                          className="flex justify-between items-start"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {book.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {book.author} • {book.publishedYear || "N/A"} •{" "}
                              {book.language}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order Date:</span>{" "}
                    <span className="font-medium ml-2">{form.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>{" "}
                    <span
                      className={`font-medium ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                        form.status
                      )}`}
                    >
                      {form.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Books:</span>{" "}
                    <span className="font-medium ml-2">
                      {form.books.length}
                    </span>
                  </div>
                </div>
                {form.notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Notes:
                    </p>
                    <p className="text-gray-600">{form.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={submitting || !form.userId || form.books.length === 0}
            className="px-12 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Order...
              </>
            ) : (
              <>
                Create Order
                <Package className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
