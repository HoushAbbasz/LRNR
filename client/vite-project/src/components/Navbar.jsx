// Link provides client-side navigation without full page reloads
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

// Navbar component - appears on every page
function Navbar() {

  // useAuth gives access to the logged in user's username, login status, and logout function
  const { username, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false); //controlling if mobile menu is open

  // Clears the auth state and redirects to the home page
  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  }
// close menu when route link is clicked
  const closeMenu = () => setOpen(false);

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
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        {/* <img src="/images/result.png"></img> */}
        LRNR
      </Link>
      {/* DESKTOP LINKS  */}
      <nav className="nav-links">
        <Link to="/" onClick={closeMenu}>Home</Link>
        {isLoggedIn && <Link to='/quiz'>Quiz</Link>}
        {isLoggedIn && <Link to="/account" onClick={closeMenu}>Account</Link>}
        {isLoggedIn ? (
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" onClick={closeMenu}>Login</Link>
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
        <Link to="/" onClick={closeMenu}>Home</Link>
        {isLoggedIn && <Link to='/quiz'>Quiz</Link>}
        {isLoggedIn && <Link to="/account" onClick={closeMenu}>Account</Link> }
        {isLoggedIn ? (
          <button className="mobile-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" onClick={closeMenu}>Login</Link>
        )}
       </nav> 
  </header>
  );
}

// Exporting Navbar so it can be used across all pages
export default Navbar