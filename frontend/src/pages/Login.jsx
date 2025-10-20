import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    try {
      let url = role === "admin" 
        ? "http://127.0.0.1:8000/admin/login" 
        : "http://127.0.0.1:8000/user/login";

      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Save token and role to localStorage
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", role);

      setMessage("Login successful!");

      // Redirect based on role
      if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Check email/password.");
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "#7c3aed", marginBottom: "1.5rem" }}>Tube Tutor</h1>
      <div className="card login-card">
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            style={{ flex: 1, backgroundColor: "#7c3aed" }}
            onClick={() => handleLogin("user")}
          >
            User
          </button>
          <button
            style={{ flex: 1, backgroundColor: "#ec4899" }}
            onClick={() => handleLogin("admin")}
          >
            Admin
          </button>
        </div>
        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}












