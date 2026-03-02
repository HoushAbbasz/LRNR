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
  // Gets the login/logout function from the AuthContext to keep track of users that are logged in
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Clears any potential previous error messages 
    setError('')

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
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Renders the error message if error exists */}
        {error && <p>{error}</p>}

        {/* Label changes based on the register/login status */}
        <button type="submit">
          {isRegistering ? 'Create Account' : 'Login'}
        </button>
      </form>

      {/* Toggle between login and register mode */}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  )
}

export default Login