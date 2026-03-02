// Link provides client-side navigation without full page reloads
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Navbar component - appears on every page
function Navbar() {

  // useAuth gives access to the logged in user's username, login status, and logout function
  const { username, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  // Clears the auth state and redirects to the home page
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
  <nav style={{ zIndex: 1000 }}>
    <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/quiz'>Quiz</Link></li>
        {isLoggedIn && <li><Link to='/account'>Account</Link></li>}
        {/* Shows Logout button if logged in, Login link if not */}
        {isLoggedIn ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link to='/login'>Login</Link></li>
        )}
      </ul>
      {/* Shows the logged in username if user is logged in and nothing if not */}
      {isLoggedIn ? <p>Welcome, {username}</p> : <p></p>}
  </nav>
  )
}

// Exporting Navbar so it can be used across all pages
export default Navbar