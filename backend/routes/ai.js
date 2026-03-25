import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.use(authMiddleware);

/**
 * POST /api/ai/explain-commit
 * Analyzes commit diff and provides a summary using Gemini.
 */
router.post("/explain-commit", async (req, res) => {
  const { diff, message } = req.body;

  if (!diff) {
    return res.status(400).json({ error: "Diff content is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert Git assistant. Explain the following Git commit diff in simple, professional terms for a developer.
      Commit Message: ${message || "No message provided"}
      
      Diff Content:
      ${diff.substring(0, 10000)} 
      
      Provide:
      1. A concise summary of WHAT changed.
      2. The WHY (if inferable from the message/code).
      3. A "Risk Level" (Low/Medium/High) with a brief reason.
      
      Format the output in clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({ explanation });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate AI explanation" });
  }
});

/**
 * POST /api/ai/suggest-message
 * Suggests a commit message based on diff using Gemini.
 */
router.post("/suggest-message", async (req, res) => {
  const { diff } = req.body;
  
  if (!diff) {
     return res.status(400).json({ error: "Diff content is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Suggest 3 professional Git commit messages (following Conventional Commits if possible) for this diff:
      ${diff.substring(0, 5000)}
      
      Return only the 3 suggestions, one per line.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const suggestions = text.split('\n').filter(line => line.trim() !== "");

    res.json({ suggestions });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

export default router;
