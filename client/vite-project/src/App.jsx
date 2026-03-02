// Importing BrowserRouter, Routes, and Route from react-router-dom to handle moving between pages without refreshing the browser
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importing the page components and components so the routes know what to display
import Home from './pages/Home'
import Account from './pages/Account'
import QuizFlow from './components/QuizFlow'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import './index.css'

// App is the main component that wraps the whole app in a BrowserRouter
// Route "/" shows the Home page
// Route "/account" shows the Account page
// Route "/quiz" shows the QuizFlow component which handles the full quiz experience
// Route "/login" shows the Login page
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

// Exporting App so it can be used in main.jsx
export default App