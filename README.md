🎟️ Ticket Management System – Frontend

A role-based React.js frontend for a Ticket Management System that allows users to create tickets, agents to manage and resolve them, and admins to monitor analytics and performance dashboards.

🚀 Features

🔐 JWT Authentication (Login & Registration)

👥 Role-Based Access Control

User Dashboard

Agent Dashboard

Admin Dashboard

🎫 Create & Manage Support Tickets

📊 Admin Analytics Dashboard

Ticket volume trends

SLA breach rate

Agent performance

🤖 AI-based Ticket Priority Update (TF-IDF integration)

📎 File Upload Support

🧭 Protected Routes with Layout (Sidebar + Header)

⚡ Reusable Axios API Service

🎨 Responsive & Clean UI

🛠️ Tech Stack

React.js (Vite)

React Router DOM

Context API (Auth Management)

Axios (API Calls)

Recharts (Charts & Analytics)

JWT Decode

CSS / Inline Styling

📁 Project Structure
src/
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   └── Header.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CreateTicket.jsx
│   ├── MyTickets.jsx
│   ├── AdminDashboard.jsx
│   └── AgentDashboard.jsx
├── AuthContext.jsx
├── api.js
├── App.jsx
└── styles/

🔐 Authentication Flow

User logs in or registers

Backend returns JWT token

Token is stored in localStorage

User role is decoded from JWT

Routes are protected based on roles:

user → My Tickets

agent → Agent Dashboard

admin → Admin Dashboard

🔄 API Integration

Centralized Axios instance (api.js)

Automatically attaches JWT token to requests

Handles:

Ticket CRUD

Analytics APIs

Authentication APIs

📊 Admin Dashboard Highlights

Ticket Volume (Last 30 Days)

SLA Breach Rate (24-hour rule)

Agent Performance Bar Chart

One-click AI Priority Update using TF-IDF

⚙️ Environment Setup

Create a .env file in the root:

VITE_API_BASE=http://localhost:8000/api

▶️ Run Locally
# Install dependencies
npm install

# Start development server
npm run dev

🔒 Route Protection Example
<RequireAuth allowedRoles={["admin"]}>
  <Layout>
    <AdminDashboard />
  </Layout>
</RequireAuth>

🎯 Future Enhancements

Real-time updates using WebSockets

Notification system

Dark mode

Advanced ticket search & filters

👨‍💻 Author

Ashwini Wakhare
Full Stack Python Developer (Django + React)
