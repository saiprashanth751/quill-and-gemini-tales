
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Image, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface StoryIllustrationProps {
  storyText: string | null;
  storyGenre: string;
  enabled?: boolean;
}

export function StoryIllustration({ storyText, storyGenre, enabled = true }: StoryIllustrationProps) {
  const [illustration, setIllustration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract a key phrase from the story to make the illustration more relevant
  const extractKeyPhrase = (text: string): string => {
    if (!text) return "";
    
    // Split into sentences and find one with visually descriptive keywords
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const visualKeywords = ['mountain', 'castle', 'forest', 'river', 'sky', 'building', 'character', 'face', 'sword', 'magic'];
    
    // Try to find a sentence with visual keywords
    for (const keyword of visualKeywords) {
      const matchingSentence = sentences.find(s => 
        s.toLowerCase().includes(keyword)
      );
      if (matchingSentence) return matchingSentence.trim();
    }
    
    // Fall back to first substantial sentence if no matches
    return sentences[0] || "A scene from the story";
  };
  
  // For demo purposes, we'll use curated placeholder images based on genre
  // In a real implementation, this would call an AI image generation API
  const generateIllustration = () => {
    if (!storyText || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    // Mock API call with timeout to simulate AI image generation
    setTimeout(() => {
      try {
        // Map of genre to placeholder images
        const genreImageMap: Record<string, string[]> = {
          fantasy: [
            "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800&auto=format&fit=crop"
          ],
          "sci-fi": [
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop"
          ],
          mystery: [
            "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop"
          ],
          horror: [
            "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop"
          ],
          adventure: [
            "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop"
          ],
          romance: [
            "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop"
          ],
          erotic: [
            "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop"
          ]
        };
        
        // Get image array for genre or use default
        const imageArray = genreImageMap[storyGenre.toLowerCase()] || 
          ["https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&auto=format&fit=crop"];
        
        // Pick a random image from the array to simulate different generations
        const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)];
        
        // Get a key phrase from the story
        const keyPhrase = extractKeyPhrase(storyText);
        
        setIllustration(randomImage);
        setLoading(false);
        
        toast.success("Illustration generated");
      } catch (err) {
        setError("Failed to generate illustration");
        setLoading(false);
        toast.error("Failed to generate illustration");
        console.error("Illustration generation failed:", err);
      }
    }, 1500); // Simulate API delay
  };
  
  // Generate illustration when story changes
  useEffect(() => {
    if (storyText && enabled && !illustration) {
      generateIllustration();
    }
  }, [storyText, storyGenre, enabled]);
  
  if (!enabled || !storyText) return null;
  
  return (
    <div className="relative space-y-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-primary" />
          Story Illustration
        </h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={generateIllustration}
          disabled={loading || !storyText}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : 'Regenerate'}
        </Button>
      </div>
      
      <Card className="overflow-hidden w-full aspect-video bg-background/50 relative">
        {illustration ? (
          <div className="relative w-full h-full">
            <img
              src={illustration}
              alt="Story illustration"
              className="w-full h-full object-cover"
              onError={() => setError("Failed to load illustration")}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
              <p className="text-xs font-medium">AI-Generated Illustration</p>
              <p className="text-xs opacity-80 line-clamp-1">Based on your story's theme and content</p>
            </div>
          </div>
        ) : loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-muted-foreground">Creating illustration...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            {error}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No illustration generated yet
          </div>
        )}
      </Card>
      
      <p className="text-xs text-muted-foreground">
        This demo uses placeholder images instead of actual AI generation.
        In a production app, this would connect to Stable Diffusion or another image generation API.
      </p>
    </div>
  );
}
