import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const isNormalUser = user?.role === "user";
  const isAgent = user?.role === "agent";
  const isAdmin = user?.role === "admin";

  return (
    <aside className="sidebar">
      {/* TOP BRAND */}
      <div className="sidebar-header">
        <h3 className="sidebar-title">SupportHub</h3>
      </div>

      {/* MENU SECTION */}
      <nav className="sidebar-menu">
        {!user && (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {/* NORMAL USER */}
            {isNormalUser && (
              <>
                <Link to="/create">New Ticket</Link>
                <Link to="/tickets">Tickets Logs</Link>
              </>
            )}

            {/* AGENT */}
            {isAgent && <Link to="/agent">Agent Dashboard</Link>}

            {/* ADMIN */}
            {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          </>
        )}
      </nav>

      {/* BOTTOM → USERNAME + LOGOUT */}
      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-username">{user.username}</div>

          <button
            className="sidebar-logout"
            onClick={() => {
              logout();
              nav("/");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
