// src/pages/MyTickets.jsx
import React from 'react';
import TicketList from '../components/TicketList'; // Import the reusable TicketList component

// Page component to display all tickets submitted by the user
export default function MyTickets() {
  return (
    <div>
      {/* Render the TicketList component which handles fetching, pagination, and display */}
      <TicketList />
    </div>
  );
}
