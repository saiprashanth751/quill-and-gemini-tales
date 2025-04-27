
import { useState } from "react";
import { generateStory, StoryParams } from "@/api/geminiApi";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import Header from "@/components/Header";
import StoryForm from "@/components/StoryForm";
import StoryOutput from "@/components/StoryOutput";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [story, setStory] = useState<string | null>(null);
  const [storyParams, setStoryParams] = useState<StoryParams | null>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleGenerateStory = async (params: StoryParams) => {
    setLoading(true);
    
    try {
      const response = await generateStory(params);
      setStory(response.story);
      setStoryParams(params); // Store the parameters that generated this story
      
      // Show success notification
      toast.success("Your tale has been crafted!");
    } catch (error) {
      console.error("Story generation failed:", error);
      // Error message is shown in geminiApi.ts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-background via-background to-background/95">
      <Header />
      
      <main className="flex-1 container py-4 md:py-6 lg:py-8">
        <div className={cn(
          "grid gap-4 md:gap-6 lg:gap-8",
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"
        )}>
          {/* Story Form */}
          <div className={cn(
            isMobile ? "" : "lg:col-span-2 lg:sticky lg:top-8 h-fit"
          )}>
            <StoryForm onSubmit={handleGenerateStory} loading={loading} />
          </div>
          
          {/* Story Output */}
          <div className={cn(
            isMobile ? "h-[calc(100vh-160px)]" : "lg:col-span-3 h-[calc(100vh-160px)]"
          )}>
            <StoryOutput 
              story={story} 
              loading={loading} 
              storyParams={storyParams || {
                genre: "",
                plot: "",
                perspective: "",
                characters: "",
                setting: "",
                format: "",
                length: "",
                mood: "",
                period: "",
                atmosphere: "",
              }} 
            />
          </div>
        </div>
      </main>
      
      <footer className="py-4 md:py-6 border-t border-border/20 bg-gradient-to-r from-card via-background to-card">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Powered by Google Gemini API & React</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
