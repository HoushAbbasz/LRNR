import { useEffect, useState } from "react";


// ========= ARRAYS ===========
const topicsType = ['Golang', 'AWS', 'JavaScript', 'CI/CD', 'Home Gardens', 'Coffee', 'Finger Foods']
const topics = [
  { name: "Golang", logo: "/images/golang.png" },
  { name: "AWS", logo: "/images/aws.png" },
  { name: "Javascript", logo: "/images/js.png" },
  { name: "CI/CD", logo: "/images/cd.png" },
  { name: "Home Gardens", logo: "/images/homegarden.png" },
  { name: "Coffee", logo: "/images/coffee.png" },
  { name: "Finger Food", logo: "/images/fingerfood.png" }

]


// ========== CREATING HOME ==========
function Home() {
  // ==== type ====
  const [typedText, setTypedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = topicsType[wordIndex];
    const typingSpeed = isDeleting ? 60 : 110; // delete faster than typing
   const pauseAfterTyping = 900; // pause when a word finishes typing
    const pauseAfterDeleting = 250; // pause before typing next word
  

  let timeoutId;

  //type the whole word out, pause and delete
  if (!isDeleting && charIndex === currentWord.length) {
    timeoutId = setTimeout(() => {
      setIsDeleting(true);
    }, pauseAfterTyping);
  }
   // finish deleting and move on to the next 
  else if (isDeleting && charIndex === 0) {
    timeoutId = setTimeout(() => {
      setIsDeleting(false);

      setWordIndex((prev) => (prev + 1) % topicsType.length);
    }, pauseAfterDeleting);
  } 
  else {
    timeoutId = setTimeout(() => {
      const nextCharIndex = isDeleting ? charIndex - 1 : charIndex + 1;
      setCharIndex(nextCharIndex);
      setTypedText(currentWord.slice(0, nextCharIndex));
    }, typingSpeed);
  }

  return () => clearTimeout(timeoutId);
}, [charIndex, isDeleting, wordIndex])
  return (
  <div id="Home-page">
    <section id="hero">
      <div id="hero-text">
        <h2>LRNR</h2>
        <p>Improve your knowledge in</p>
        <p className="typed-line"><span className="typed">{typedText}</span>
        <span className="cursor">|</span></p>

      </div>

      <div id="topic-bubbles">
        <h2>TOPIC BUBBLES</h2>
      </div>
    </section>
    {/* MOBILE USE */}
    <section id="topic-carousel">
      <div className="carousel-window">
        <div 
          className="carousel-track">
          {[...topics, ...topics].map((t, i) => (
            <div className="topic-slide" key={i}>
              <img src={t.logo} alt={`${t.name} logo`} />
              <p>{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="begin-banner">
      <h2>LOGIN TO<br></br>TAKE A QUIZ!</h2>
      <button><p>GET STARTED</p><img src="/images/right-arrow.png" alt="arrow image"></img></button>
    </section>
    <div id="description-cards">
      <div className="cards">
        <h3><span className="card-accent">Personalized</span> <br></br>Quizzes</h3>
        <p>Choose your topic, difficulty level, and question style to build a learning experience that matches exactly what you want to master. Whether you're sharpening technical skills ot exploring a new interest, your quiz adapts to you.</p>
        <p><span className="cards-logo">LRNR</span></p>
      </div>

      <div className="cards">
        <h3><span className="card-accent">Rewarding</span> <br></br>Progress</h3>
        <p>Earn points to track your progress, celebrate milestones as you complete quizzes and master new topics. Every session moves you closer to your learning goals.</p>
        <p><span className="cards-logo">LRNR</span></p>
      </div>

      <div className="cards">
        <h3><span className="card-accent">Personal</span> <br></br>SME</h3>
        <p>Experience quizzes designed with depth and purpose. Each question is crafter to reflect real-world knowledge and practical understanding, helping you think critically and apply what you learn. With expert-inspired content guiding your progress, you're not just memorizing answers, you're building true subject mastery.</p>
        <p><span className="cards-logo">LRNR</span></p>
      </div>
    </div>
  </div>
  )
}

// Exporting Home so it can be used in App.jsx
export default Home