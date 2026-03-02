import { createContext, useContext, useState } from 'react'

// Creates the AuthContext with a default value of null
const AuthContext = createContext(null)

// AuthProvider wraps the whole app so every component can access auth state
export function AuthProvider({ children }) {
  // On load, check localStorage for an existing token and username so the user stays logged in after a page refresh
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [username, setUsername] = useState(localStorage.getItem('username') || null)

  // Called after the user successfully logs in
  const login = (token, username) => {
    // Add the token and username to localStorage so they survive if the page refreshes
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    // Update state so components re-render immediately with the new auth data
    setToken(token)
    setUsername(username)
  }

  // logout is called when the user clicks the Logout button in the Navbar
  const logout = () => {
    // Remove the token and username from localStorage so the username no longer appears after refresh
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    // Clear state so components re-render immediately and reflect the logged out status
    setToken(null)
    setUsername(null)
  }

  return (
    // Provides token, username, login, logout, and isLoggedIn to every component that is a child of AuthContext
    // Since the entire app is inside the AuthProvider component, it applies to all pages
    <AuthContext.Provider value={{ token, username, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook that any component can call instead of writing useContext(AuthContext) directly
export function useAuth() {
  return useContext(AuthContext)
}