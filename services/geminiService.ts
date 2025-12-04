import { GoogleGenAI, Type } from "@google/genai";
import { Tone, Topic, ImageStyle, ContentType, GeneratedContent } from '../types';

// Initialize Gemini Client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const textResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title, Subject Line, or H1 Header" },
      blogBody: { type: Type.STRING, description: "The main content body (Report, Email, Blog, Strategy, etc)" },
      facebookPost: { type: Type.STRING, description: "Secondary content: Summary, Key Takeaways, Ad Descriptions, or Social Post." },
      imagePrompt: { type: Type.STRING, description: "A visual description of the subject matter ONLY." }
    },
    required: ["title", "blogBody", "facebookPost", "imagePrompt"],
  }
};

export const generatePostIdeas = async (topic: Topic, tone: Tone, contentType: ContentType, customContext?: string): Promise<GeneratedContent[]> => {
  const ai = getAiClient();
  const model = "gemini-2.5-flash";
  
  // Enable Google Search only for Competitor Analysis
  const useSearch = contentType === ContentType.COMPETITOR_SEO || contentType === ContentType.COMPETITOR_SOCIAL;
  
  let typeSpecificInstructions = "";
  
  switch (contentType) {
    // --- Social & Marketing ---
    case ContentType.BLOG_SHORT:
      typeSpecificInstructions = "Format 'blogBody' as a concise, punchy 1-paragraph blog post.";
      break;
    case ContentType.BLOG_LONG:
      typeSpecificInstructions = "Format 'blogBody' as a detailed 3-5 paragraph blog post using Markdown.";
      break;
    case ContentType.FACEBOOK:
      typeSpecificInstructions = "Format 'blogBody' as an engaging social media narrative. 'facebookPost' should be a shorter, punchy version.";
      break;
    case ContentType.FLYER:
      typeSpecificInstructions = `
        Format 'blogBody' as text for a physical Flyer.
        MANDATORY: Include 'Sober Solutions', Phone '615-474-0573', and 'Open beds available'.
        Use bullet points.
      `;
      break;
    case ContentType.OUTREACH_EMAIL:
      typeSpecificInstructions = `
        Format 'title' as a Professional Subject Line.
        Format 'blogBody' as a B2B Email to a clinician/therapist.
        - Tone: Professional but personal.
        - Goal: Ask for a coffee meeting or referral relationship.
        - Include: 'Sober Solutions' and contact info.
        Format 'facebookPost' as 2 alternative Subject Lines.
      `;
      break;

    // --- SEO & Web ---
    case ContentType.GBP_UPDATE:
      typeSpecificInstructions = `
        Format 'title' as the 'What's New' headline.
        Format 'blogBody' as a Google Business Profile 'Update' post (approx 100-200 words).
        - Focus: Local SEO keywords (Nashville, Sober Living).
        - Call to Action: 'Learn more' or 'Call now'.
        Format 'facebookPost' as a list of 5 target keywords used in the post.
      `;
      break;
    case ContentType.WEBSITE_HERO:
      typeSpecificInstructions = `
        Format 'title' as a H1 Headline.
        Format 'blogBody' as a Sub-headline (H2) and a 3-sentence Value Proposition paragraph.
        Format 'facebookPost' as the Button CTA text (e.g., 'Get Help Now').
      `;
      break;
    case ContentType.SEO_META:
      typeSpecificInstructions = `
        Format 'title' as the SEO Title Tag (max 60 chars).
        Format 'blogBody' as the Meta Description (max 160 chars).
        Format 'facebookPost' as a list of alternative keywords.
        IMPORTANT: 'imagePrompt' should be 'No Image Needed' for this type.
      `;
      break;
    case ContentType.FAQ_SECTION:
      typeSpecificInstructions = `
        Format 'title' as 'Frequently Asked Questions'.
        Format 'blogBody' as 3 Q&A pairs related to the topic, formatted in Markdown.
        Format 'facebookPost' as a summary sentence for the section.
      `;
      break;

    // --- Competitor Analysis ---
    case ContentType.COMPETITOR_SEO:
      typeSpecificInstructions = `
        Use Google Search to find information about the competitor mentioned in the Context.
        Format 'title' as "SEO Comparison: Sober Solutions vs [Competitor]".
        Format 'blogBody' as a Markdown Table comparing:
        - Estimated Content Volume
        - Keyword Focus (e.g., "Partial Hospitalization" vs "Sober Living")
        - User Experience / Mobile Friendliness (inferred from search results)
        - Local Ranking Signals (Reviews count, etc).
        Then provide 3 actionable SEO recommendations for Sober Solutions to beat them.
        Format 'facebookPost' as a bulleted summary of their weaknesses.
      `;
      break;
    case ContentType.COMPETITOR_SOCIAL:
      typeSpecificInstructions = `
        Use Google Search to find recent social media activity (Facebook, Instagram, LinkedIn) for the competitor in the Context.
        Format 'title' as "Social Activity Log: [Competitor]".
        Format 'blogBody' as a chronological list (Log) of their recent activity (last 7-14 days).
        Include:
        - Date (approx)
        - Topic (e.g., "Alumni BBQ", "Mental Health Tip")
        - Engagement Level (High/Low based on observed likes/comments).
        - Format as a Markdown list.
        Format 'facebookPost' as a strategy note: "How we can outperform their engagement".
      `;
      break;

    // --- Marketing & Strategy ---
    case ContentType.GOOGLE_ADS:
      typeSpecificInstructions = `
        Format 'title' as "Campaign Theme".
        Format 'blogBody' as a Markdown list of 5 Google Ads Headlines (Max 30 chars each).
        Format 'facebookPost' as a list of 3 Google Ads Descriptions (Max 90 chars each).
        Ensure high conversion language (Call to Action, Benefits).
        IMPORTANT: 'imagePrompt' should be 'No Image Needed' for this type.
      `;
      break;
    case ContentType.REVIEW_REQUEST:
      typeSpecificInstructions = `
        Format 'title' as "Review Request Approach".
        Format 'blogBody' as a polite, ethical email/text script asking an Alumni for a Google Review.
        - Focus: No pressure, anonymity option, helping others find sobriety.
        Format 'facebookPost' as a "Thank You" social post highlighting a generic success story.
      `;
      break;
    case ContentType.STRATEGY_PLAN:
      typeSpecificInstructions = `
        Format 'title' as "30-Day Goal: [Goal derived from topic]".
        Format 'blogBody' as a 4-week Markdown plan.
        - Week 1: Focus
        - Week 2: Focus
        - Week 3: Focus
        - Week 4: Review
        Format 'facebookPost' as a list of KPIs to track.
        IMPORTANT: 'imagePrompt' should be 'No Image Needed' for this type.
      `;
      break;
  }

  const systemInstruction = `
    You are the Chief Marketing Officer for "Sober Solutions", a high-end sober living home in Nashville, TN.
    
    Current Content Type: ${contentType}
    ${typeSpecificInstructions}

    Brand Voice: Compassionate, Professional, deeply rooted in Nashville recovery community.
    For Competitor Analysis: Use Google Search to find real data.
  `;

  const prompt = `
    Topic: ${topic}
    Tone: ${tone}
    Context: ${customContext || "N/A"}
    
    Create 3 unique options.
  `;

  const config: any = {
    systemInstruction,
    temperature: 0.7,
  };

  if (useSearch) {
     config.tools = [{ googleSearch: {} }];
     config.responseMimeType = "application/json";
     config.responseSchema = textResponseSchema;
  } else {
     config.responseMimeType = "application/json";
     config.responseSchema = textResponseSchema;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });

    const text = response.text;
    if (!text) return [];
    
    const jsonMatch = text.match(/\[.*\]/s);
    const validJson = jsonMatch ? jsonMatch[0] : text;

    const parsed = JSON.parse(validJson) as GeneratedContent[];
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
  // Skip generation for Meta tags or explicitly "No Image Needed" prompts
  if (imagePrompt.toLowerCase().includes("no image needed")) return undefined;

  const ai = getAiClient();
  const model = "gemini-2.5-flash-image";

  let finalPrompt = `${imagePrompt}, Style: ${style}`;
  
  if (isRegeneration) {
    const randomModifier = VARIATION_MODIFIERS[Math.floor(Math.random() * VARIATION_MODIFIERS.length)];
    finalPrompt += `, ${randomModifier}, distinct variation`;
  }

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
    return undefined;
  }
};