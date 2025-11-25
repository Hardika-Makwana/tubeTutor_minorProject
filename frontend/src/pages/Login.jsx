import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url =
        role === "admin"
          ? "http://127.0.0.1:8000/login/admin"
          : "http://127.0.0.1:8000/login/user";

      const res = await axios.post(url, { email, password });

      localStorage.setItem("role", role);
      localStorage.setItem("user_id", res.data.user_id || res.data.admin_id);
      setMessage("✅ Login successful!");

      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("❌ Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-pink-200">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🌸 Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <label className="text-gray-700 font-medium">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />{" "}
              User
            </label>
            <label className="text-gray-700 font-medium">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />{" "}
              Admin
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600 transition-all duration-200"
          >
            Login
          </button>
          {message && (
            <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
          )}
        </form>
        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
















