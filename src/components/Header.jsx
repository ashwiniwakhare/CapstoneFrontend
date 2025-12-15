import React, { useContext } from "react";
// Import the AuthContext to access logged-in user information
import { AuthContext } from "../AuthContext";
import "../styles/header.css";

export default function Header() {
  // Get the current logged-in user from context
  const { user } = useContext(AuthContext);

  // If no user is logged in, do not render the header
  if (!user) return null;

  // Determine the header title based on the user's role
  const title =
    user.role === "admin"
      ? "Admin Management"
      : user.role === "agent"
      ? "Agent Management"
      : "User Management";

  return (
    <header className="header">
      {/* Display dynamic title based on user role */}
      <h2>{title}</h2>

      <div className="header-right">
        {/* Search input for filtering or searching items */}
        <input className="search" placeholder="Search..." />
        {/* Display logged-in user's username */}
        <span>{user.username}</span>
      </div>
    </header>
  );
}
