// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css"; // Reuse the same CSS as Login page

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  // Handle input change for all fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check password confirmation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Register user via API
      await api.post("/auth/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert("Registration successful! Logging in...");

      // 2️⃣ Automatically login after registration
      const loginRes = await api.post("/auth/token/", {
        username: form.username,
        password: form.password,
      });

      const token = loginRes.data.access;
      login(token); // Store token in AuthContext

      // 3️⃣ Redirect based on user role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "admin") nav("/admin");
      else if (role === "agent") nav("/agent");
      else nav("/tickets");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Register to access your dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="login-input"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="login-input"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="login-input"
          />

          {/* Role Selection */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="login-input"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          <button className="login-btn" type="submit">
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>Already have an account? </span>
          <Link className="login-link" to="/">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
