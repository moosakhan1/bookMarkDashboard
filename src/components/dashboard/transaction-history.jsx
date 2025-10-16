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
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="border border-gray-200 rounded-lg bg-white ">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4  border-gray-200 gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7  py-2 w-64 border border-[#737373] rounded-full focus:outline-none focus:ring-2 focus:ring-[#737373]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#737373] border border-[#737373] rounded-full  transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="border-r">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">User Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Invoice</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Plan</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Billing Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Next Renewal</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#1F1E1E]">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-medium">
                      {transaction.avatar ? <img src={transaction.avatar} alt={transaction.name} /> : transaction.initials}
                    </div>
                    <span className="font-medium text-gray-900">{transaction.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-medium text-gray-900">{transaction.invoice}</td>
                <td className="px-4 py-2 text-gray-900">{transaction.amount}</td>
                <td className="px-4 py-2 text-gray-500">{transaction.plan}</td>
                <td className="px-4 py-2 text-gray-500">{transaction.billingDate}</td>
                <td className="px-4 py-2 text-gray-500">{transaction.nextRenewal}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      transaction.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : transaction.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {transaction.status}
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
    </div>
  )
}
