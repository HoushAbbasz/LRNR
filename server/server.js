import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";


const app = express();

// Allow requests from the frontend (React dev server)
app.use(cors());

// Parse incoming JSON request bodies so req.body works
app.use(express.json());

// Initialize a new instance of Gemini and AI Model Version
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const modelVersion = "gemini-3-flash-preview";

// POST /api/generateQuiz
// Receives quiz config from the frontend and asks Gemini to generate questions
app.post("/api/generateQuiz", async (req, res) => {
 // Deconstruct request into variables 
 const { topic, numQuestions, expertise, style } = req.body;

   // Prompt for Gemini to create a quiz  
   const prompt = `
   Create ${numQuestions} open-ended ${expertise}-level questions about "${topic}"
   in the style of ${style}.


   Return an array only.
   No answers.
   `;

 // Try to get a response using the prompt and Gemini  
 try {
   const response = await ai.models.generateContent({
   model: modelVersion,
   contents: prompt,
 });

    // Remove any ```json or ``` markdowns that Gemini may have wrapped around the response
    const cleaned = response.text.replace(/```json|```/g, "").trim();
    // Parse the cleaned string into a JavaScript object
    const result = JSON.parse(cleaned);
    // Return the result to the frontend as JSON
    res.json(result);
  // Catch any errors if Gemini doesn't work 
  } catch (error) {
    console.error("Failed to check answer:", error);
    res.status(500).json({ error: "Failed to check answer" });
  }
});

// POST /api/checkAnswer
// Receives a question and the user's answer, asks Gemini to grade it
app.post("/api/checkAnswer", async (req, res) => {
   // Deconstruct request into variables 
  const { question, userAnswer, topic, style } = req.body;

  // prompt for checking a quiz answer 
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
  // Try to get a response from the prompt and Gemini
  try {
    const response = await ai.models.generateContent({
      model: modelVersion,
      contents: prompt,
    });
 
    // Remove any ```json or ``` markdowns that Gemini may have wrapped around the response
    /* example: ```json {
                        "correct": false, 
                        "explanation": "example explaination", 
                        "correctAnswer": "example correct answer"
                        } ``` */
                         
    const cleaned = response.text.replace(/```json|```/g, "").trim();
    // Parse the cleaned string into a JavaScript object
    const result = JSON.parse(cleaned);
    // Return the result to the frontend as JSON
    res.json(result);
  // Catch any errors if Gemini doesn't work 
  } catch (error) {
    console.error("Failed to check answer:", error);
    res.status(500).json({ error: "Failed to check answer" });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));

