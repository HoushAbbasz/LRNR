import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

// Allow requests from the frontend
app.use(cors());
app.use(express.json());

// DATABASE APIS ------------------------------------------
// -----------------------------------------------------

// Middleware that checks for a valid JWT token on protected routes
// Attaches the decoded user payload to req.user if valid
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Token is sent as "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    
    // Attach decoded user data to the request so routes can access req.user.user_id
    req.user = user;
    // Pass control to the actual route handler
    next();
  });
}

// POST /api/register
// Creates a new account with a hashed password
app.post("/api/register", async (req, res) => {
  // Destructure the username and password from the request body
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    // Hash the password before storing it
    const password_hash = await bcrypt.hash(password, 10);
    // Insert the new user into the ACCOUNT table
    await db.query(
      "INSERT INTO ACCOUNT (username, password_hash) VALUES (?, ?)",
      [username, password_hash]
    );
    res.json({ message: "Account created successfully" });
  } catch (error) {
    // username already exists error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already taken" });
    }
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /api/login
// Validates credentials and returns a JWT token
app.post("/api/login", async (req, res) => {
  // Destructure the username and password from the request body
  const { username, password } = req.body;

  try {
    // Look up the user by username
    const [rows] = await db.query(
      "SELECT * FROM ACCOUNT WHERE username = ?",
      [username]
    );
    // If the first and only user from the array is not found, throw an error 
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare the submitted password against the stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Create a JWT token containing the user's id and username
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Send the token and username to the frontend
    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// GET /api/account
// Returns the logged-in user's profile and quiz scores
app.get("/api/account", authenticateToken, async (req, res) => {
  try {
    // Fetch the user's data using their user_id decoded from the JWT token
    const [userRows] = await db.query(
      "SELECT username, streak, xp, level FROM ACCOUNT WHERE user_id = ?",
      [req.user.user_id]
    );
    // Fetch all of the user's best quiz scores from the QUIZ table
    const [scoreRows] = await db.query(
      "SELECT topic, expertise, num_of_questions, best_score FROM QUIZ WHERE user_id = ?",
      [req.user.user_id]
    );
    // Send both Account info and quiz score as a response
    res.json({ account: userRows[0], scores: scoreRows });
  } catch (error) {
    console.error("Account fetch error:", error);
    res.status(500).json({ error: "Failed to fetch account" });
  }
});

// POST /api/score
// Saves or updates the user's best score for a given quiz config
app.post("/api/score", authenticateToken, async (req, res) => {
  // Destructure the quiz result data from the request body
  const { topic, expertise, num_of_questions, score } = req.body;

  try {
    // Save/update the best score for this quiz config
    await db.query(
      `INSERT INTO QUIZ (user_id, topic, expertise, num_of_questions, best_score)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE best_score = IF(VALUES(best_score) > best_score, VALUES(best_score), best_score)`,
      [req.user.user_id, topic, expertise, num_of_questions, score]
    );

    // Fetch the user's current streak and last quiz date
    const [rows] = await db.query(
      "SELECT streak, last_quiz_date FROM ACCOUNT WHERE user_id = ?",
      [req.user.user_id]
    );
    const { streak, last_quiz_date } = rows[0];

    // Get today's date as a YYYY-MM-DD string to compare against last_quiz_date
    const today = new Date().toISOString().split("T")[0];
    const lastDate = last_quiz_date ? last_quiz_date.toISOString().split("T")[0] : null;

    // Get yesterday's date to check if the streak should continue
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = streak;

    if (lastDate === today) {
      // User already completed a quiz today — streak stays the same
      newStreak = streak;
    } else if (lastDate === yesterdayStr) {
      // User completed a quiz yesterday — streak continues
      newStreak = streak + 1;
    } else {
      // User missed a day or this is their first quiz — streak resets to 1
      newStreak = 1;
    }

    // Update XP, level, streak, and last quiz date
    await db.query(
      `UPDATE ACCOUNT
       SET xp = xp + ?,
           level = FLOOR((xp + ?) / 100) + 1,
           streak = ?,
           last_quiz_date = ?
       WHERE user_id = ?`,
      [score, score, newStreak, today, req.user.user_id]
    );
    // Send a success message and the updated streak to frontend
    res.json({ message: "Score saved", streak: newStreak });
  } catch (error) {
    console.error("Score save error:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// GEMINI APIS ------------------------------------------
// ------------------------------------------------------

// Initialize Gemini and model version
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const modelVersion = "gemini-3-flash-preview";

// POST /api/generateQuiz
// Receives quiz config from the frontend and asks Gemini to generate questions
app.post("/api/generateQuiz", async (req, res) => {
//  Destructures request body into variables
 const { topic, numQuestions, expertise, style } = req.body;

   // prompt for generating questions
  const prompt = `
  Create ${numQuestions} open-ended ${expertise}-level questions about "${topic}"
  in the style of ${style}.
  Return a JSON array of strings only. No answers. No markdown. No extra text.
  Example: ["Question one?", "Question two?"]
  `;

 // Try to get a response from the Gemini API using the initialized model version
 try {
   const response = await ai.models.generateContent({
   model: modelVersion,
   contents: prompt,
 });

  /* Need to clean the data because Gemini sometimes returns
  ```json
    { "correct": true, "explanation": "..." }
  ``` 
  */
  const cleaned = response.text.replace(/```json|```/g, "").trim();
  const questions = JSON.parse(cleaned);
  //  Send the questions as a response 
  res.json({ questions });
 // Catch any errors if the quiz failed to generate    
 } catch (error) {
  console.error("Failed to generate quiz:", error);
  res.status(500).json({ error: "Failed to generate quiz" }); }
});

// POST /api/checkAnswer
// Receives a question and the user's answer, asks Gemini to grade it
app.post("/api/checkAnswer", async (req, res) => {
  const { question, userAnswer, topic, style } = req.body;

  // Prompt for checking the user's answer to a question 
  const prompt = `
  You are grading a quiz answer. Respond entirely in the style of "${style}".

  Topic: ${topic}
  Question: ${question}
  User's answer: ${userAnswer}

  Evaluate whether the user's answer is correct.
  Respond in JSON only. No markdown. No extra text.
  Use this exact structure:
  {
    "correct": true or false,
    "explanation": "Your explanation here",
    "correctAnswer": "The correct answer here"
  }
  `;

  // Try to get a response from the Gemini API using the initialized model version
  try {
    const response = await ai.models.generateContent({
      model: modelVersion,
      contents: prompt,
    });
    /* Need to clean the data because Gemini sometimes returns
    ```json
      { "correct": true, "explanation": "..." }
    ``` 
    */
    const cleaned = response.text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);
    // Send the correct/incorrect status and explanation as a response
    res.json(result);
  // Catch any errors if the answer to question failed to generate 
  } catch (error) {
    console.error("Failed to check answer:", error);
    res.status(500).json({ error: "Failed to check answer" });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));