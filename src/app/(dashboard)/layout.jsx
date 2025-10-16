"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { Header } from "../../components/dashboard/header";

export default function DashboardGroupLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMobile(!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#FFFFFF] to-[#FFFBF5]">
      {/* Sidebar (off-canvas on small screens) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for small screens only */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main Content */}
      <div
        className="flex flex-1 flex-col overflow-hidden"
        onClick={() => {
          if (sidebarOpen && isMobile) setSidebarOpen(false);
        }}
      >
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
