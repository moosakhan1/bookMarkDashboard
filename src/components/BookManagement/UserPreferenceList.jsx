// src/components/BookManagement/UserPreferenceList.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search, Download, Calendar, Clock, MessageSquare, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export default function UserPreferenceList() {
  const [preferences, setPreferences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchPreferences = async () => {
      const toastId = toast.loading("Fetching user preferences...");

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/api/admin/preferences");

        // API returns array directly
        const data = response.data || [];

        // Normalize API data to match component expectations
        const normalized = data.map(item => ({
          id: item._id,
          userId: item.userId || "—",
          name: item.name || "Unknown",
          contact: item.contact || "—",
          email: item.email || "—",
          genres: Array.isArray(item.genres) ? item.genres : [],
          bookRequests: item.bookRequests || "",
          duration: {
            selected: item.duration?.selected || "",
            other: item.duration?.other || ""
          },
          preferredDates: {
            when: new Date(item.preferredDates?.when),
            till: new Date(item.preferredDates?.till)
          },
          additionalNotes: item.additionalNotes || "",
          createdAt: new Date(item.createdAt)
        }));

        setPreferences(normalized);
        setFiltered(normalized);

        toast.success(`Loaded ${normalized.length} preference${normalized.length !== 1 ? 's' : ''}!`, { id: toastId });
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
        setError("Failed to load preferences. Please try again.");
        toast.error("Failed to load data", { id: toastId });

        // Optional: fallback to empty state
        setPreferences([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(preferences);
      return;
    }
    const term = search.toLowerCase();
    const result = preferences.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.contact.includes(term.replace(/\s/g, "")) ||
      p.userId.toLowerCase().includes(term) ||
      p.genres.some(g => g.toLowerCase().includes(term)) ||
      (p.bookRequests && p.bookRequests.toLowerCase().includes(term))
    );
    setFiltered(result);
  }, [search, preferences]);

  const exportCSV = () => {
    if (!filtered.length) {
      toast.error("No data to export!");
      return;
    }

    const headers = ["ID", "Name", "Email", "Contact", "Genres", "Request", "Duration", "From", "To", "Notes", "Created"];
    const rows = filtered.map(p => [
      p.userId,
      p.name,
      p.email,
      p.contact,
      p.genres.join(" | "),
      p.bookRequests || "—",
      p.duration.selected || p.duration.other || "—",
      format(p.preferredDates.when, "yyyy-MM-dd"),
      format(p.preferredDates.till, "yyyy-MM-dd"),
      p.additionalNotes || "—",
      format(p.createdAt, "yyyy-MM-dd HH:mm")
    ]);

    const csv = [headers, ...rows].map(r => `"${r.join('","')}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-preferences-${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-[#1F1E1E] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading user preferences...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#1F1E1E] text-white rounded-xl hover:bg-black transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1E1E] mb-2">
          User Book Preferences
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Controls */}
        <div className="p-5 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#faf5e9] to-white">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, phone, genre, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EEFF00] transition-all"
              />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#1F1E1E] text-white hover:bg-black font-medium shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#faf5e9] border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-12 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Genres</th>
                <th className="px-7 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Book Request</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Preferred Dates</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-500 text-lg font-medium">
                    {search ? "No preferences match your search." : "No user preferences submitted yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((pref) => (
                  <tr key={pref.id} className="hover:bg-[#fefcf7] transition-all duration-200">
                    <td className="px-4 py-5">
                      <div>
                        <div className="font-semibold text-gray-900">{pref.name}</div>
                        <div className="text-sm text-gray-500">{pref.email}</div>
                        <div className="text-xs text-gray-500">{pref.contact}</div>
                      </div>
                    </td>
                    <td className="px-2 py-5">
                      <div className="flex flex-wrap gap-2">
                        {pref.genres.map((g) => (
                          <span key={g} className="px-3 py-1.5 text-xs font-bold text-black bg-[#EEFF00] rounded-full shadow-sm">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-5 text-sm text-gray-700 max-w-[200px]">
                      {pref.bookRequests ? (
                        <span className="line-clamp-2">{pref.bookRequests}</span>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-2 py-5">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {pref.duration.selected || pref.duration.other || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-1 py-5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[13px] font-medium">
                          {format(pref.preferredDates.when, "MMM d")} to {format(pref.preferredDates.till, "MMM d, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-5 text-sm text-gray-700 max-w-sm">
                      {pref.additionalNotes ? (
                        <div className="flex items-start gap-2">
                          <span className="line-clamp-2">{pref.additionalNotes}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-2 py-5 text-sm text-gray-600">
                      {format(pref.createdAt, "MMM d, yyyy")}
                      <br />
                      <span className="text-xs text-gray-400">
                        {format(pref.createdAt, "h:mm a")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">
              {search ? "No matches found." : "No preferences yet."}
            </div>
          ) : (
            filtered.map((pref) => (
              <div key={pref.id} className="border-b border-gray-200 p-5 hover:bg-[#fefcf7] transition-all">
                <div className="mb-4">
                  <div className="font-bold text-lg text-gray-900">{pref.name}</div>
                  <div className="text-sm text-gray-600">{pref.email}</div>
                  <div className="text-xs text-gray-500">{pref.contact}</div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {pref.genres.map((g) => (
                      <span key={g} className="px-3 py-1.5 text-xs font-bold text-black bg-[#EEFF00] rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>

                  {pref.bookRequests && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-700">{pref.bookRequests}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {pref.duration.selected || pref.duration.other || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(pref.preferredDates.when, "MMM d")} – {format(pref.preferredDates.till, "MMM d")}
                      </span>
                    </div>
                  </div>

                  {pref.additionalNotes && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{pref.additionalNotes}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Created: {format(pref.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        Showing <strong>{filtered.length}</strong> of <strong>{preferences.length}</strong> preference{preferences.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}