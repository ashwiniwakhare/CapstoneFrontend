// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import api from "../api"; // Axios instance for API requests
import { AuthContext } from "../AuthContext"; // Context for authentication state
import { useNavigate, Link } from "react-router-dom"; // Navigation and linking
import "../styles/login.css"; // Login page styles

export default function Login() {
  // --------------------------
  // STATE VARIABLES
  // --------------------------
  const [username, setUsername] = useState(""); // Input: username
  const [password, setPassword] = useState(""); // Input: password

  const { login } = useContext(AuthContext); // Access login function from context
  const nav = useNavigate(); // React Router navigation

  // --------------------------
  // HANDLE FORM SUBMISSION
  // --------------------------
  async function submit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send POST request to get JWT token
      const res = await api.post("/auth/token/", { username, password });
      const token = res.data.access; // JWT access token

      // Call login function from AuthContext to store token
      login(token);

      // Decode JWT payload to get user role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // Redirect user based on role
      if (role === "admin") nav("/admin");
      else if (role === "agent") nav("/agent");
      else nav("/tickets");
    } catch (err) {
      // Display error for failed login
      alert("Login failed");
    }
  }

  // --------------------------
  // RENDER COMPONENT
  // --------------------------
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue to your dashboard</p>

        {/* Login Form */}
        <form onSubmit={submit} className="login-form">
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn">Login</button>
        </form>

        {/* Footer with register link */}
        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link className="login-link" to="/register">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
