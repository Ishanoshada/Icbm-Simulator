
import { GoogleGenAI } from "@google/genai";

// Guideline: Always use direct process.env.API_KEY and named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model', text: string }[] = []) => {
  try {
    // Guideline: For text answers, use ai.models.generateContent with both model and prompt.
    // We map history to the contents structure for stateless continuation.
    const contents = [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: `You are LankaBot, an expert guide for Sri Lankan tourism and history. 
        You provide engaging, accurate, and helpful information about Sri Lanka's geography, culture, food, and landmarks.
        Keep your responses concise but insightful. If the user asks about a specific city or place, provide historical context and travel tips.`,
      },
    });

    // Guideline: Use .text property directly (not a method).
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment!";
  }
};
