import axios from 'axios'

// Base URL for API requests. Uses environment variable if defined,
// otherwise defaults to local Django backend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

//Create an Axios instance with default configuration
const instance = axios.create({
  baseURL: API_BASE, // All requests will be prefixed with this URL
})

// Function to set the Authorization header for requests
export function setAuthToken(token) {
  if (token) {
    // If token exists, add it to default headers for all requests
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // If no token, remove the Authorization header
    delete instance.defaults.headers.common['Authorization']
  }
}

// Export the configured Axios instance for API calls
export default instance