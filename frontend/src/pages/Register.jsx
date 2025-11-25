import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default admin
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const endpoint =
        role === "admin"
          ? "http://127.0.0.1:8000/register/admin"
          : "http://127.0.0.1:8000/register/user";

      const payload = {
        name,
        email,
        password,
      };

      const res = await axios.post(endpoint, payload);
      setMessage(res.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/"); // redirect to login
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "#7c3aed", marginBottom: "1.5rem" }}>Tube Tutor</h1>
      <div className="card login-card">
        <h2 style={{ textAlign: "center" }}>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
            onClick={() => setRole("user")}
          >
            User
          </button>
          <button
            style={{ flex: 1, backgroundColor: "#ec4899" }}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <button
          onClick={handleRegister}
          style={{
            backgroundColor: "#10b981",
            marginTop: "1rem",
            padding: "0.6rem",
            borderRadius: "0.5rem",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Register
        </button>

        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
