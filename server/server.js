import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// For testing 
let topic = "CI/CD";
let numQuestions = "10";
let expertise = "Novice";
let questionStyle = "master oogway" 

const prompt = `
Create ${numQuestions} open-ended ${expertise}-level questions about "${topic}" 
in the style of ${questionStyle}.

Return an array only.
No answers.
`;

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  console.log(response.text);
}

main();