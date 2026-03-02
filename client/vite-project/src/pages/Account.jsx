import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// useAuth gives us access to the login/logout function
import { useAuth } from '../context/AuthContext'

function Account() {
  // Gets the JWT token and login status from AuthContext
  const { token, isLoggedIn } = useAuth()
  // Stores the user's account data (username, streak, xp, level) 
  const [account, setAccount] = useState(null)
  // Stores the user's best quiz scores
  const [scores, setScores] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    // Fetches the user's account data and quiz scores 
    const fetchAccount = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/account', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        // Save the account info to state
        setAccount(data.account)
        // Save quiz scores array to state
        setScores(data.scores)
      } catch (error) {
        console.error('Failed to fetch account:', error)
      }
    }

    fetchAccount()
    // Re-runs if isLoggedIn, token, or navigate changes
    }, [isLoggedIn, token, navigate])

  if (!account) return <p>Loading...</p>

  return (
    <div>
      <h1>Account</h1>
      {/* Display the user's account info*/}
      <p>Username: {account.username}</p>
      <p>Streak: {account.streak} days</p>
      <p>Level: {account.level}</p>
      <p>XP: {account.xp}</p>

      <h2>Best Scores</h2>
      {scores.length === 0 ? (
        <p>No quizzes completed yet.</p>
      ) : (
        // Loop through each score and display the topic, expertise, question count, and best score
        scores.map((s) => (
          <p key={`${s.topic}-${s.expertise}-${s.num_of_questions}`}>
            {s.topic} · {s.expertise} · {s.num_of_questions} questions — {s.best_score} / {s.num_of_questions}
          </p>
        ))
      )}
    </div>
  )
}

export default Account