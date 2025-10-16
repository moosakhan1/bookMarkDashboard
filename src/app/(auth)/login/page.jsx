"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard"); // redirect after login
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover filter brightness-75"
        />
      </div>

      {/* Card Container */}
      <div
        className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl 
                   rounded-2xl bg-white/60 md:bg-white/40 
                   overflow-hidden relative z-10 shadow-2xl backdrop-blur-lg"
      >
        {/* Left Side - Logo */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10 bg-white/60">
          <span className="text-2xl cursor-pointer font-bold text-gray-900">
            <img
              src="/BookMark.png"
              alt="BookMark Logo"
              className="w-40 h-40 object-contain"
            />
          </span>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center md:bg-white/60">
          <h1 className="text-2xl mb-6 text-start font-bold text-[#333333]">
            BookMark
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Enter Email Address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-5 py-4 rounded-full border border-gray-300
                bg-white/80 text-gray-800 placeholder-gray-500
                focus:border-[#eeff00] focus:ring-2 focus:ring-[#eeff00]/50
                outline-none transition
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-5 py-4 rounded-full border border-gray-300
                bg-white/80 text-gray-800 placeholder-gray-500
                focus:border-[#eeff00] focus:ring-2 focus:ring-[#eeff00]/50
                outline-none transition
              "
            />

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#eeff00] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full 
                bg-gradient-to-r from-[#eeff00] to-[#eeff00]
                text-gray-900 py-4 rounded-full font-semibold text-[12px] shadow-md transition
                hover:opacity-90 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
