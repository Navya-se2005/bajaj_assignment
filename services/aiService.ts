import { GoogleGenAI } from "@google/genai";

export const getSingleWordAiResponse = async (question: string): Promise<string> => {
  if (!question || typeof question !== 'string') {
    throw new Error("Invalid input for AI: must be a non-empty string.");
  }

  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
      throw new Error("API Key is missing. Ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Question: ${question}`,
      config: {
        systemInstruction: "You are a highly constrained assistant. You MUST answer the user's question with EXACTLY ONE SINGLE WORD. Do not add any punctuation, articles (a, an, the), or extra text. If you don't know the answer, reply with 'Unknown'.",
        temperature: 0.1, // factual answers
      }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("Received empty response from AI model.");
    }
    
    // Clean up
    return text.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};
