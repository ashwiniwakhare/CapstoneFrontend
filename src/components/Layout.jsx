import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Sidebar component: always visible on the left side */}
      <Sidebar />

      <div className="main-content">
        {/* Header component: always visible at the top */}
        <Header />

        {/* Page content area: renders the component passed as children */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
