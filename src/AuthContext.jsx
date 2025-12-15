import React, { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import { setAuthToken } from './api'

// Create a context to provide authentication state globally
export const AuthContext = createContext()

// AuthProvider wraps the app and manages login/logout state
export function AuthProvider({ children }) {
  // State to store current logged-in user info
  const [user, setUser] = useState(null)
  
  // State to store JWT token, initialized from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'))

  /* -------------------------
     EFFECT: Decode token on mount or when token changes
  -------------------------- */
  useEffect(() => {
    if (token) {
      try {
        // Decode JWT to extract user information
        const decoded = jwtDecode(token)

        // Save decoded info in user state
        setUser({
          id: decoded.user_id,
          role: decoded.role,
          username: decoded.username
        })

        // Set the Authorization header for all API calls
        setAuthToken(token)
      } catch (e) {
        // If token is invalid, logout user
        logout()
      }
    }
  }, [token])


  /* -------------------------
     LOGIN FUNCTION
     1️ Save token in localStorage
     2️Update token state (triggers useEffect)
  -------------------------- */
  function login(token) {
    localStorage.setItem('token', token)
    setToken(token)
  }


  /* -------------------------
     LOGOUT FUNCTION
     1️ Remove token from localStorage
     2️ Reset token and user state
     3️ Remove auth header from API
  -------------------------- */
  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }


  /* -------------------------
     PROVIDE CONTEXT VALUE
     user: current logged-in user info
     token: JWT token
     login: function to log in
     logout: function to log out
  -------------------------- */
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
