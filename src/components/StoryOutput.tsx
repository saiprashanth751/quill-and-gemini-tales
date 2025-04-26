
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaControls } from "./rich-media/MediaControls";
import { StoryParams } from "@/api/geminiApi";
import "../styles/animations.css";

interface StoryOutputProps {
  story: string | null;
  loading: boolean;
  storyParams?: StoryParams;
}

export default function StoryOutput({ story, loading, storyParams = {} as StoryParams }: StoryOutputProps) {
  const [animationsReady, setAnimationsReady] = useState(false);
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  const storyContentRef = useRef<HTMLDivElement>(null);
  
  const formatStoryContent = (content: string | null) => {
    if (!content) return [];
    // Split by newlines and filter out empty lines
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const storyLines = formatStoryContent(story);
  const isDialogue = story ? story.includes(':') && story.split('\n').some(line => line.includes(':')) : false;

  // Initialize animations when content is loaded
  useEffect(() => {
    if (story && storyContentRef.current) {
      // Reset animation state
      setAnimationsReady(false);
      setHighlightedParagraph(null);
      
      // Add base class for transitions
      storyContentRef.current.classList.add("story-transitions-enabled");
      
      // Delay to ensure content is rendered
      setTimeout(() => {
        // Get all paragraph elements
        const paragraphs = storyContentRef.current?.querySelectorAll("p");
        
        // Mark paragraphs as animated to trigger transitions
        if (paragraphs) {
          paragraphs.forEach((p, index) => {
            // Mark dialogue lines
            if (p.textContent?.includes(":")) {
              p.classList.add("dialogue-line");
            }
            
            // Add animated class with slight delay
            setTimeout(() => {
              p.classList.add("animated");
            }, 50 * index);
          });
        }
        
        setAnimationsReady(true);
      }, 100);
    }
  }, [story]);

  // Update highlighted paragraph when text-to-speech is playing
  // This would be connected to TextToSpeech component in a real implementation
  // For demo, we'll simulate with a useEffect
  useEffect(() => {
    if (!story || !animationsReady) return;
    
    // Listen for custom events from TextToSpeech component
    const handleSpeechEvent = (e: CustomEvent) => {
      setHighlightedParagraph(e.detail.paragraphIndex);
    };
    
    window.addEventListener('speech-paragraph-change' as any, handleSpeechEvent as any);
    
    return () => {
      window.removeEventListener('speech-paragraph-change' as any, handleSpeechEvent as any);
    };
  }, [story, animationsReady]);

  return (
    <Card className="h-full flex flex-col relative overflow-hidden border-2 border-primary/20 shadow-xl dark:shadow-primary/10 bg-gradient-to-br from-card to-background/80">
      <div className="flex items-center p-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-background/0">
        <Book className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground font-decorative">Your Tale</h2>
      </div>
      
      <div className="flex-1 overflow-hidden bg-card/80 relative">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-28 h-28 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Background pattern for the parchment look */}
        <div className="absolute inset-0 bg-parchment-texture opacity-40 pointer-events-none" />
        
        {/* Content container */}
        <div className="h-full overflow-y-auto p-4 md:p-6 relative z-10 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-primary rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 right-2 bottom-2 border-r-2 border-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute top-4 left-4 right-4 bottom-4 border-b-2 border-primary/70 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              </div>
              <p className="mt-6 text-center text-muted-foreground animate-pulse">Weaving words into wonder...</p>
            </div>
          ) : storyLines.length > 0 ? (
            <div className="space-y-4 leading-relaxed story-content" ref={storyContentRef}>
              {storyLines.map((line, index) => {
                // Check if this is a dialogue line
                const isDialogueLine = line.includes(':');
                
                return (
                  <p 
                    key={index}
                    className={cn(
                      "text-foreground transition-all duration-500 p-1",
                      // Add styling for dialogue lines
                      isDialogueLine ? "font-medium pl-4 border-l-2 border-primary/40" : "",
                      // First line gets special styling
                      index === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-1" : "",
                      // Highlight paragraph being read
                      highlightedParagraph === index ? "reading" : ""
                    )}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6 max-w-md">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Book className="h-10 w-10 text-primary/70" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary/80 font-decorative">
                    Your tale awaits...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fill out the form and click "Generate Story" to begin your literary journey
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Media controls appear only when a story is generated */}
      {story && (
        <div className="border-t border-border/30 p-3">
          <MediaControls 
            storyText={story} 
            storyParams={storyParams}
          />
        </div>
      )}
    </Card>
  );
}
