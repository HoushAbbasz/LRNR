import { useNavigate } from 'react-router-dom'
// Maps expertise level to how many points each correct answer is worth, must match the value used in QuizQuestions
const POINTS_MAP = {
  novice: 1,
  intermediate: 2,
  expert: 3,
}

// Takes the quiz config, the completed results array, onRetake function, and streak as props
function Results({ quizConfig, results, onRetake, streak }) {
  // How many points each question was worth based on expertise level
  const pointsPerQuestion = POINTS_MAP[quizConfig.expertise]
  // Maximum score the user could have earned across all questions
  const totalPossible = results.length * pointsPerQuestion
  // Actual score earned by summing pointsEarned from each result
  const totalEarned = results.reduce((sum, r) => sum + r.pointsEarned, 0)
  // Number of questions the user got right
  const correctCount = results.filter((r) => r.correct).length

  const navigate = useNavigate()
  return (
    <div>
      <h1>Quiz Results</h1>
      {/* Shows a summary of the quiz settings */}
      <p>Topic: {quizConfig.topic} | Expertise: {quizConfig.expertise} | Style: {quizConfig.style}</p>
      <h2>Score: {totalEarned} / {totalPossible} points</h2>
      <p>{correctCount} out of {results.length} questions correct</p>
      <p>Points per question: {pointsPerQuestion} ({quizConfig.expertise})</p>
      {streak !== null && (
        <p>🔥 Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
      )}
      <hr />
      <h3>Review</h3>

      {/* Loops through every result and renders a summary for each question */}
      {results.map((result, i) => (
        <div key={i}>
          <p><strong>Q{i + 1}:</strong> {result.question}</p>
          <p><strong>Your answer:</strong> {result.userAnswer}</p>
          <p>
            {result.correct
              ? `Correct — +${result.pointsEarned} point${result.pointsEarned > 1 ? 's' : ''}`
              : `Incorrect — +0 points`}
          </p>
          {/* Only shows the correct answer if the question was wrong and a correct answer was provided */}
          {!result.correct && result.correctAnswer && (
            <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
          )}
          {result.explanation && (
            <p><strong>Explanation:</strong> {result.explanation}</p>
          )}
          <hr />
        </div>
      ))}

      {/* Triggers the retake flow in QuizFlow, resetting all state and navigating back to /quiz */}
      <button onClick={onRetake}>Take Another Quiz</button>
      {/* Takes the user to their account page to see updated XP and scores */}
      <button onClick={() => navigate('/account')}>View Account</button>
    </div>
  )
}

export default Results