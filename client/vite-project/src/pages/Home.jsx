// Home page component - will be built out later
const topics = ['golang', 'aws', 'javascript', 'CI/CD', 'home gardens', 'coffee', 'finger foods']


function Home() {
  return (
  <div id="Home-page">
    <section id="hero">
      <div id="hero-text">
        <h2>LRNR</h2>
        <p>Your guided path to programming englightenment</p>
      </div>

      <div id="topic-bubbles">
        <h2>TOPIC BUBBLES</h2>
      </div>
    </section>
    {/* MOBILE USE */}
    <section id="topic-carousel">
      <p>topics n stuff</p>
    </section>

    <section id="begin-banner">
      <h2>TAKE A QUIZ!</h2>
      <button>Get Started<img src="/images/right-arrow.png"></img></button>
    </section>
    <div id="description-cards">
      <h2>card 1</h2>
      <h2>card 2</h2>
      <h2>card 3</h2>
    </div>
  </div>
  )
}

// Exporting Home so it can be used in App.jsx
export default Home