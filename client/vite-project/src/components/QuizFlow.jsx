// Handles the full quiz flow from config form to questions to results
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const handleQuizFinish = (quizResults) => {
    // Sets the results and takes the user to the Results page
    setResults(quizResults)
    setPage('results')
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