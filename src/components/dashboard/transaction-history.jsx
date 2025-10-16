"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, FileText } from "lucide-react"

const transactions = [
  {
    id: 1,
    name: "Frank Moore",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "FM",
    invoice: "#1019",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 01, 2025, 10 AM",
    nextRenewal: "Nov 01, 2025, 10 AM",
    status: "Paid",
  },
  {
    id: 2,
    name: "Karen Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "KL",
    invoice: "#1018",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 25, 2025, 10 AM",
    nextRenewal: "Nov 25, 2025, 10 AM",
    status: "Paid",
  },
  {
    id: 3,
    name: "Mona Lewis",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ML",
    invoice: "#1017",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 15, 2025, 10 AM",
    nextRenewal: "-",
    status: "Failed",
  },
  {
    id: 4,
    name: "Mona Lewis",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ML",
    invoice: "#1016",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 01, 2025, 10 AM",
    nextRenewal: "-",
    status: "Cancelled",
  },
]

export function TransactionHistory() {
 const [search, setSearch] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.invoice.toLowerCase().includes(search.toLowerCase()) ||
      t.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Transaction History</h2>
      <p className="text-gray-500 mb-4">
        Review all your billing transactions and invoice details.
      </p>

      <div className="bg-white rounded-xl border border-[#E0DDDD] p-2 md:p-6">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto md:ml-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#737373] bg-white text-[#737373] w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {[
                  "User Name",
                  "Invoice",
                  "Amount↓",
                  "Plan",
                  "Billing Date",
                  "Next Renewal↓",
                  "Status",
                  "Action",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-left text-sm font-bold text-[#1F1E1E]"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover bg-gray-300"
                      />
                      <span className="font-medium text-[#6B7280]">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {t.invoice}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {t.amount}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {t.plan}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {t.billingDate}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {t.nextRenewal}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        t.status === "Paid"
                          ? "bg-[#CAF9DB] text-[#166534]"
                          : t.status === "Failed"
                          ? "bg-[#FECACA] text-[#991B1B]"
                          : "bg-[#F3F4F6] text-[#4B5563]"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover bg-gray-300"
                />
                <div>
                  <div className="font-medium text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.invoice}</div>
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    t.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : t.status === "Failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Amount:</span> {t.amount}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Plan:</span> {t.plan}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Billing Date:</span>{" "}
                {t.billingDate}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Next Renewal:</span>{" "}
                {t.nextRenewal}
              </div>
              <button className="self-start mt-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}