import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";


const app = express();

// Allow requests from the frontend
app.use(cors());
app.use(express.json());

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