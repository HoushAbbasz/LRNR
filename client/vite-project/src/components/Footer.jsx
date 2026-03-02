import { Link } from "react-router-dom";

function Footer() {
  return (
  <div id="footer">
    <section id="footer-sections">
      <section>
        <div id="logo-quote">
          <h2 id="logo">LRNR</h2>
          <p>“This space was built for growth.
  Not to be perfect, but to practice. Not to know everything, but to learn something new every time you log in. One quiz at a time, you're building knowledge, confidence, and a future in tech that once felt out of reach.”</p>
        </div>
      </section>
      <section id="links">
        <a to="/">Home</a>
        <a to="/login">Login</a>
        <a to="/register">Sign Up</a>
      </section>
    </section>
    <section id="terms-bottom">
      <p> © {new Date().getFullYear()} LRNR Inc. All rights reserved. </p>
    </section>
  </div>
  )
}

// Exporting Footer so it can be used across all pages
export default Footer