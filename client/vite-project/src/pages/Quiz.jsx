// Importing useState to track the user's dropdown selections
import { useState } from 'react'
// useAuth gives us access to the login/logout function
import { useAuth } from '../context/AuthContext'

// Arrays containing the options for each dropdown
const topics = ['golang', 'aws', 'javascript', 'CI/CD', 'home gardens', 'coffee', 'finger foods']
const expertiseLevels = ['novice', 'intermediate', 'expert']
const questionCounts = ['5', '10', '15']
const styles = ['normal', 'master oogway', "1940's gangster", "like I'm an 8 year old", 'jedi', 'captain jack sparrow', 'matthew mcconaughey']

// Quiz page - contains the form for generating a personalized quiz
function Quiz({ onStart }) {
  const { token } = useAuth()
  // quizConfig holds all 4 dropdown selections
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    expertise: '',
    numQuestions: '5',
    style: 'normal'
  })

  // loading tracks whether the API call is in progress
  const [loading, setLoading] = useState(false)

  // error tracks any error messages to show the user
  const [error, setError] = useState(null)

  // handleChange updates quizConfig when the user changes a dropdown
  // e.target.name is which dropdown changed, e.target.value is what they picked
  // ...quizConfig keeps all other selections the same and only updates the one that changed
  const handleChange = (e) => {
    setQuizConfig({ ...quizConfig, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log('Quiz config submitted:', quizConfig)

    try {
      // Sends a POST request to the backend with the quiz config as the body
      const response = await fetch("http://localhost:3000/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`,
        },
        // Converts the quizConfig object to a JSON string for the request body
        body: JSON.stringify(quizConfig),
      })

      // Parses the JSON response from the backend into a JavaScript object
      const data = await response.json()
      console.log("Questions:", data.questions)

      // Passes the config and generated questions to QuizFlow to trigger navigation
      onStart(quizConfig, data.questions)

    } catch (err) {
      console.error('Error generating quiz:', err)
      setError('Something went wrong generating your quiz. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">

        <h1 className="quiz-title">Quiz Generator</h1>
        <p className="quiz-subtitle">Please choose your preferences below to generate your personalized quiz</p>

        <form className="quiz-form" onSubmit={handleSubmit}>

          {/* Topic dropdown */}
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <select id="topic" name="topic" value={quizConfig.topic} onChange={handleChange} required>
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Expertise dropdown */}
          <div className="form-group">
            <label htmlFor="expertise">Expertise Level</label>
            <select id="expertise" name="expertise" value={quizConfig.expertise} onChange={handleChange} required>
              <option value="">Select your level</option>
              {expertiseLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Number of questions dropdown */}
          <div className="form-group">
            <label htmlFor="numQuestions">Number of Questions</label>
            <select id="numQuestions" name="numQuestions" value={quizConfig.numQuestions} onChange={handleChange}>
              <option value="">Select amount</option>
              {questionCounts.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>

          {/* Style dropdown */}
          <div className="form-group">
            <label htmlFor="style">Question Style</label>
            <select id="style" name="style" value={quizConfig.style} onChange={handleChange}>
              <option value="">Select a style</option>
              {styles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Error message shows if the API call fails */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit button shows loading spinner while waiting for the API */}
          <button className="quiz-submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Quiz...
              </>
            ) : (
              'Generate Quiz'
            )}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Quiz