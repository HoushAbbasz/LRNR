# LRNR 🐢

**Live Demo:** https://main.d2b86jhshsshmn.amplifyapp.com/

**Your guided path to programming enlightenment.**

LRNR is an AI-powered quiz app that generates personalized, open-ended questions on any topic using Google Gemini. Users can customize their quiz by topic, difficulty, number of questions, and question style, then earn XP, level up, and track their best scores over time.

---

## Project Overview

LRNR is a full-stack team project built for Road to Hire Cohort 18. The goal was to create a learning tool that goes beyond multiple choice by using AI to generate and grade open-ended questions. Users log in, configure a quiz, answer questions, and get instant AI feedback on each response.

---

## Features

- **AI-Generated Quizzes:** Powered by Google Gemini. Enter any topic and get unique open-ended questions every time.
- **AI-Graded Answers:** Gemini evaluates the user's answer, explains whether it is correct or incorrect, and provides the correct answer.
- **XP and Level System:** Earn points for every correct answer. 100 XP equals 1 level.
- **Daily Streaks:** Complete at least one quiz per day to keep your streak going.
- **Best Score Tracking:** The highest score for each quiz configuration is saved to the user's account.
- **Quiz Guard:** If a user tries to navigate away mid-quiz, a confirmation modal appears before any progress is lost.
- **Flying Leroy:** An animated turtle that occasionally flies across the screen. 🐢

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React | UI framework |
| React Router | Client-side routing |
| Vite | Build tool and dev server |
| CSS (vanilla) | Styling with CSS variables and mobile-first design |
| Space Grotesk | Primary UI font via Google Fonts |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| Google Gemini API | Quiz generation and answer grading |
| MySQL2 + AWS RDS | Database and connection pooling |
| JWT | Auth token generation and verification |
| bcrypt | Password hashing |
| dotenv | Environment variable management |

---

## Project Structure

```
LRNR/
├── client/
│   └── vite-project/
│       ├── public/
│       │   ├── fonts/           # Custom fonts (akira, mirage, arcade, drag, zt)
│       │   └── images/          # Topic logos and UI images
│       └── src/
│           ├── components/
│           │   ├── QuizFlow.jsx      # Manages the full quiz state machine
│           │   ├── Navbar.jsx        # Navigation with quiz guard integration
│           │   ├── Footer.jsx
│           │   ├── XpDonut.jsx       # XP progress donut chart
│           │   └── FlyingLeroy.jsx   # Animated turtle easter egg
│           ├── context/
│           │   └── AuthContext.jsx   # Auth state (token, login, logout)
│           ├── pages/
│           │   ├── Home.jsx          # Landing page with typed animation and carousel
│           │   ├── Quiz.jsx          # Quiz config form
│           │   ├── QuizQuestions.jsx # Question and answer flow
│           │   ├── Results.jsx       # Score summary and review
│           │   ├── Account.jsx       # User profile, XP, scores
│           │   └── Login.jsx         # Login and registration
│           ├── App.jsx               # Router setup and NavRequestContext
│           └── index.css             # All styles with CSS variables
└── server/
    ├── server.js    # Express app and all API routes
    ├── db.js        # MySQL connection pool
    └── db-setup.js  # Database schema setup
```

---

## API Documentation

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| POST | `/api/register` | No | Create a new user account |
| POST | `/api/login` | No | Log in and receive a JWT token |
| GET | `/api/account` | Yes | Get user profile and quiz scores |
| POST | `/api/score` | Yes | Save a score and update XP, level, and streak |
| POST | `/api/generateQuiz` | No | Generate quiz questions via Gemini |
| POST | `/api/checkAnswer` | No | Grade a user's answer via Gemini |

---

## Installation Instructions

### Prerequisites
- Node.js v24+
- MySQL database (local or AWS RDS)
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/HoushAbbasz/LRNR.git
cd LRNR
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```
GEMINI_API_KEY=your_gemini_api_key
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=lrnr
JWT_SECRET=your_jwt_secret
PORT=3000
```

Run the database setup script (first time only):
```bash
node db-setup.js
```

Start the server:
```bash
node server.js
```

### 3. Set up the client
```bash
cd client/vite-project
npm install
```

Create a `.env` file in `client/vite-project/`:
```
VITE_API_URL=http://localhost:3000
```

Start the dev server:
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

---

## Configuration Guide

The app requires two `.env` files, one for the server and one for the client. Neither should be committed to version control.

The server `.env` needs a valid Gemini API key (available at [aistudio.google.com](https://aistudio.google.com)), a running MySQL database, and a JWT secret string of your choice.

The client `.env` just needs the base URL pointing to wherever the server is running.

---

## Database Schema

**ACCOUNT**
| Column | Type | Description |
|--------|------|-------------|
| user_id | INT (PK) | Auto-incremented user ID |
| username | VARCHAR(50) | Unique, required |
| password_hash | VARCHAR(255) | bcrypt hashed password |
| streak | INT | Current daily quiz streak, defaults to 0 |
| xp | INT | Total XP earned, defaults to 0 |
| level | INT | Calculated from XP (100 XP = 1 level), defaults to 1 |
| last_quiz_date | DATE | Date of last completed quiz, defaults to null |

**QUIZ**
| Column | Type | Description |
|--------|------|-------------|
| quiz_id | INT (PK) | Auto-incremented quiz ID |
| user_id | INT (FK) | References ACCOUNT |
| topic | VARCHAR(100) | Quiz topic |
| expertise | VARCHAR(50) | novice / intermediate / expert |
| num_of_questions | INT | Number of questions in the quiz |
| best_score | INT | Highest score for this configuration |

One best score is stored per unique combination of user, topic, expertise, and number of questions.

---

## Acknowledgements

Built as a project for **Road to Hire Cohort 18** (2025-2026).

---

## License

This project is licensed under the [MIT License](LICENSE).
