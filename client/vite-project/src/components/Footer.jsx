import { useNavigate } from "react-router-dom";
import { useNavRequest } from '../App'

function Footer() {

const navigate = useNavigate()
// Use useNavRequest context to see if they are trying to navigate from quiz flow
const { requestNav } = useNavRequest() 
// If requestNav is null, use navigate
const goTo = requestNav ?? navigate 

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
          <button onClick={() => goTo('/')}>Home</button>
          <button onClick={() => goTo('/login')}>Login</button>
          <button onClick={() => goTo('/login')}>Sign Up</button>
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