"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Mail } from "lucide-react";

export function Header({ onToggleSidebar = () => {} }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="flex h-16 items-center justify-between gap-4 border-b border-[#FFEFD5] px-4 md:px-6"
      style={{
        background: "linear-gradient(90deg, #FFFFFF 0%, #FFFBF5 100%)",
      }}
    >
      {/* Greeting */}
      <div className="flex items-center gap-2">
        {/* Mobile: hamburger to toggle sidebar */}
        <button
          onClick={onToggleSidebar}
          className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white border md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="text-lg font-bold text-gray-900 hidden md:inline">
          Hello Thomas <span>👋</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search"
          className="w-full pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B7280] border border-gray-200 bg-[#FFFFFF]"
        />
      </div>

      {/* Icons & Avatar */}
      <div className="flex items-center gap-2 ml-4 relative">
        <button className="relative p-2 rounded-md border border-gray-100">
          <Bell className="h-5 w-5 text-[#6B7280]" />
        </button>
        <button className="p-2 rounded-md border border-gray-100">
          <Mail className="h-5 w-5 text-[#6B7280]" />
        </button>

        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 rounded-md "
          >
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-medium">
              TH
            </div>
            <span className="text-sm font-medium text-gray-900">Thomas</span>
            <svg
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.69506 7.66341C6.47539 7.88308 6.11929 7.88308 5.89961 7.66341L0.164751 1.92853C-0.0549169 1.70886 -0.0549169 1.35276 0.164751 1.13308L0.429921 0.867881C0.649588 0.648206 1.00574 0.648206 1.22542 0.867881L6.29734 5.93983L11.3693 0.867881C11.589 0.648206 11.9451 0.648206 12.1647 0.867881L12.4299 1.13308C12.6496 1.35276 12.6496 1.70886 12.4299 1.92853L6.69506 7.66341Z"
                fill="#1F1E1E"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-10">
              <div className="px-4 py-2 text-gray-500 text-sm">My Account</div>
              <div className="border-t border-gray-200"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Settings
              </button>
              <div className="border-t border-gray-200"></div>
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
