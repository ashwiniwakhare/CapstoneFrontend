import React from 'react';

// TicketCard component: displays individual ticket information in a card/list format
export default function TicketCard({ ticket }) {
  return (
    <div className='list-item'>
      {/* Flex container to arrange ticket info and priority side by side */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* LEFT SIDE → Ticket details */}
        <div>
          {/* Ticket ID and Title */}
          <div style={{ fontWeight: 600 }}>
            {ticket.ticket_id} — {ticket.title}
          </div>

          {/* Created by username and creation date/time */}
          <div className='kv'>
            {ticket.created_by?.username} • {new Date(ticket.created_at).toLocaleString()}
          </div>
        </div>

        {/* RIGHT SIDE → Ticket priority */}
        <div style={{ textAlign: 'right' }}>
          <div className='kv'>Priority</div>
          <div style={{ fontWeight: 700 }}>{ticket.priority}</div>
        </div>

      </div>
    </div>
  );
}
