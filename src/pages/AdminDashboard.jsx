import React, { useEffect, useState } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";

// Colors for agent performance bar chart
const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

export default function AdminDashboard() {
  // --------------------------
  // STATE VARIABLES
  // --------------------------
  const [tickets, setTickets] = useState([]); // All tickets
  const [volume, setVolume] = useState([]); // Ticket volume over last 30 days
  const [sla, setSla] = useState({ breach_rate_percent: 0 }); // SLA breach data
  const [agentPerf, setAgentPerf] = useState([]); // Agent performance data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error handling
  const [tfidfLoading, setTfidfLoading] = useState(false); // TF-IDF processing state

  // --------------------------
  // FETCH DASHBOARD DATA ON COMPONENT MOUNT
  // --------------------------
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Fetch all tickets
        const t = await api.get("/tickets/");
        const ticketList = Array.isArray(t.data.results)
          ? t.data.results
          : Array.isArray(t.data)
          ? t.data
          : [];
        setTickets(ticketList);

        // 2️⃣ Fetch ticket volume (last 30 days)
        const vol = await api.get("/tickets/tickets/analytics/?action=volume_by_date");
        setVolume(Array.isArray(vol.data) ? vol.data : []);

        // 3️⃣ Fetch SLA breach data
        const slaRes = await api.get("/tickets/tickets/analytics/?action=sla_breach_rate");
        setSla(slaRes.data || { breach_rate_percent: 0 });

        // 4️⃣ Fetch agent performance data
        const ap = await api.get("/tickets/tickets/analytics/?action=agent_performance");
        setAgentPerf(Array.isArray(ap.data) ? ap.data : []);
      } catch (err) {
        console.error("Admin Dashboard Error:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // --------------------------
  // SHOW LOADING OR ERROR STATES
  // --------------------------
  if (loading) return <div className="card">Loading admin dashboard...</div>;
  if (error) return <div className="card" style={{ color: "red" }}>{error}</div>;

  // --------------------------
  // HANDLE TF-IDF PRIORITY UPDATE
  // --------------------------
  const handleRunTfidf = async () => {
    try {
      setTfidfLoading(true);

      // Trigger TF-IDF ranking task
      await api.post("/tickets/tickets/run-tfidf/");

      // Wait a short time for Celery to process
      await new Promise(r => setTimeout(r, 2000));

      // Fetch updated tickets
      const t = await api.get("/tickets/tickets/");
      const ticketList = t.data.results || t.data || [];
      setTickets(ticketList);

      alert(`Ranking triggered! Total tickets: ${ticketList.length}`);
    } catch (err) {
      console.error("Error running TF-IDF:", err);
      alert("Failed to run TF-IDF");
    } finally {
      setTfidfLoading(false);
    }
  };

  // --------------------------
  // CALCULATE SLA BREACH RATE (OPEN > 24HRS)
  // --------------------------
  const computeSlaBreach = () => {
    const totalTickets = tickets.length;
    if (!totalTickets) return 0;

    const now = new Date();

    // Count tickets open or in-progress for more than 24 hours
    const breachedTickets = tickets.filter(ticket => {
      if (ticket.status === "open" || ticket.status === "in_progress") {
        const createdAt = new Date(ticket.created_at);
        const hoursOpen = (now - createdAt) / (1000 * 60 * 60);
        return hoursOpen > 24;
      }
      return false;
    }).length;

    return ((breachedTickets / totalTickets) * 100).toFixed(2);
  };

  // --------------------------
  // RENDER DASHBOARD
  // --------------------------
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
      {/* LEFT PANEL: Charts */}
      <div className="card">
        {/* Ticket Volume Line Chart */}
        <h4>Ticket Volume (Last 30 Days)</h4>
        <div style={{ height: 300 }}>
          {volume.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volume}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No volume data available.</p>
          )}
        </div>

        {/* Agent Performance Bar Chart */}
        <h4 style={{ marginTop: 16 }}>Agent Performance</h4>
        <div style={{ height: 300 }}>
          {agentPerf.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerf}>
                <XAxis dataKey="agent" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved">
                  {agentPerf.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No agent performance data available.</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Quick Stats & TF-IDF */}
      <div className="card">
        <h4>Quick Controls & SLA</h4>
        <div style={{ marginBottom: 8 }}>
          <div className="kv">Total Tickets: {tickets.length}</div>
          <div className="kv">SLA Breach Rate: {computeSlaBreach()}%</div>
          <div className="kv">Open: {tickets.filter(t => t.status === "open").length}</div>
          <div className="kv">In Progress: {tickets.filter(t => t.status === "in_progress").length}</div>
          <div className="kv">Waiting: {tickets.filter(t => t.status === "waiting").length}</div>
          <div className="kv">Resolved & Closed: {tickets.filter(t => t.status === "closed" || t.status === "resolved").length}</div>
        </div>

        <button className="btn" style={{ marginTop: 12 }} onClick={handleRunTfidf}>
          {tfidfLoading ? "Updating Priority..." : "Update Ticket Priority"}
        </button>
      </div>
    </div>
  );
}
