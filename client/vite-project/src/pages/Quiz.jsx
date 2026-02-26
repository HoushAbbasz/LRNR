// Importing useState to track the user's dropdown selections
import { useState } from 'react'

// Arrays containing the options for each dropdown
const topics = ['golang', 'aws', 'javascript', 'CI/CD', 'home gardens', 'coffee', 'finger foods']
const expertiseLevels = ['novice', 'intermediate', 'expert']
const questionCounts = ['5', '10', '15']
const styles = ['normal', 'master oogway', "1940's gangster", "like I'm an 8 year old", 'jedi', 'captain jack sparrow', 'matthew mcconaughey']

// Quiz page - contains the form for generating a personalized quiz
function Quiz() {

  // useState tracks what the user selects in each dropdown
  // quizConfig holds all 4 selections, setQuizConfig updates them
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    expertise: '',
    numQuestions: '5',
    style: 'normal'
  })

  // handleChange updates quizConfig when the user changes a dropdown
  // e.target.name is which dropdown changed, e.target.value is what they picked
  // ...quizConfig keeps all other selections the same and only updates the one that changed
  const handleChange = (e) => {
    setQuizConfig({ ...quizConfig, [e.target.name]: e.target.value })
  }

  // handleSubmit runs when the user clicks Submit
  // e.preventDefault stops the page from refreshing
  // console.log shows the current selections in the browser console for testing
  // Will eventually send quizConfig to the backend to generate the quiz
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Quiz config submitted:', quizConfig)
  }

  return (
    <div>
      <h1>Quiz Generator</h1>
      <p>Please choose your preferences below to generate your personalized quiz</p>

      <form onSubmit={handleSubmit}>

        {/* Topic dropdown - loops through topics array to build the options */}
        <select name="topic" value={quizConfig.topic} onChange={handleChange}>
          <option value="">Topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        {/* Expertise dropdown - loops through expertiseLevels array to build the options */}
        <select name="expertise" value={quizConfig.expertise} onChange={handleChange}>
          <option value="">Expertise</option>
          {expertiseLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Number of questions dropdown - loops through questionCounts array to build the options */}
        <select name="numQuestions" value={quizConfig.numQuestions} onChange={handleChange}>
          <option value="">Number of Questions</option>
          {questionCounts.map((count) => (
            <option key={count} value={count}>{count}</option>
          ))}
        </select>

        {/* Style of questions dropdown - loops through styles array to build the options */}
        <select name="style" value={quizConfig.style} onChange={handleChange}>
          <option value="">Style of Questions</option>
          {styles.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <button type="submit">Submit</button>

      </form>
    </div>
  )
}

// Exporting Quiz so it can be used in App.jsx
export default Quiz