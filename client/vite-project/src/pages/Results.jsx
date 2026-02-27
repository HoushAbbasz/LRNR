// Maps expertise level to how many points each correct answer is worth, must match the value used in QuizQuestions
const POINTS_MAP = {
  novice: 1,
  intermediate: 2,
  expert: 3,
}

// Takes the quiz config, the completed results array, and onRetake function as Props
function Results({ quizConfig, results, onRetake }) {

  // How many points each question was worth based on expertise level
  const pointsPerQuestion = POINTS_MAP[quizConfig.expertise]
  // Maximum score the user could have earned across all questions
  const totalPossible = results.length * pointsPerQuestion
  // Actual score earned by summing pointsEarned from each result
  const totalEarned = results.reduce((sum, r) => sum + r.pointsEarned, 0)
  // Number of questions the user got right
  const correctCount = results.filter((r) => r.correct).length

  return (
    <div>
      <h1>Quiz Results</h1>
      {/* Shows a summary of the quiz settings */}
      <p>Topic: {quizConfig.topic} | Expertise: {quizConfig.expertise} | Style: {quizConfig.style}</p>

      <h2>Score: {totalEarned} / {totalPossible} points</h2>
      <p>{correctCount} out of {results.length} questions correct</p>
      <p>Points per question: {pointsPerQuestion} ({quizConfig.expertise})</p>

      <hr />

      <h3>Review</h3>
      {/* Loops through every result and renders a summary for each question */}
      {results.map((result, i) => (
        <div key={i}>
          {/* Shows the question text */}
          <p><strong>Q{i + 1}:</strong> {result.question}</p>
          {/* Shows what the user answered */}
          <p><strong>Your answer:</strong> {result.userAnswer}</p>
          {/* Shows whether it was correct and how many points were earned */}
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
    </div>
  )
}

export default Results