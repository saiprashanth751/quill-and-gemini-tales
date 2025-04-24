
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryOutputProps {
  story: string | null;
  loading: boolean;
}

export default function StoryOutput({ story, loading }: StoryOutputProps) {
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

  return (
    <Card className="h-full flex flex-col relative overflow-hidden border border-border/30 shadow-md dark:shadow-none">
      <div className="flex items-center p-5 border-b border-border/20">
        <Book className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Your Tale</h2>
      </div>
      
      <div className="flex-1 overflow-hidden bg-card relative">
        {/* Background pattern for the parchment look */}
        <div className="absolute inset-0 bg-parchment-texture opacity-30 pointer-events-none" />
        
        {/* Content container */}
        <div className="h-full overflow-y-auto p-6 relative z-10 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-primary rounded-full animate-spin" />
                <div className="absolute top-1 left-1 right-1 bottom-1 border-r-2 border-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
            </div>
          ) : storyLines.length > 0 ? (
            <div className="space-y-4 leading-relaxed animate-fade-in">
              {storyLines.map((line, index) => {
                // Check if this is a dialogue line
                const isDialogueLine = line.includes(':');
                
                return (
                  <p 
                    key={index}
                    className={cn(
                      "text-foreground transition-all duration-500",
                      // Add styling for dialogue lines
                      isDialogueLine ? "font-medium" : "",
                      // First line gets special styling
                      index === 0 ? "first-letter:text-2xl first-letter:font-bold" : ""
                    )}
                    // Add a small delay to each paragraph for a typing effect
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                  <Book className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-center">
                    Your tale will appear here once generated...
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Fill out the form and click "Generate Story" to begin
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
