import React, { useContext } from "react";
// Link and useNavigate from react-router-dom for navigation between pages
import { Link, useNavigate } from "react-router-dom";
// Import AuthContext to access user info and logout function
import { AuthContext } from "../AuthContext";
import "../styles/navbar.css";

export default function NavBar() {
  // Destructure user and logout function from context
  const { user, logout } = useContext(AuthContext);
  // Hook to programmatically navigate to a route
  const nav = useNavigate();

  return (
    <nav className="navbar">
      {/* Left side of navbar: Logo */}
      <div className="nav-left">
        <h2 className="logo">AI Support</h2>
      </div>

      {/* Right side of navbar: User info / login links */}
      <div className="nav-right">
        {user ? (
          <>
            {/* Display username if user is logged in */}
            <span className="nav-user">{user.username}</span>

            {/* Logout button */}
            <button
              className="logout-btn"
              onClick={() => {
                logout(); // Call logout function from AuthContext
                nav("/");  // Redirect to home/login page
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show login/register links if no user is logged in */}
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
