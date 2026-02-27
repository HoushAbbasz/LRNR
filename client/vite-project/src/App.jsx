// Importing BrowserRouter, Routes, and Route from react-router-dom to handle moving between pages without refreshing the browser
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importing the page components andc components so the routes know what to display
import Home from './pages/Home'
import Account from './pages/Account'
import QuizFlow from './components/QuizFlow'

// App is the main component that wraps the whole app in a BrowserRouter
// Route "/" shows the Home page
// Route "/account" shows the Account page
// Route "/quiz" shows the Quiz page
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/quiz" element={<QuizFlow />} />
      </Routes>
    </BrowserRouter>
  )
}

// Exporting App so it can be used in main.jsx
export default App