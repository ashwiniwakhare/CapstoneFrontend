import React, { useState, useEffect } from 'react';

/**
 * TicketFilterBar component
 * -------------------------
 * A reusable filter bar for filtering tickets by:
 * - Status
 * - Priority
 * - Assigned to
 * - Text search
 * - Start and end dates
 * 
 * Props:
 * - onFilterChange: function called whenever filters change, with current filter values
 */
export default function TicketFilterBar({ onFilterChange }) {
  // State to store all filter values
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_to: '',
    search: '',
    start_date: '',
    end_date: ''
  });

  // Effect: triggers onFilterChange with debounce (500ms) whenever filters change
  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChange(filters); // Pass current filter values to parent
    }, 500);

    // Cleanup timeout on component unmount or filter change
    return () => clearTimeout(delay);
  }, [filters]);

  // Handle input/select changes
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div 
      style={{
        padding: 12,
        background: '#fff',
        borderRadius: 8,
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}
    >
      {/* Filter by Status */}
      <select name='status' onChange={handleChange} className='input'>
        <option value=''>Status</option>
        <option value='open'>open</option>
        <option value='in_progress'>in_progress</option>
        <option value='resolved'>resolved</option>
      </select>

      {/* Filter by Priority */}
      <select name='priority' onChange={handleChange} className='input'>
        <option value=''>Priority</option>
        <option value='low'>low</option>
        <option value='medium'>medium</option>
        <option value='high'>high</option>
      </select>

      {/* Text search */}
      <input 
        type='text' 
        name='search' 
        placeholder='Search...' 
        className='input' 
        onChange={handleChange} 
      />

      {/* Filter by start date */}
      <input 
        type='date' 
        name='start_date' 
        className='input' 
        onChange={handleChange} 
      />

      {/* Filter by end date */}
      <input 
        type='date' 
        name='end_date' 
        className='input' 
        onChange={handleChange} 
      />
    </div>
  );
}
