// Importing useState to manage account data
import { useState } from 'react'

// Placeholder data - will eventually come from the backend/database
const streakData = {
  days: 5
}

const platinumQuizzes = [
  'golang - intermediate',
  'javascript - beginner',
  'AWS - beginner'
]

const lrnrLevel = {
  level: 2,
  currentXP: 150,
  maxXP: 200
}

// Account page - displays the user's streak, platinum quizzes, and lrnr level
function Account() {

  return (
    <div>
      <h1>Account</h1>

      <div>

        {/* Streak section - shows how many days in a row the user has taken a quiz */}
        <div>
          <h2>Streak</h2>
          <p>You have a streak of {streakData.days} days!</p>
        </div>

        {/* Platinum Quizzes section - shows list of quizzes the user has completed */}
        <div>
          <h2>Platinum Quizzes</h2>
          {platinumQuizzes.map((quiz) => (
            <p key={quiz}>{quiz}</p>
          ))}
        </div>

        {/* Lrnr Level section - shows the user's current level and XP progress */}
        <div>
          <h2>Lrnr Level: {lrnrLevel.level}</h2>
          <p>{lrnrLevel.currentXP}/{lrnrLevel.maxXP} xp</p>
        </div>

      </div>
    </div>
  )
}

// Exporting Account so it can be used in App.jsx
export default Account