import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Using gemini-2.5-flash-latest for multimodal capabilities (audio/video)
const MODEL_NAME = 'gemini-2.5-flash-latest';

export const generateSubtitles = async (
  base64Data: string, 
  mimeType: string,
  onProgress: (status: string) => void
): Promise<string> => {
  
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  onProgress("Initializing Gemini model...");

  const systemInstruction = `
You are a professional subtitle editor expert in Adobe Premiere Pro workflows.
Your task is to transcribe the provided audio/video into Simplified Chinese (简体中文) SRT format.

STRICT RULES:
1. **Context**: Content is about AI tools and technology. Use appropriate terminology.
2. **Spacing**: You MUST insert a space between Chinese characters and English words or Numbers (e.g., "使用 AI 工具", "第 1 名").
3. **Structure**: strict SRT format. Number, Timestamp, Text. No blank lines between timestamps within a block, but one blank line between blocks.
4. **Line Length**: Each subtitle line MUST NOT exceed 18 characters (Chinese characters count as 1).
5. **Single Line**: Do NOT use multi-line subtitles. Split long sentences into multiple timestamp blocks instead.
6. **Punctuation**: 
   - NO punctuation at the very start of a line.
   - NO punctuation at the very end of a line (remove commas, periods, etc., at the end).
   - Keep necessary internal punctuation (commas, quotes) for readability.
7. **Accuracy**: Ensure timestamps are precise. If speech is unclear, infer from context.
8. **Output**: Return ONLY the raw SRT content. No markdown code blocks, no intro text.
`;

  try {
    onProgress("Uploading media and generating captions... (This may take a moment)");
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for higher accuracy
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Please transcribe this media file into Simplified Chinese SRT following all the rules."
          }
        ]
      }
    });

    onProgress("Finalizing...");
    
    const text = response.text;
    if (!text) {
      throw new Error("No response generated from the model.");
    }

    // Clean up if the model accidentally wrapped it in markdown
    const cleanedText = text.replace(/```srt/g, '').replace(/```/g, '').trim();
    return cleanedText;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("413")) {
      throw new Error("File is too large for the browser API. Please try a smaller file (under 20MB) or use a compressed audio format.");
    }
    throw error;
  }
};
