import React, { useEffect, useState } from "react";
import api from "../api";
import "./AgentDashboard.css";

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  // Fetch tickets assigned to agent
  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await api.get("/tickets/tickets/?assigned_to=me");
        setTickets(res.data.results || res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    }
    fetchTickets();
  }, []);

  // Slice tickets for pagination
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  // Update ticket status
  async function updateStatus(status) {
    if (!selectedTicket || selectedTicket.status === "closed") return;

    setLoading(true);
    try {
      const res = await api.patch(`/tickets/tickets/${selectedTicket.id}/`, {
        status: status,
      });

      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? res.data : t))
      );

      setSelectedTicket(res.data);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  const isClosed = selectedTicket?.status === "closed";

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
      
      {/* LEFT SIDE → Ticket List */}
      <div className="card">
        <h2>Assigned Tickets</h2>

        {currentTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-row"
            onClick={() => setSelectedTicket(ticket)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              background: selectedTicket?.id === ticket.id ? "#eefaff" : "white",
            }}
          >
            <strong>{ticket.title}</strong>

            <div style={{ marginTop: "4px" }}>
              Status: {ticket.status} &nbsp; | &nbsp;
              Priority:{" "}
              <span
                style={{
                  color:
                    ticket.priority === "High"
                      ? "red"
                      : ticket.priority === "Medium"
                      ? "orange"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {ticket.priority}
              </span>
            </div>
          </div>
        ))}

        {tickets.length === 0 && <p>No tickets assigned.</p>}

        {/* PAGINATION BUTTONS */}
       {tickets.length > 10 && (
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          style={{
            padding: "6px 12px",
            background: currentPage === 1 ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        <span
          style={{
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          style={{
            padding: "6px 12px",
            background: currentPage === totalPages ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    )}

      </div>

      {/* RIGHT SIDE → Ticket Details */}
      <div className="card">
        <h2>Ticket Details</h2>

        {!selectedTicket ? (
          <p>Select a ticket to view details</p>
        ) : (
          <>
            <h3>{selectedTicket.title}</h3>

            <p>
              <strong>Description:</strong> {selectedTicket.description}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {selectedTicket.category ? selectedTicket.category.name : "—"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${selectedTicket.status.toLowerCase()}`}>
                {selectedTicket.status}
              </span>
            </p>

            <p>
              <strong>Created by:</strong>{" "}
              {selectedTicket.created_by?.username} ({selectedTicket.created_by?.email})
            </p>

            {selectedTicket.attachments?.length > 0 && (
              <div>
                <strong>Attachments:</strong>
                <ul>
                  {selectedTicket.attachments.map((att) => (
                    <li key={att.id}>
                      <a href={att.file} target="_blank" rel="noopener noreferrer">
                        {att.file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h4>Update Status</h4>
            <div className="status-buttons">
              <button disabled={loading || isClosed} onClick={() => updateStatus("open")}>
                Open
              </button>
              <button
                disabled={loading || isClosed}
                onClick={() => updateStatus("in_progress")}
              >
                In Progress
              </button>
              <button
                disabled={loading || isClosed}
                onClick={() => updateStatus("waiting")}
              >
                Waiting
              </button>
              <button
                disabled={loading || isClosed}
                onClick={() => updateStatus("resolved")}
              >
                Resolved
              </button>
              <button
                disabled={loading || isClosed}
                onClick={() => updateStatus("closed")}
              >
                Close Ticket
              </button>
            </div>

            {isClosed && (
              <p style={{ color: "red", marginTop: "10px" }}>
                This ticket is closed and cannot be modified.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
