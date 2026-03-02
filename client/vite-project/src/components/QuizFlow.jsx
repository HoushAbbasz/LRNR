// Handles the full quiz flow from config form to questions to results
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// useAuth gives us access to the login/logout function
import { useAuth } from '../context/AuthContext'
import Quiz from '../pages/Quiz'
import QuizQuestions from '../pages/QuizQuestions'
import Results from '../pages/Results'

function QuizFlow() {
  // Stores the user's quiz settings (topic, expertise, numQuestions, style)
  const [quizConfig, setQuizConfig] = useState(null)
  // Stores the array of questions returned from the API
  const [questions, setQuestions] = useState([])
  // Stores the results array built up as the user completes each question
  const [results, setResults] = useState([])
  // Tracks which page to show: 'config', 'questions', or 'results'
  const [page, setPage] = useState('config')
  // Gives access to the browser's navigation so we can redirect to /quiz on retake
  const navigate = useNavigate()
  // Checks to see if a user is logged in
  const { token, isLoggedIn } = useAuth()
  // Stores the streak returned from the API after saving the score
  const [streak, setStreak] = useState(null)

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  // Called by Quiz when the user submits the config form and questions come back from the API
  const handleQuizStart = (config, generatedQuestions) => {
    // Sets the quiz topic, expertise, numQuestions, style
    setQuizConfig(config)
    // Sets the generated questions so QuizQuestions can render them
    setQuestions(generatedQuestions)
    // Sets the page to questions to go to the QuizQuestions page
    setPage('questions')
  }

  // Passed as a prop to the QuizQuestions page
  const handleQuizFinish = async (quizResults) => {
    // Sets the results and takes the user to the Results page
    setResults(quizResults)
    setPage('results')

    // Calculate total points earned across all questions
    const totalEarned = quizResults.reduce((sum, result) => sum + result.pointsEarned, 0)

    // Saves the score to the database, also updates XP and level
    try {
      const response = await fetch('http://localhost:3000/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: quizConfig.topic,
          expertise: quizConfig.expertise,
          num_of_questions: parseInt(quizConfig.numQuestions),
          score: totalEarned,
        }),
      })
      const data = await response.json()
      // Save the streak returned from the backend to show on the results page
      setStreak(data.streak)
    } catch (error) {
      console.error('Failed to save score:', error)
    }
  }

  // Passed as a prop to the Results page
  const handleRetake = () => {
    // Reset the page back to the config form
    setPage('config')
    // Clear out the previous quiz config
    setQuizConfig(null)
    // Clear out the previous questions
    setQuestions([])
    // Clear out the previous results
    setResults([])
    // Clear out streaks
    setStreak(null)
    // Navigate back to /quiz
    navigate('/quiz')
  }

  // If/Else logic to handle page navigation
  if (page === 'questions') {
    return <QuizQuestions quizConfig={quizConfig} questions={questions} onFinish={handleQuizFinish} />
  }
  if (page === 'results') {
    return <Results quizConfig={quizConfig} results={results} onRetake={handleRetake} />
  }
  return <Quiz onStart={handleQuizStart} />
}

export default QuizFlow