import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


app.post("/api/generateQuiz", async (req, res) => {
 const { topic, numQuestions, expertise, style } = req.body;


   const prompt = `
   Create ${numQuestions} open-ended ${expertise}-level questions about "${topic}"
   in the style of ${style}.


   Return an array only.
   No answers.
   `;


 try {
   const response = await ai.models.generateContent({
   model: "gemini-3-flash-preview",
   contents: prompt,
 });


   const questions = JSON.parse(response.text);
   res.json({ questions });
 } catch (error) {
   res.status(500).json({ error: "Failed to generate quiz" });
 }
});


app.listen(3000, () => console.log("Server running on port 3000"));

