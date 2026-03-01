import { useState } from 'react'

// Maps expertise level to how many points each correct answer is worth
const POINTS_MAP = {
  novice: 1,
  intermediate: 2,
  expert: 3,
}

// Receives the quiz config, the questions array, and onFinish function as props
function QuizQuestions({ quizConfig, questions, onFinish }) {
  // Tracks which question the user is currently on
  const [currentIndex, setCurrentIndex] = useState(0)
  // Tracks what the user has typed in the answer text area
  const [userAnswer, setUserAnswer] = useState('')
  // Stores the feedback object returned from the API after answer submission: { correct, explanation, correctAnswer }
  const [feedback, setFeedback] = useState(null)
  // Tracks whether the answer is currently being sent to the API to prevent double submissions
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Accumulates the result of each question as the user progresses
  const [results, setResults] = useState([])

  // The question string currently being displayed
  const currentQuestion = questions[currentIndex]
  // True when the user is on the final question
  const isLastQuestion = currentIndex === questions.length - 1
  // How many points a correct answer is worth based on the chosen expertise level
  const pointsPerQuestion = POINTS_MAP[quizConfig.expertise]

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    // Stops submission if the answer is empty or a request was just submitted
    if (!userAnswer.trim() || isSubmitting) return
    setIsSubmitting(true)

    try {
      // Send a POST request to the backend to be graded by Gemini
      const response = await fetch('http://localhost:3000/api/checkAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sends the question, answer, topic, and style so Gemini has full context
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer,
          topic: quizConfig.topic,
          style: quizConfig.style,
        }),
      })
      // Parses the grading response: { correct, explanation, correctAnswer }
      const data = await response.json()
      setFeedback(data)
    } catch (error) {
      console.error('Error checking answer:', error)
      setFeedback({
        correct: false,
        explanation: 'Could not connect to the server. Please try again.',
        correctAnswer: '',
      })
    } finally {
      // Re-enables the submit button regardless of success or failure
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    // Builds the result object for the current question and appends it to the results array
    const updatedResults = [
      ...results,
      {
        question: currentQuestion,
        userAnswer,
        correct: feedback.correct,
        explanation: feedback.explanation,
        correctAnswer: feedback.correctAnswer,
        // Awards points only if the answer was correct
        pointsEarned: feedback.correct ? pointsPerQuestion : 0,
        // Records the maximum points possible for this question
        pointsPossible: pointsPerQuestion,
      },
    ]
    // Updates the results state with the new entry
    setResults(updatedResults)
    // If this was the last question, pass all results up to QuizFlow to trigger the results page
    if (isLastQuestion) {
      onFinish(updatedResults)
    } else {
      // Otherwise advance to the next question, clearing the text area and feedback
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setFeedback(null)
    }
  }

  return (
    <div>
      <p>Question {currentIndex + 1} of {questions.length}</p>
      <p>Topic: {quizConfig.topic} | Expertise: {quizConfig.expertise} | Points per question: {pointsPerQuestion}</p>
      <h2>{currentQuestion}</h2>

      {/* Shows the answer form only before feedback has been received */}
      {!feedback && (
        <form onSubmit={handleSubmitAnswer}>
          <textarea
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={4}
            cols={60}
            disabled={isSubmitting}
          />
          <br />
          <button type="submit" disabled={!userAnswer.trim() || isSubmitting}>
            {isSubmitting ? 'Checking...' : 'Submit Answer'}
          </button>
        </form>
      )}

      {/* Shows the feedback section only after the API has responded */}
      {feedback && (
        <div>
          <p><strong>Your answer:</strong> {userAnswer}</p>
          {feedback.correct ? (
            <p>Correct! +{pointsPerQuestion} point{pointsPerQuestion > 1 ? 's' : ''}</p>
          ) : (
            <div>
              <p>Incorrect. +0 points</p>
              {feedback.correctAnswer && (
                <p><strong>Correct answer:</strong> {feedback.correctAnswer}</p>
              )}
            </div>
          )}
          {feedback.explanation && (
            <p><strong>Explanation:</strong> {feedback.explanation}</p>
          )}
          {/* Advances to the next question or triggers the results page on the last question */}
          <button onClick={handleNext}>
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizQuestions