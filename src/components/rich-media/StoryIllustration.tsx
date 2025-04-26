
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Image } from "lucide-react";

interface StoryIllustrationProps {
  storyText: string | null;
  storyGenre: string;
  enabled?: boolean;
}

export function StoryIllustration({ storyText, storyGenre, enabled = true }: StoryIllustrationProps) {
  const [illustration, setIllustration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll use placeholder images based on genre
  // In a real implementation, this would call an AI image generation API
  const generateIllustration = () => {
    if (!storyText || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    // Mock API call with timeout to simulate AI image generation
    setTimeout(() => {
      try {
        // Map of genre to placeholder images (in a real app, this would be AI-generated)
        const genreImageMap: Record<string, string> = {
          fantasy: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
          "sci-fi": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
          mystery: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
          horror: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
          adventure: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
          romance: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          erotic: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
        };
        
        // Get image for genre or use default
        const imageUrl = genreImageMap[storyGenre.toLowerCase()] || 
          "https://images.unsplash.com/photo-1500673922987-e212871fec22";
        
        setIllustration(`${imageUrl}?w=800&auto=format&fit=crop`);
        setLoading(false);
      } catch (err) {
        setError("Failed to generate illustration");
        setLoading(false);
        console.error("Illustration generation failed:", err);
      }
    }, 1500); // Simulate API delay
  };
  
  // Generate illustration when story changes
  useEffect(() => {
    if (storyText && enabled) {
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
          <Image className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      </div>
      
      <Card className="overflow-hidden w-full aspect-video bg-background/50 relative">
        {illustration ? (
          <img
            src={illustration}
            alt="Story illustration"
            className="w-full h-full object-cover"
            onError={() => setError("Failed to load illustration")}
          />
        ) : loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="sr-only">Loading...</span>
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
    </div>
  );
}
