// Importing BrowserRouter, Routes, and Route from react-router-dom to handle moving between pages without refreshing the browser
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// App is the main component that wraps the whole app in a BrowserRouter
// Route "/" shows the Home page
// Route "/account" shows the Account page
// Route "/quiz" shows the Quiz page
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/account" element={<h1>Account</h1>} />
        <Route path="/quiz" element={<h1>Quiz</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

// Exporting App so it can be used in main.jsx
export default App