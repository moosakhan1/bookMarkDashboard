// src/components/AllUsers/AllUsers.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, Edit2, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import Image from "next/image";
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=admin";
export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let toastId = null;
    const fetchUsers = async () => {
      if (!isMounted) return;
      toastId = toast.loading("Loading users...");
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/admin/users");
        const apiUsers = Array.isArray(res.data) ? res.data : [];
        const formatted = apiUsers.map((u) => ({
          id: String(u.id || "U-000"),
          userName: String(u.userName || "Unnamed User"),
          email: String(u.email || "no-email@unknown.com"),
          avatar:
            u.avatar && typeof u.avatar === "string"
              ? u.avatar
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  u.email || u.id || "user"
                )}`,
          plan:
            u.plan !== null && u.plan !== undefined ? String(u.plan) : "Free",
          renewalDate: u.renewalDate !== null ? String(u.renewalDate) : "—",
          booksAssigned:
            u.booksAssigned !== null ? String(u.booksAssigned) : "0",
          overdue: u.overdue !== null ? String(u.overdue) : "0",
          // fine: u.fine !== null ? `$${parseFloat(u.fine || 0).toFixed(2)}` : "$0.00",
        }));
        if (isMounted) {
          setUsers(formatted);
          setFiltered(formatted);
          toast.success("Users loaded successfully!", { id: toastId });
        }
      } catch (err) {
        if (isMounted) {
          toast.error("Failed to load users", { id: toastId });
          console.error("API Error:", err);
          setUsers([]);
          setFiltered([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
      if (toastId) toast.dismiss(toastId);
    };
  }, []);
  useEffect(() => {
    if (!Array.isArray(users)) {
      setFiltered([]);
      return;
    }
    let result = [...users];
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.userName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.id.toLowerCase().includes(term)
      );
    }
    if (filter !== "all") {
      if (filter === "overdue")
        result = result.filter((u) => parseInt(u.overdue || "0", 10) > 0);
      // if (filter === "fine")
      //   result = result.filter(u => parseFloat((u.fine || "$0").replace("$", "") || "0") > 0);
      if (filter === "monthly")
        result = result.filter((u) =>
          (u.plan || "").toLowerCase().includes("monthly")
        );
      if (filter === "quarterly")
        result = result.filter((u) =>
          (u.plan || "").toLowerCase().includes("quarterly")
        );
      if (filter === "yearly")
        result = result.filter((u) =>
          (u.plan || "").toLowerCase().includes("yearly")
        );
      if (filter === "lifetime")
        result = result.filter((u) =>
          (u.plan || "").toLowerCase().includes("lifetime")
        );
    }
    setFiltered(result);
  }, [search, filter, users]);
  const handleDelete = (userId, userName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="font-medium">
            Delete user <strong>{userName || "Unknown"}</strong>?
          </p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(userId);
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
  };
  const performDelete = async (userId) => {
    const toastId = toast.loading("Deleting user...");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFiltered((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    }
  };
  const handleEdit = (user) => {
    toast.success(`Edit ${user.userName} — Coming Soon!`, { duration: 2000 });
  };
  const exportCSV = () => {
    if (!filtered.length) {
      toast.error("No users to export!");
      return;
    }
    // const headers = ["ID", "Name", "Email", "Plan", "Renewal", "Books", "Overdue", "Fine"];
    const headers = [
      "ID",
      "Name",
      "Email",
      "Plan",
      "Renewal",
      "Books",
      "Overdue",
    ];
    const rows = filtered.map((u) => [
      u.id,
      `"${u.userName.replace(/"/g, '""')}"`,
      u.email,
      u.plan,
      u.renewalDate,
      u.booksAssigned,
      u.overdue,
      // u.fine
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `library-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        <div className="inline-block w-12 h-12 border-4 border-[#1F1E1E] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading users...</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1 text-[#1F1E1E]">
        All Users
      </h2>
      <p className="text-gray-500 mb-6">
        Search, filter, and manage every subscriber with precision.
      </p>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EEFF00] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-5 justify-end">
            <div className="relative inline-block">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none px-7 pr-10 py-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#EEFF00] focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Users ({users.length})</option>
                <option value="overdue">Overdue Books</option>
                {/* <option value="fine">Has Fine</option> */}
                <option value="monthly">Monthly Plan</option>
                <option value="quarterly">Quarterly Plan</option>
                <option value="yearly">Yearly Plan</option>
                <option value="lifetime">Lifetime Access</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F1E1E] text-white hover:bg-black transition-all font-medium"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {[
                  "ID",
                  "User",
                  "Email",
                  "Plan",
                  "Renewal",
                  "Books",
                  "Overdue",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-6 font-semibold text-[#1F1E1E] uppercase text-xs tracking-wide"
                  >
                    {h}
                  </th>
                ))}
                {/* Removed "Fine" header */}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-gray-600">
                      {u.id}
                    </td>
                    <td className="py-4 px-4 max-w-[200px] break-words">
                      <div className="flex items-center gap-3">
                        <Image
                          src={u.avatar}
                          alt={u.userName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          unoptimized // Optional: if you still get issues
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                        />
                        <span className="font-medium text-[#1F1E1E] max-w-[150px] break-words">
                          {u.userName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-600 max-w-[250px] break-words">
                      {u.email}
                    </td>
                    <td className="py-4 px-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.plan === "Free"
                            ? "bg-gray-100 text-gray-700"
                            : u.plan.includes("Lifetime")
                            ? "bg-purple-100 text-purple-700"
                            : "bg-[#EEFF00]/30 text-[#1F1E1E]"
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-600 w-24 text-center">
                      {u.renewalDate}
                    </td>
                    <td className="py-4 px-2 text-center w-20">
                      {u.booksAssigned}
                    </td>
                    <td className="py-4 px-2 text-center w-20">
                      <span
                        className={`font-bold ${
                          parseInt(u.overdue) > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {u.overdue}
                      </span>
                    </td>
                    {/* <td className="py-4 px-4 font-bold text-red-600">{u.fine}</td> */}
                    <td className="py-4 px-6">
                      <div className="flex gap-0.1">
                        <button
                          onClick={() =>
                            toast.success(`Viewing ${u.userName}'s profile`)
                          }
                          className="p-2 rounded-full hover:bg-blue-100 transition-all group"
                          title="View"
                        >
                          <Eye className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-all group"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.userName)}
                          className="p-2 rounded-full hover:bg-red-100 transition-all group"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found.
            </div>
          ) : (
            filtered.map((u) => (
              <div
                key={u.id}
                className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <Image
                      src={u.avatar}
                      alt={u.userName}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border border-gray-200"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="break-words">
                      <div className="font-semibold text-lg max-w-[150px] break-words">
                        {u.userName}
                      </div>
                      <div className="text-xs text-gray-500">{u.id}</div>
                      <div className="text-sm text-gray-600 max-w-[200px] break-words">
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.plan === "Free"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-[#EEFF00]/30 text-[#1F1E1E]"
                    }`}
                  >
                    {u.plan}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-24 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Renewal:</span>{" "}
                    {u.renewalDate}
                  </div>
                  <div>
                    <span className="text-gray-600">Books:</span>{" "}
                    {u.booksAssigned}
                  </div>
                  <div>
                    <span className="text-gray-600">Overdue:</span>{" "}
                    <strong className="text-red-600">{u.overdue}</strong>
                  </div>
                  {/* <div><span className="text-gray-600">Fine:</span> <strong className="text-red-600">{u.fine}</strong></div> */}
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  <button className="p-2.5 rounded-full hover:bg-blue-100 group transition-all">
                    <Eye className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEdit(u)}
                    className="p-2.5 rounded-full hover:bg-yellow-100 group transition-all"
                  >
                    <Edit2 className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, u.userName)}
                    className="p-2.5 rounded-full hover:bg-red-100 group transition-all"
                  >
                    <Trash2 className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
