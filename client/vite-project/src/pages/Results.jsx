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
    <main className="results-page">
      <div className="results-container">

        {/* Header */}
        <h1 className="results-title">Quiz Results</h1>
        <p className="results-meta">Topic: {quizConfig.topic} | Expertise: {quizConfig.expertise} | Style: {quizConfig.style}</p>

        {/* Score summary */}
        <div className="results-score-box">
          <h2 className="results-score">{totalEarned} / {totalPossible}</h2>
          <p className="results-score-label">points earned</p>
          <p className="results-correct-count">{correctCount} out of {results.length} questions correct</p>
          <p className="results-points-per">+{pointsPerQuestion} point{pointsPerQuestion > 1 ? 's' : ''} per correct answer ({quizConfig.expertise})</p>
          {streak !== null && (
            <p className="results-streak">🔥 Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Review section */}
        <h3 className="results-review-title">Review</h3>

        {/* Loops through every result and renders a summary for each question */}
        {results.map((result, i) => (
          <div className={`results-review-item ${result.correct ? 'correct' : 'incorrect'}`} key={i}>
            <p className="results-question"><strong>Q{i + 1}:</strong> {result.question}</p>
            <p className="results-user-answer"><strong>Your answer:</strong> {result.userAnswer}</p>
            <p className={result.correct ? 'results-correct' : 'results-incorrect'}>
              {result.correct
                ? `✓ Correct — +${result.pointsEarned} point${result.pointsEarned > 1 ? 's' : ''}`
                : `✗ Incorrect — +0 points`}
            </p>
            {/* Only shows the correct answer if the question was wrong and a correct answer was provided */}
            {!result.correct && result.correctAnswer && (
              <p className="results-correct-answer"><strong>Correct answer:</strong> {result.correctAnswer}</p>
            )}
            {result.explanation && (
              <p className="results-explanation"><strong>Explanation:</strong> {result.explanation}</p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="results-buttons">
          {/* Triggers the retake flow in QuizFlow, resetting all state and navigating back to /quiz */}
          <button className="results-retake-btn" onClick={onRetake}>Take Another Quiz</button>
          {/* Takes the user to their account page to see updated XP and scores */}
          <button className="results-account-btn" onClick={() => navigate('/account')}>View Account</button>
        </div>

      </div>
    </main>
  )
}

export default Results