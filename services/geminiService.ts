import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Tone, Topic, ImageStyle, GeneratedContent } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Catchy title for the blog post" },
      blogBody: { type: Type.STRING, description: "A 3-paragraph blog post formatted with Markdown" },
      facebookPost: { type: Type.STRING, description: "A facebook post with emojis and hashtags" },
      imagePrompt: { type: Type.STRING, description: "A detailed visual description to generate a photorealistic image to accompany this post" }
    },
    required: ["title", "blogBody", "facebookPost", "imagePrompt"],
  }
};

export const generatePostIdeas = async (topic: Topic, tone: Tone, customContext?: string): Promise<GeneratedContent[]> => {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are the social media manager for "Sober Solutions", a high-end, supportive sober living home in Nashville, TN.
    Your goal is to create content that appeals to individuals seeking recovery or their families.
    
    Brand Voice:
    - Compassionate, professional, and hopeful.
    - Deeply rooted in the Nashville community (mention local vibes where appropriate).
    - Emphasize "Sober Solutions" as a safe haven and a place of transformation.

    Task:
    Generate 3 distinct content options based on the user's request.

    Content Guidelines:
    - For "Family" topics: Focus on healing relationships, setting boundaries, and the role of a support system.
    - For "Holistic" topics: Mention the importance of routine, nature, nutrition, and mindfulness in sobriety.
    - For "Nashville" topics: Reference local culture, nature (parks, greenways), or the vibrant recovery community in TN.
    - For "Sober Solutions" brand: Highlight the home-like environment, structure, and brotherhood/community.
    
    Ensure the "imagePrompt" is descriptive enough for an AI image generator (e.g., "A warm, sunlit living room with comfortable seating, cinematic lighting, photorealistic").
  `;

  const prompt = `
    Topic: ${topic}
    Tone: ${tone}
    Additional Context: ${customContext || "N/A"}
    
    Create 3 unique options.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: textResponseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text) as GeneratedContent[];
    return parsed;
  } catch (error) {
    console.error("Error generating text content:", error);
    throw error;
  }
};

const VARIATION_MODIFIERS = [
  "seen from a low angle",
  "close-up detail shot",
  "wide panoramic view",
  "shot with a macro lens",
  "golden hour lighting",
  "blue hour lighting",
  "soft morning mist",
  "dramatic high contrast",
  "overhead drone view",
  "side profile view",
  "bokeh background"
];

export const generatePostImage = async (imagePrompt: string, style: ImageStyle = ImageStyle.PHOTOREALISTIC, isRegeneration: boolean = false): Promise<string | undefined> => {
  const model = "gemini-2.5-flash-image";

  // Construct the final prompt with style and potential random variation
  let finalPrompt = `${imagePrompt}, Style: ${style}`;
  
  // If regenerating, force difference by appending a random modifier
  if (isRegeneration) {
    const randomModifier = VARIATION_MODIFIERS[Math.floor(Math.random() * VARIATION_MODIFIERS.length)];
    finalPrompt += `, ${randomModifier}, distinct variation`;
  }

  // Append quality keywords based on style (general improvements)
  finalPrompt += ", high quality, 4k";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
           { text: finalPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3"
        }
      }
    });

    // Extract base64 image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined; // Fail gracefully
  }
};