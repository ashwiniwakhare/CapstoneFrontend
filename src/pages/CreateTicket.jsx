// src/pages/CreateTicket.jsx
import React, { useState, useEffect } from 'react'
import api from '../api'
import "./CreateTicket.css";

export default function CreateTicket() {
  // --------------------------
  // STATE VARIABLES
  // --------------------------
  const [title, setTitle] = useState('') // Ticket title
  const [description, setDescription] = useState('') // Ticket description
  const [file, setFile] = useState(null) // Optional attachment
  const [categories, setCategories] = useState([]) // List of categories fetched from API
  const [selectedCategory, setSelectedCategory] = useState('') // User-selected category
  const [priority, setPriority] = useState('low') // Ticket priority
  const [loading, setLoading] = useState(false) // Loading state for form submission
  const [successMsg, setSuccessMsg] = useState('') // Success feedback
  const [errorMsg, setErrorMsg] = useState('') // Error feedback

  // --------------------------
  // FETCH CATEGORIES ON COMPONENT MOUNT
  // --------------------------
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/tickets/categories/')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch categories', err)
        setErrorMsg('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  // --------------------------
  // HANDLE FORM SUBMISSION
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Validation
    if (!title || !description) {
      setErrorMsg('Title and description are required!')
      return
    }

    setLoading(true)
    try {
      // Prepare form data (supports file upload)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('priority', priority)
      if (selectedCategory) formData.append('category_id', parseInt(selectedCategory))
      if (file) formData.append('file', file)

      // POST request to create ticket
      const res = await api.post('/tickets/tickets/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Success feedback
      setSuccessMsg(`Ticket created successfully! ID: ${res.data.ticket_id}`)
      
      // Reset form
      setTitle('')
      setDescription('')
      setSelectedCategory('')
      setPriority('low')
      setFile(null)
    } catch (err) {
      console.error(err.response || err.message)
      setErrorMsg('Failed to create ticket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // --------------------------
  // RENDER COMPONENT
  // --------------------------
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Support Ticket</h2>
        <p style={styles.subHeading}>Tell us about the issue and we’ll get back to you.</p>

        {/* Display success or error messages */}
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Title */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title <span style={styles.required}>*</span></label>
            <input
              style={styles.input}
              placeholder="Enter a brief title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description <span style={styles.required}>*</span></label>
            <textarea
              style={styles.textarea}
              placeholder="Explain the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Category */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Priority</label>
            <select
              style={styles.select}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Attachment */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Attachment</label>
            <input
              type="file"
              style={styles.file}
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && <div style={styles.fileName}>📎 {file.name}</div>}
          </div>

          {/* Submit Button */}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ------------------------ */
/*        STYLES            */
/* ------------------------ */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "50px 40px 80px",
    background: "#f5f7fa",
    minHeight: "50vh",
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },

  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "16px",
  },

  subHeading: {
    textAlign: "center",
    fontSize: "15px",
    color: "#5a5a5a",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "6px",
  },

  required: {
    color: "red",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    resize: "vertical",
    height: "110px",
  },

  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  file: {
    marginTop: "8px",
  },

  fileName: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#444",
  },

  button: {
    marginTop: "10px",
    padding: "12px 0",
    background: "#3B82F6",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "0.2s ease",
  },

  error: {
    background: "#ffe5e5",
    padding: "12px",
    borderRadius: "8px",
    color: "#d00",
    fontSize: "14px",
  },

  success: {
    background: "#e6ffe9",
    padding: "12px",
    borderRadius: "8px",
    color: "#0a8a1f",
    fontSize: "14px",
  },
};
