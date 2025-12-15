// src/App.jsx

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";

// Layout component (Sidebar + Header wrapper)
import Layout from "./components/Layout";


/* -------------------------
   AUTH GUARD
-------------------------- */
// This component wraps protected routes and checks:
// 1️ If user is logged in
// 2️ If user's role matches the allowedRoles for this route
function RequireAuth({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // 1. If user is not logged in, redirect to login page
  if (!user) return <Navigate to="/" replace />;

  // 2. If user is logged in but role is not allowed, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role matches, render children components
  return children;
}


/* -------------------------
   APP ROOT
-------------------------- */
export default function App() {
  return (
    // AuthProvider wraps the entire app to provide auth context (user, login, logout)
    <AuthProvider>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />          {/* Login Page */}
        <Route path="/register" element={<Register />} />  {/* Register Page */}


        {/* ---------- PROTECTED ROUTES WITH LAYOUT ---------- */}

        {/* Create Ticket Route (accessible to all roles) */}
        <Route
          path="/create"
          element={
            <RequireAuth allowedRoles={["user", "agent", "admin"]}>
              <Layout>
                <CreateTicket />
              </Layout>
            </RequireAuth>
          }
        />

        {/* My Tickets Route (accessible to all roles) */}
        <Route
          path="/tickets"
          element={
            <RequireAuth allowedRoles={["user", "agent", "admin"]}>
              <Layout>
                <MyTickets />
              </Layout>
            </RequireAuth>
          }
        />

        {/* Agent Dashboard (only accessible to agents) */}
        <Route
          path="/agent"
          element={
            <RequireAuth allowedRoles={["agent"]}>
              <Layout>
                <AgentDashboard />
              </Layout>
            </RequireAuth>
          }
        />

        {/* Admin Dashboard (only accessible to admins) */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </RequireAuth>
          }
        />

        {/* ---------- UNAUTHORIZED PAGE ---------- */}
        <Route
          path="/unauthorized"
          element={<div className="card">Unauthorized Access</div>}
        />

      </Routes>
    </AuthProvider>
  );
}
