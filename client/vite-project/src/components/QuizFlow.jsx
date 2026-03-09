// Handles the full quiz flow from config form to questions to results
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// useAuth gives us access to the login/logout function
import { useAuth } from '../context/AuthContext'
import Quiz from '../pages/Quiz'
import QuizQuestions from '../pages/QuizQuestions'
import Results from '../pages/Results'
import { useNavRequest } from '../App'

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
  // Checks whether the abandon-quiz modal is visible
  const [showModal, setShowModal] = useState(false)
  // Stores the URL the user was trying to navigate to so we can go there if they confirm
  const [pendingNav, setPendingNav] = useState(null)


  const { setRequestNav } = useNavRequest()


  // True only while a quiz is actively in progress
  const quizInProgress = page === 'questions'

  // Called by Navbar/Footer links instead of navigating directly.
  // If a quiz is in progress, show the modal; otherwise navigate immediately.
  const requestNav = (path) => {
    if (quizInProgress) {
      setPendingNav(path)
      setShowModal(true)
    } else {
      navigate(path)
    }
  }

  useEffect(() => {
  // Register this component's guarded nav with the context
  setRequestNav(() => requestNav)
  // Unregister when QuizFlow unmounts
  return () => setRequestNav(null)
  // re-register when guard condition changes
  }, [quizInProgress]) 

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  // User confirmed they want to leave, reset state and go to the pending URL
  const confirmLeave = () => {
    setShowModal(false)
    setPage('config')
    setQuizConfig(null)
    setQuestions([])
    setResults([])
    setStreak(null)
    navigate(pendingNav)
    setPendingNav(null)
  }

  // User does not want to leave, reset modal and pendingNav
  const cancelLeave = () => {
    setShowModal(false)
    setPendingNav(null)
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

  return (
    <>
      {/* Abandon quiz modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: '8px',
            padding: '2rem', maxWidth: '400px', width: '90%',
            textAlign: 'center',
          }}>
            <h2>Abandon quiz?</h2>
            <p>Your progress will be lost if you leave now.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button onClick={cancelLeave}>Keep playing</button>
              <button onClick={confirmLeave}>Leave anyway</button>
            </div>
          </div>
        </div>
      )}

      {/* If/else logic for quiz flow */}
      {page === 'questions' && (
        <QuizQuestions quizConfig={quizConfig} questions={questions} onFinish={handleQuizFinish} />
      )}
      {page === 'results' && (
        <Results quizConfig={quizConfig} results={results} onRetake={handleRetake} streak={streak} />
      )}
      {page === 'config' && <Quiz onStart={handleQuizStart} />}
    </>
  )
}

export default QuizFlow