"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import toast from "react-hot-toast";
import { 
  Package, Calendar, Clock, FileText, Eye, Trash2, Edit, User, X, 
  BookOpen, Plus, Search, Minus 
} from "lucide-react";

const DEFAULT_COVER = "https://via.placeholder.com/80x110/1F1E1E/FFFFFF?text=Book";

export default function CreateOrderList() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bookSearchTerm, setBookSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/users");
      setUsers(res.data || []);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/books");
      setBooks(res.data || []);
    } catch (error) {
      console.error("Failed to load books");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchBooks();
  }, []);

  useEffect(() => {
    const term = bookSearchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.language?.toLowerCase().includes(term) ||
        book.publisher?.toLowerCase().includes(term)
    );
    setFilteredBooks(filtered);
  }, [bookSearchTerm, books]);

  const getUserDetails = (id) => users.find((u) => u.id === id);

  const getBookDetails = (bookId) => {
    const id = typeof bookId === 'object' ? bookId._id || bookId.id : bookId;
    return books.find(book => book._id === id) || 
           books.find(book => book.id === id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Delete this order permanently?")) return;
    setDeletingId(orderId);
    try {
      await axiosInstance.delete(`/api/admin/orders/${orderId}`);
      setOrders(orders.filter((o) => o._id !== orderId));
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (order) => {
    const bookIds = order.bookIds.map(book => 
      typeof book === 'object' ? book._id || book.id : book
    );
    
    setEditingOrder({ 
      ...order,
      orderDate: order.orderDate.split('T')[0],
      bookIds: bookIds
    });
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingOrder(null);
    setSaving(false);
    setBookSearchTerm("");
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    setSaving(true);
    try {
      const payload = {
        status: editingOrder.status,
        notes: editingOrder.notes || "",
        orderDate: editingOrder.orderDate,
        bookIds: editingOrder.bookIds.map(bookId => {
          return typeof bookId === 'object' ? bookId._id : bookId;
        }),
      };

      const res = await axiosInstance.patch(`/api/admin/orders/${editingOrder._id}`, payload);

      setOrders(orders.map(order => 
        order._id === editingOrder._id ? { ...order, ...res.data } : order
      ));

      toast.success("Order updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBook = (book) => {
    if (editingOrder.bookIds.some((bookId) => bookId === book._id)) {
      toast.error("Book already in order");
      return;
    }
    
    setEditingOrder(prev => ({
      ...prev,
      bookIds: [...prev.bookIds, book._id]
    }));
    
    setBookSearchTerm("");
    toast.success(`"${book.title}" added to order`);
  };

  const handleRemoveBook = (bookId) => {
    const book = getBookDetails(bookId);
    setEditingOrder(prev => ({
      ...prev,
      bookIds: prev.bookIds.filter(id => id !== bookId)
    }));
    toast.success(`Removed: ${book?.title || 'Book'}`);
  };

  const isBookInOrder = (bookId) => {
    return editingOrder?.bookIds.includes(bookId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="h-10 w-10" />
          All Orders
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Manage all customer book orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
          <Package className="mx-auto h-20 w-20 text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700">No orders yet</h3>
          <p className="text-gray-500 mt-2">Create your first order</p>
        </div>
      ) : (
        <>
          {/* TABLE VIEW */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Books</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-12 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const u = getUserDetails(order.userId);

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="px-6 py-5">
                        {u ? (
                          <div className="font-medium text-gray-900">
                            <div>{u.userName || "Unnamed User"}</div>
                            <div className="text-sm text-gray-600">{u.email}</div>
                            <div className="text-xs text-gray-400">{u.id}</div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{order.userId}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-medium text-gray-700">{order.bookIds.length}</span>{" "}
                        book{order.bookIds.length > 1 ? "s" : ""}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.orderDate)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(order)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            disabled={deletingId === order._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          >
                            {deletingId === order._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="lg:hidden grid gap-5">
            {orders.map((order) => {
              const u = getUserDetails(order.userId);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>

                      {u ? (
                        <div className="mt-1">
                          <div className="font-semibold">{u.userName || "Unnamed User"}</div>
                          <div className="text-sm text-gray-600">{u.email}</div>
                          <div className="text-xs text-gray-500">{u.id}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          {order.userId}
                        </div>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Books</span>
                      <span className="font-medium">{order.bookIds.length} book{order.bookIds.length > 1 ? "s" : ""}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Order Date
                      </span>
                      <span className="font-medium">{formatDate(order.orderDate)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Created
                      </span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex gap-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-700 mt-0.5" />
                        <p className="text-blue-800">{order.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
                    <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">
                      <Eye className="h-5 w-5" />
                    </button>

                    <button 
                      onClick={() => handleEdit(order)}
                      className="p-3 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100"
                    >
                      <Edit className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={deletingId === order._id}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === order._id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Enhanced Edit Order Modal with Book Selection like CreateOrderForm */}
      {editModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Order</h2>
                <p className="text-lg opacity-90 mt-1">
                  Order #{editingOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="text-white hover:bg-white/20 p-2 rounded-full transition disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[65vh]">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Customer & Order Details */}
                <div className="xl:col-span-1 space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </h3>
                    {getUserDetails(editingOrder.userId) ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium text-gray-900">
                            {getUserDetails(editingOrder.userId).userName || "Unnamed User"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">
                            {getUserDetails(editingOrder.userId).email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">User ID</p>
                          <p className="font-medium text-gray-900 font-mono text-sm">
                            {editingOrder.userId}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{editingOrder.userId}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Order Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Date
                        </label>
                        <input
                          type="date"
                          value={editingOrder.orderDate}
                          onChange={(e) => handleInputChange('orderDate', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          disabled={saving}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={editingOrder.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          disabled={saving}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Books Management */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Books in Order */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Books in Order ({editingOrder.bookIds.length})
                      </h3>
                    </div>

                    {/* Book Search - Exactly like CreateOrderForm */}
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800" />
                      <input
                        type="text"
                        placeholder="Search books by title, author, language, or publisher..."
                        value={bookSearchTerm}
                        onChange={(e) => {
                          setBookSearchTerm(e.target.value);
                        }}
                        onFocus={() => setBookSearchTerm(bookSearchTerm)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-yellow-100 transition-all"
                      />
                      {bookSearchTerm && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setBookSearchTerm("")}
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
                                      src={book.coverUrl || book.coverImage || DEFAULT_COVER}
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

                    {/* Books List */}
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {editingOrder.bookIds.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-7 text-center bg-pink-50/50">
                          <Package className="mx-auto h-10 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium text-lg mb-1">
                            No books selected
                          </p>
                          <p className="text-gray-500">
                            Search and add books to update the order
                          </p>
                        </div>
                      ) : (
                        editingOrder.bookIds.map((bookId, index) => {
                          const book = getBookDetails(bookId);
                          return (
                            <div
                              key={book?._id || index}
                              className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group"
                            >
                              <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                  src={book?.coverUrl || book?.coverImage || DEFAULT_COVER}
                                  alt={book?.title || "Book"}
                                  width={64}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-lg mb-1 truncate">
                                  {book?.title || `Book ID: ${typeof bookId === 'object' ? bookId._id : bookId}`}
                                </p>
                                <p className="text-gray-600 mb-2">{book?.author}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    {book?.language || "Unknown"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {book?.publishedYear || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveBook(bookId)}
                                className="text-red-600 hover:text-red-800 p-2 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Order Notes
                    </h3>
                    <textarea
                      value={editingOrder.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      placeholder="Add any notes about this order..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                      disabled={saving}
                    />
                    <div className="text-right text-sm text-gray-500 mt-2">
                      {editingOrder.notes?.length || 0}/500 characters
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="px-8 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || editingOrder.bookIds.length === 0}
                className="px-8 py-3 bg-gray-900 text-white hover:bg-black rounded-xl font-medium transition disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    Save Changes
                    <Edit className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}