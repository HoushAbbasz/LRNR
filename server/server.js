import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// For testing 
let content = "CI/CD";
let number = "10";

const prompt = `Create a quiz about ${content} that has ${number} questions give the questions in JSON format. Don't give the answer.`;


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

//   For testing
  console.log('------------ response');
  console.log(response.text);
}

main();