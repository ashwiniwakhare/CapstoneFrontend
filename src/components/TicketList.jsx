import React, { useEffect, useState } from "react";
// Import custom API instance for making requests
import api from "../api";
import "../styles/ticketlist.css";

export default function MyTicketList() {
  // State to store all fetched tickets
  const [tickets, setTickets] = useState([]);
  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 10 tickets per page

  // State to store tickets for the current page
  const [paginatedTickets, setPaginatedTickets] = useState([]);
  // Total number of pages
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tickets when component mounts
  useEffect(() => {
    async function fetchTickets() {
      try {
        // API call to get tickets created by the current user
        const res = await api.get("/tickets/tickets/?mine=true");
        const allTickets = res.data.results || res.data; // get array
        setTickets(allTickets);
        setTotalPages(Math.ceil(allTickets.length / pageSize));
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
    }
    fetchTickets();
  }, []);

  // Update paginated tickets whenever tickets or currentPage changes
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedTickets(tickets.slice(start, end));
  }, [tickets, currentPage]);

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container">
      {/* Table to display tickets */}
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Resolved By</th>
            <th>Created At</th>
            <th>Last Updated At</th>
          </tr>
        </thead>

        <tbody>
          {/* Show message if no tickets found */}
          {paginatedTickets.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                No tickets found.
              </td>
            </tr>
          ) : (
            // Map each ticket to a table row
            paginatedTickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.category ? t.category.name : "—"}</td>
                <td>
                  {/* Status badge with dynamic CSS class */}
                  <span className={`status-badge ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
                <td>{t.priority}</td>
                <td>{t.assigned_to ? t.assigned_to.username : "—"}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>{new Date(t.updated_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
