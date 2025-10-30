"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

const payments = [
  {
    id: "U-001",
    name: "Frank Moore",
    invoice: "Invoice #1019",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 01, 2025, 10 AM",
    nextRenewal: "Nov 01, 2025, 10 AM",
    status: "Paid",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U-002",
    name: "Karen Lee",
    invoice: "Invoice #1018",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 25, 2025, 10 AM",
    nextRenewal: "Nov 25, 2025, 10 AM",
    status: "Paid",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  { 
    id: "U-003",
    name: "Mona Lewis",
    invoice: "Invoice #1017",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 15, 2025, 10 AM",
    nextRenewal: "Nov 15, 2025, 10 AM",
    status: "Pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U-004",
    name: "Olivia Brown",
    invoice: "Invoice #1016",
    amount: "$9.99",
    plan: "Premium Monthly",
    billingDate: "Oct 01, 2025, 10 AM",
    nextRenewal: "Nov 01, 2025, 10 AM",
    status: "Cancelled",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function PaymentBilling() {
  const [search, setSearch] = useState("");

  const filtered = payments.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.invoice.toLowerCase().includes(search.toLowerCase()) ||
      p.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
        Payment & Billing
      </h2>
      <p className="text-gray-500 mb-4">
        Here you can view all your invoices and subscription plans.
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
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#737373] bg-white text-[#737373]  w-full sm:w-auto">
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
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="h-10 w-10 rounded-full object-cover bg-gray-300"
                      />
                      <span className="font-medium text-[#6B7280]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {p.invoice}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {p.amount}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {p.plan}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {p.billingDate}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {p.nextRenewal}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        p.status === "Paid"
                          ? "bg-[#CAF9DB] text-[#166534]"
                          : p.status === "Pending"
                          ? "bg-[#FDE68A] text-[#92400E]"
                          : "bg-[#FECACA] text-[#991B1B]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                     <svg width="25" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.3699 9.31875L18.8074 2.75625C18.6768 2.62549 18.5217 2.52175 18.351 2.45097C18.1803 2.38019 17.9973 2.34376 17.8125 2.34375H6.5625C5.9409 2.34375 5.34476 2.59068 4.90522 3.03022C4.46568 3.46976 4.21875 4.0659 4.21875 4.6875V25.3125C4.21875 25.9341 4.46568 26.5302 4.90522 26.9698C5.34476 27.4093 5.9409 27.6562 6.5625 27.6562H23.4375C24.0591 27.6562 24.6552 27.4093 25.0948 26.9698C25.5343 26.5302 25.7812 25.9341 25.7812 25.3125V10.3125C25.7812 9.93983 25.6333 9.58241 25.3699 9.31875ZM18.75 6.67969L21.4453 9.375H18.75V6.67969ZM7.03125 24.8438V5.15625H15.9375V10.7812C15.9375 11.1542 16.0857 11.5119 16.3494 11.7756C16.6131 12.0393 16.9708 12.1875 17.3438 12.1875H22.9688V24.8438H7.03125ZM18.8074 17.7551C18.9385 17.8857 19.0425 18.041 19.1135 18.2119C19.1845 18.3828 19.221 18.5661 19.221 18.7512C19.221 18.9363 19.1845 19.1195 19.1135 19.2904C19.0425 19.4614 18.9385 19.6166 18.8074 19.7473L15.9949 22.5598C15.8643 22.6909 15.709 22.7949 15.5381 22.8659C15.3672 22.9368 15.1839 22.9734 14.9988 22.9734C14.8137 22.9734 14.6305 22.9368 14.4596 22.8659C14.2886 22.7949 14.1334 22.6909 14.0027 22.5598L11.1902 19.7473C10.9261 19.4831 10.7776 19.1248 10.7776 18.7512C10.7776 18.3776 10.9261 18.0193 11.1902 17.7551C11.4544 17.4909 11.8127 17.3425 12.1863 17.3425C12.5599 17.3425 12.9182 17.4909 13.1824 17.7551L13.5938 18.1641V14.5312C13.5938 14.1583 13.7419 13.8006 14.0056 13.5369C14.2694 13.2732 14.627 13.125 15 13.125C15.373 13.125 15.7306 13.2732 15.9944 13.5369C16.2581 13.8006 16.4062 14.1583 16.4062 14.5312V18.1641L16.8176 17.7516C16.9484 17.621 17.1037 17.5176 17.2745 17.4471C17.4454 17.3767 17.6284 17.3406 17.8132 17.3409C17.998 17.3412 18.181 17.378 18.3515 17.449C18.5221 17.5201 18.6771 17.6241 18.8074 17.7551Z" fill="#6B7280"/>
</svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="h-10 w-10 rounded-full object-cover bg-gray-300"
                />
                <div>
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.invoice}</div>
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : p.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Amount:</span>{" "}
                {p.amount}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Plan:</span>{" "}
                {p.plan}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Billing Date:</span>{" "}
                {p.billingDate}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Next Renewal:</span>{" "}
                {p.nextRenewal}
              </div>
               <svg width="25" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.3699 9.31875L18.8074 2.75625C18.6768 2.62549 18.5217 2.52175 18.351 2.45097C18.1803 2.38019 17.9973 2.34376 17.8125 2.34375H6.5625C5.9409 2.34375 5.34476 2.59068 4.90522 3.03022C4.46568 3.46976 4.21875 4.0659 4.21875 4.6875V25.3125C4.21875 25.9341 4.46568 26.5302 4.90522 26.9698C5.34476 27.4093 5.9409 27.6562 6.5625 27.6562H23.4375C24.0591 27.6562 24.6552 27.4093 25.0948 26.9698C25.5343 26.5302 25.7812 25.9341 25.7812 25.3125V10.3125C25.7812 9.93983 25.6333 9.58241 25.3699 9.31875ZM18.75 6.67969L21.4453 9.375H18.75V6.67969ZM7.03125 24.8438V5.15625H15.9375V10.7812C15.9375 11.1542 16.0857 11.5119 16.3494 11.7756C16.6131 12.0393 16.9708 12.1875 17.3438 12.1875H22.9688V24.8438H7.03125ZM18.8074 17.7551C18.9385 17.8857 19.0425 18.041 19.1135 18.2119C19.1845 18.3828 19.221 18.5661 19.221 18.7512C19.221 18.9363 19.1845 19.1195 19.1135 19.2904C19.0425 19.4614 18.9385 19.6166 18.8074 19.7473L15.9949 22.5598C15.8643 22.6909 15.709 22.7949 15.5381 22.8659C15.3672 22.9368 15.1839 22.9734 14.9988 22.9734C14.8137 22.9734 14.6305 22.9368 14.4596 22.8659C14.2886 22.7949 14.1334 22.6909 14.0027 22.5598L11.1902 19.7473C10.9261 19.4831 10.7776 19.1248 10.7776 18.7512C10.7776 18.3776 10.9261 18.0193 11.1902 17.7551C11.4544 17.4909 11.8127 17.3425 12.1863 17.3425C12.5599 17.3425 12.9182 17.4909 13.1824 17.7551L13.5938 18.1641V14.5312C13.5938 14.1583 13.7419 13.8006 14.0056 13.5369C14.2694 13.2732 14.627 13.125 15 13.125C15.373 13.125 15.7306 13.2732 15.9944 13.5369C16.2581 13.8006 16.4062 14.1583 16.4062 14.5312V18.1641L16.8176 17.7516C16.9484 17.621 17.1037 17.5176 17.2745 17.4471C17.4454 17.3767 17.6284 17.3406 17.8132 17.3409C17.998 17.3412 18.181 17.378 18.3515 17.449C18.5221 17.5201 18.6771 17.6241 18.8074 17.7551Z" fill="#6B7280"/>
</svg>
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
