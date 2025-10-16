"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {children}
    </div>
  );
}
