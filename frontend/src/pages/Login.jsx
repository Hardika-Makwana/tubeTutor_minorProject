import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    // Replace with your API call
    console.log("Logging in as", role, "Email:", email, "Password:", password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-50 via-pink-50 to-white px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-700">Tube Tutor</h1>
        <p className="text-xl text-purple-400 mt-2">AI Summariser</p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="password"
          placeholder="Password (Admin only)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        {/* Buttons for User/Admin */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleLogin("user")}
            className="flex-1 bg-purple-300 text-white py-3 rounded-lg hover:bg-purple-400 transition-colors"
          >
            Login as User
          </button>
          <button
            onClick={() => handleLogin("admin")}
            className="flex-1 bg-pink-300 text-white py-3 rounded-lg hover:bg-pink-400 transition-colors"
          >
            Login as Admin
          </button>
        </div>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Forgot your password? <a href="#" className="text-purple-500">Reset</a>
        </p>
      </div>
    </div>
  );
}









