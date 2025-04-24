
import { toast } from "@/components/ui/sonner";

// API Configuration
const GEMINI_CONFIG = {
  model: "gemini-1.5-flash-latest",
  endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
  apiKey: "AIzaSyCjuO86LbSSh1iDt5VfSw-msibIrUYFfkA" // This would normally be stored securely
};

export interface StoryParams {
  genre: string;
  plot: string;
  perspective: string;
  characters: string;
  setting: string;
  format: string;
}

export interface GenerationResponse {
  story: string;
  meta?: {
    model: string;
    tokens?: number;
    timestamp: string;
  };
}

// Cache for storing generated stories
const storyCache = new Map<string, string>();

// Rate limiter
const requestTimes: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 5;

/**
 * Check if we've exceeded the rate limit
 */
const checkRateLimit = (): boolean => {
  const now = Date.now();
  // Filter out requests older than 1 minute
  const recentRequests = requestTimes.filter(time => now - time < 60000);
  
  // Update the request times array
  while (requestTimes.length > 0 && now - requestTimes[0] >= 60000) {
    requestTimes.shift();
  }
  
  return recentRequests.length < MAX_REQUESTS_PER_MINUTE;
};

/**
 * Generate a story using the Gemini API
 */
export const generateStory = async (params: StoryParams): Promise<GenerationResponse> => {
  // Check if we've exceeded the rate limit
  if (!checkRateLimit()) {
    toast.error("Please wait a moment before generating another story");
    throw new Error("Rate limit exceeded");
  }
  
  // Generate cache key based on parameters
  const cacheKey = JSON.stringify(params);
  
  // Check if we have a cached response
  if (storyCache.has(cacheKey)) {
    toast.success("Retrieved from cache");
    return {
      story: storyCache.get(cacheKey) as string,
      meta: {
        model: "cache",
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // Record this request time for rate limiting
  requestTimes.push(Date.now());
  
  try {
    // Build the prompt for the AI
    const prompt = buildStoryPrompt(params);
    
    // Make the API request
    const response = await fetch(
      `${GEMINI_CONFIG.endpoint}/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate story");
    }
    
    const data = await response.json();
    
    // Process the response
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      const rawStory = data.candidates[0].content.parts[0].text;
      
      // Format the story text
      const formattedStory = formatStoryText(rawStory);
      
      // Cache the response
      storyCache.set(cacheKey, formattedStory);
      
      return {
        story: formattedStory,
        meta: {
          model: GEMINI_CONFIG.model,
          tokens: data.usageMetadata?.totalTokenCount || Math.ceil(rawStory.length / 4),
          timestamp: new Date().toISOString()
        }
      };
    } else {
      throw new Error("Invalid response from Gemini API");
    }
  } catch (error) {
    toast.error(`Error: ${(error as Error).message}`);
    throw error;
  }
};

/**
 * Build a prompt for the story generator
 */
const buildStoryPrompt = (params: StoryParams): string => {
  const { genre, plot, perspective, characters, setting, format } = params;
  
  const characterList = characters
    .split(',')
    .map(c => c.trim())
    .filter(c => c)
    .join(', ');
  
  if (format === 'dialogue') {
    return `
      Write a 300-word ${genre} story in dialogue-only format with these elements:
      
      **Core Plot**: ${plot}
      **Characters**: ${characterList || 'An original protagonist'}
      **Setting**: ${setting || 'A vivid fictional world'}
      **Perspective**: ${perspective}
      
      **Requirements**:
      - Use only dialogue, formatted as "Character: Dialogue text" (e.g., "Sarah: Hello")
      - Each line must be spoken by a character (no narration)
      - Include at least 5-7 dialogue exchanges
      - Maintain ${perspective} perspective through the dialogue
      - Convey the plot and setting entirely through character speech
      - End with a clear resolution
    `;
  } else {
    return `
      Write a 300-word ${genre} story with these elements:
      
      **Core Plot**: ${plot}
      **Characters**: ${characterList || 'An original protagonist'}
      **Setting**: ${setting || 'A vivid fictional world'}
      **Perspective**: ${perspective}
      
      **Requirements**:
      - Three-act structure (setup → confrontation → resolution)
      - Minimum 3 natural dialogues
      - Strict ${perspective} perspective
      - Paragraph breaks every 3-5 sentences
      - Don't include any markdown formatting in your response
    `;
  }
};

/**
 * Format the raw story text
 */
const formatStoryText = (rawStory: string): string => {
  return rawStory
    .replace(/\*\*.*?\*\*/g, '') // Remove markdown
    .replace(/(\S)\n(\S)/g, '$1 $2') // Fix mid-paragraph breaks
    .replace(/\n{3,}/g, '\n\n') // Normalize spacing
    .trim();
};
