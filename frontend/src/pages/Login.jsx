import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-200 p-4 rounded-full">
            <svg
              className="w-12 h-12 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0v2m6 4h2a2 2 0 002-2v-3a2 2 0 00-2-2h-2m-6 0H6a2 2 0 00-2 2v3a2 2 0 002 2h6"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-800 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-400 text-white py-2 rounded-lg hover:bg-purple-500 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Forgot your password? <a href="#" className="text-purple-500">Reset</a>
        </p>
      </div>
    </div>
  );
}





