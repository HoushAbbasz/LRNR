// Importing BrowserRouter, Routes, and Route from react-router-dom to handle moving between pages without refreshing the browser
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
// Importing the page components and components so the routes know what to display
import Home from './pages/Home'
import Account from './pages/Account'
import QuizFlow from './components/QuizFlow'
import Login from './pages/Login'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import FlyingLeroy from './components/FlyingLeroy'
import './index.css'

// Gives Navbar and Footer a way to request navigation through QuizFlow's guard
// instead of calling useNavigate() directly
export const NavRequestContext = createContext(null)
export const useNavRequest = () => useContext(NavRequestContext)

// App is the main component that wraps the whole app in a BrowserRouter
// Route "/" shows the Home page
// Route "/account" shows the Account page
// Route "/quiz" shows the QuizFlow component which handles the full quiz experience
// Route "/login" shows the Login page
function App() {
  // Holds the guarded navigate function once QuizFlow mounts,
  // falls back to a plain navigate for use outside quiz routes
  const [requestNav, setRequestNav] = useState(null)

  return (
    <NavRequestContext.Provider value={{ requestNav, setRequestNav }}>
      <BrowserRouter>
        <FlyingLeroy />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/quiz" element={<QuizFlow />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </NavRequestContext.Provider>
  )
}

// Exporting App so it can be used in main.jsx
export default App