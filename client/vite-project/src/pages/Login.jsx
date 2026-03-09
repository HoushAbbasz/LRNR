import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// useAuth gives us access to the login/logout function
import { useAuth } from '../context/AuthContext'

function Login() {
  // Tracks if in register or login mode
  const [isRegistering, setIsRegistering] = useState(false)
  // Sets the user's username and password
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Sets any potential error messages 
  const [error, setError] = useState('')
  // Sets the validation errors
  const [validationErrors, setValidationErrors] = useState({})
  // Gets the login/logout function from the AuthContext to keep track of users that are logged in
  const { login } = useAuth()
  const navigate = useNavigate()

    const validateForm = () => {
    const errors = {}

    // Username must be min 3 chars, include at least one letter
    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    } else if (!/[a-zA-Z]/.test(username)) {
      errors.username = 'Username must include at least one letter'
    }

    // Password must be min 8 chars, must have a letter, number, and special char
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/[a-zA-Z]/.test(password)) {
      errors.password = 'Password must include at least one letter'
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Password must include at least one number'
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.password = 'Password must include at least one special character'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Clears any potential previous error messages 
    setError('')

    // Run validation and return if there are errors
    if (isRegistering) {
      const errors = validateForm()
      setValidationErrors(errors)
      if (Object.keys(errors).length > 0) return
    }

    // Set endpoint to registration or login endpoint 
    const endpoint = isRegistering ? '/api/register' : '/api/login'

    try {
      // Send the username and password to the register/login endpoint
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Convert the username and password into a JSON string for the request body
        body: JSON.stringify({ username, password }),
      })

      // Parse the JSON response from the server
      const data = await response.json()

      // If the server returned an error status, show the error message
      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      if (isRegistering) {
        // After registering, switch to login mode so the user can sign in
        setIsRegistering(false)
        setError('Account created! Please log in.')
      } else {
        // Save the token and navigate to the account page
        login(data.token, data.username)
        navigate('/account')
      }
    } catch (error) {
      setError('Could not connect to server')
    }
  }

  // Clear the field's validation error as the user types
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    if (validationErrors.username) {
      setValidationErrors((prev) => ({ ...prev, username: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: '' }))
    }
  }

  return (
    <div>
      {/* Changes based on whether the user is registering or logging in */}
      <h1>{isRegistering ? 'Create Account' : 'Login'}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        {/* Show username validation error only in register mode */}
          {isRegistering && validationErrors.username && (
            <p>{validationErrors.username}</p>
          )}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {/* Show password validation error only in register mode */}
          {isRegistering && validationErrors.password && (
            <p>{validationErrors.password}</p>
          )}
        </div>

        {/* Renders the error message if error exists */}
        {error && <p>{error}</p>}

        {/* Label changes based on the register/login status */}
        <button type="submit">
          {isRegistering ? 'Create Account' : 'Login'}
        </button>
      </form>

      {/* Toggle between login and register mode */}
        <button onClick={() => {
          setIsRegistering(!isRegistering)
          // Clear validation state when switching modes
          setValidationErrors({})
          setError('')
        }}>
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  )
}

export default Login