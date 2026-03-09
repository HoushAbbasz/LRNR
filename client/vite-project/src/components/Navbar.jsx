// Link provides client-side navigation without full page reloads
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useNavRequest } from '../App'

// Navbar component - appears on every page
function Navbar() {

  // useAuth gives access to the logged in user's username, login status, and logout function
  const { username, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const { requestNav } = useNavRequest()
  const goTo = requestNav ?? navigate

  const [open, setOpen] = useState(false); //controlling if mobile menu is open

  // Clears the auth state and redirects to the home page
  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  }
  // close menu when route link is clicked
  const closeMenu = () => setOpen(false);

  const handleNav = (path) => {
    closeMenu()
    goTo(path)
  }

  useEffect(() => { //listening for keyboard presses - pressing escape = closed menu
    const onKeyDown = (e) => { // creatiiing functoin for the press
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown); //attaching listener to browser
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);


  return (
  <header className="nav" style={{ zIndex: 1000 }}>
    <div className="nav-inner">
      <button className="nav-logo" onClick={() => handleNav('/')}>
        LRNR
      </button>
      {/* DESKTOP LINKS  */}
      <nav className="nav-links">
          <button onClick={() => handleNav('/')}>Home</button>
          {isLoggedIn && <button onClick={() => handleNav('/quiz')}>Quiz</button>}
          {isLoggedIn && <button onClick={() => handleNav('/account')}>Account</button>}
          {isLoggedIn ? (
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => handleNav('/login')}>Login</button>
          )}
      </nav>

      {/* MOBILE BURGER */}
      <button className={`burger ${open ? "is-open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
        <span />
        <span />
        <span />
      </button>
      </div>
      {/* WELCOME TEXT */}
      {isLoggedIn && <p className="nav-welcome">Welcome, {username}</p>}

       
       {/* MOBILE OVERLAY */}
       <div className={`menu-overlay ${open ? "show" : ""}`} onClick={closeMenu} aria-hidden="true"></div>

       {/* MOBILE MENU */}
       <nav id="mobile-menu" className={`mobile-menu ${open ? "show" : ""}`}>
        <button onClick={() => handleNav('/')}>Home</button>
        {isLoggedIn && <button onClick={() => handleNav('/quiz')}>Quiz</button>}
        {isLoggedIn && <button onClick={() => handleNav('/account')}>Account</button>}
        {isLoggedIn ? (
          <button className="mobile-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => handleNav('/login')}>Login</button>
        )}
       </nav> 
  </header>
  );
}

// Exporting Navbar so it can be used across all pages
export default Navbar