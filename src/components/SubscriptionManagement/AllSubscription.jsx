"use client";

import React from "react";
import { Search, Eye, X } from "lucide-react";

export default function AllPlans() {
  const plans = [
    {
      id: "SP-001",
      name: "Basic Monthly",
      duration: "1 Month",
      books: "3 Books",
      price: "$15.00",
      users: "120 Users",
      createdOn: "10 Jan 2025",
      status: "Active",
    },
    {
      id: "SP-002",
      name: "Quarterly Reader",
      duration: "3 Months",
      books: "6 Books",
      price: "$40.00",
      users: "75 Users",
      createdOn: "18 Feb 2025",
      status: "Active",
    },
    {
      id: "SP-003",
      name: "Yearly Pro",
      duration: "12 Months",
      books: "15 Books",
      price: "$150.00",
      users: "50 Users",
      createdOn: "05 Mar 2025",
      status: "Active",
    },
    {
      id: "SP-004",
      name: "Student Lite",
      duration: "1 Month",
      books: "2 Books",
      price: "$9.00",
      users: "32 Users",
      createdOn: "02 Apr 2025",
      status: "Inactive",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
        Subscription Plans
      </h2>
      <p className="text-gray-500 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      {/* Desktop Table */}
      <div className="bg-white border border-[#E0DDDD] rounded-xl p-4 md:p-6 hidden md:block">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto md:ml-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
              />
            </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#737373] bg-white text-[#737373]  w-full sm:w-auto">
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
    <thead className="text-[#1F1E1E]">
      <tr className="border-b border-[#E0DDDD]">
        {[
          // "Plan ID",
          "Plan Name ↓",
          "Duration ↓",
          "Books Allowed ↓",
          "Price ↓",
          "Active Users ↓",
          "Created On ↓",
          "Status ↓",
          "Action",
        ].map((title) => (
          <th
            key={title}
            className="px-4 py-3 text-left font-bold whitespace-nowrap"
          >
            {title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {plans.map((plan, i) => (
        <tr
          key={i}
          className="border-b border-[#E0DDDD] hover:bg-gray-50 transition-colors"
        >
          <td className="px-4 py-3 font-medium text-[#1F1E1E] whitespace-nowrap">
            {plan.id}
          </td>
          <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
            {plan.name}
          </td>
          <td className="px-4 py-3 whitespace-nowrap">{plan.duration}</td>
          <td className="px-4 py-3 whitespace-nowrap">{plan.books}</td>
          <td className="px-4 py-3 whitespace-nowrap">{plan.price}</td>
          <td className="px-4 py-3 whitespace-nowrap">{plan.users}</td>
          <td className="px-4 py-3 whitespace-nowrap">{plan.createdOn}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-4 py-2 text-xs font-medium rounded-full ${
                plan.status === "Active"
                  ? "bg-[#CAF9DB] text-[#166534]"
                  : "bg-[#FFF0F0] text-[#A70909]"
              }`}
            >
              {plan.status}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
            <button className="text-gray-600 hover:text-blue-600">
              <Eye size={18} />
            </button>
            <button className="text-red-500 hover:text-red-700">
              {/* Delete SVG here */}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* ll */}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="font-medium text-gray-900">{plan.name}</div>
                <div className="text-xs text-gray-500">{plan.id}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.status === "Active"
                    ? "bg-[#CAF9DB] text-[#166534]"
                    : "bg-[#FFF0F0] text-[#A70909]"
                }`}
              >
                {plan.status}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Duration:</span> {plan.duration}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Books Allowed:</span> {plan.books}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Price:</span> {plan.price}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Active Users:</span> {plan.users}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Created On:</span> {plan.createdOn}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                title="View"
              >
                <Eye size={20} />
              </button>
              <button
                className="p-2 rounded-md border border-gray-200 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                           <svg width="18" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.4133 9.91328L14.3254 13L17.4133 16.0867C17.5004 16.1738 17.5695 16.2772 17.6166 16.391C17.6638 16.5048 17.688 16.6268 17.688 16.75C17.688 16.8732 17.6638 16.9952 17.6166 17.109C17.5695 17.2228 17.5004 17.3262 17.4133 17.4133C17.3262 17.5004 17.2228 17.5695 17.109 17.6166C16.9952 17.6638 16.8732 17.688 16.75 17.688C16.6268 17.688 16.5048 17.6638 16.391 17.6166C16.2772 17.5695 16.1738 17.5004 16.0867 17.4133L13 14.3254L9.91329 17.4133C9.82618 17.5004 9.72278 17.5695 9.60897 17.6166C9.49516 17.6638 9.37319 17.688 9.25 17.688C9.12682 17.688 9.00485 17.6638 8.89104 17.6166C8.77723 17.5695 8.67383 17.5004 8.58672 17.4133C8.49962 17.3262 8.43053 17.2228 8.38339 17.109C8.33625 16.9952 8.31198 16.8732 8.31198 16.75C8.31198 16.6268 8.33625 16.5048 8.38339 16.391C8.43053 16.2772 8.49962 16.1738 8.58672 16.0867L11.6746 13L8.58672 9.91328C8.41081 9.73737 8.31198 9.49878 8.31198 9.25C8.31198 9.00122 8.41081 8.76263 8.58672 8.58672C8.76264 8.4108 9.00123 8.31198 9.25 8.31198C9.49878 8.31198 9.73737 8.4108 9.91329 8.58672L13 11.6746L16.0867 8.58672C16.1738 8.49961 16.2772 8.43052 16.391 8.38338C16.5048 8.33624 16.6268 8.31198 16.75 8.31198C16.8732 8.31198 16.9952 8.33624 17.109 8.38338C17.2228 8.43052 17.3262 8.49961 17.4133 8.58672C17.5004 8.67382 17.5695 8.77723 17.6166 8.89103C17.6638 9.00484 17.688 9.12682 17.688 9.25C17.688 9.37318 17.6638 9.49516 17.6166 9.60896C17.5695 9.72277 17.5004 9.82618 17.4133 9.91328ZM25.1875 13C25.1875 15.4105 24.4727 17.7668 23.1335 19.771C21.7944 21.7752 19.8909 23.3373 17.664 24.2598C15.437 25.1822 12.9865 25.4236 10.6223 24.9533C8.2582 24.4831 6.08659 23.3223 4.38214 21.6179C2.67769 19.9134 1.51694 17.7418 1.04668 15.3777C0.576428 13.0135 0.817781 10.563 1.74022 8.33604C2.66267 6.10907 4.22477 4.20564 6.22899 2.86646C8.23322 1.52728 10.5895 0.8125 13 0.8125C16.2313 0.815912 19.3292 2.10104 21.6141 4.3859C23.899 6.67076 25.1841 9.76872 25.1875 13ZM23.3125 13C23.3125 10.9604 22.7077 8.96656 21.5745 7.27068C20.4414 5.5748 18.8308 4.25302 16.9464 3.47249C15.0621 2.69196 12.9886 2.48774 10.9881 2.88565C8.98771 3.28356 7.1502 4.26573 5.70797 5.70796C4.26574 7.15019 3.28357 8.9877 2.88566 10.9881C2.48775 12.9886 2.69197 15.0621 3.4725 16.9464C4.25303 18.8308 5.5748 20.4414 7.27069 21.5745C8.96657 22.7077 10.9604 23.3125 13 23.3125C15.7341 23.3094 18.3553 22.2219 20.2886 20.2886C22.2219 18.3553 23.3094 15.7341 23.3125 13Z" fill="#A70909"/>
</svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
