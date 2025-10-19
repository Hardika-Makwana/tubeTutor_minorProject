import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    // Replace with real API auth
    console.log("Logging in as", role, "Email:", email);
    onLogin(role); // Pass role to parent
  };

  return (
    <div className="login-container">
      <h1 style={{color:"#7c3aed", marginBottom:"1.5rem"}}>Tube Tutor</h1>
      <div className="card login-card">
        <h2 style={{textAlign:"center"}}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (Admin only)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{display:"flex", gap:"1rem"}}>
          <button style={{flex:1, backgroundColor:"#7c3aed"}} onClick={() => handleLogin("user")}>User</button>
          <button style={{flex:1, backgroundColor:"#ec4899"}} onClick={() => handleLogin("admin")}>Admin</button>
        </div>
      </div>
    </div>
  );
}











