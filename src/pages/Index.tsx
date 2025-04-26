
import { useState } from "react";
import { generateStory, StoryParams, GenerationResponse } from "@/api/geminiApi";
import { toast } from "@/components/ui/sonner";

import Header from "@/components/Header";
import StoryForm from "@/components/StoryForm";
import StoryOutput from "@/components/StoryOutput";

const Index = () => {
  const [story, setStory] = useState<string | null>(null);
  const [storyParams, setStoryParams] = useState<StoryParams | null>(null);
  const [loading, setLoading] = useState(false);

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
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Story Form */}
          <div className="lg:col-span-2 lg:sticky lg:top-8 h-fit">
            <StoryForm onSubmit={handleGenerateStory} loading={loading} />
          </div>
          
          {/* Story Output */}
          <div className="lg:col-span-3 h-[calc(100vh-160px)]">
            <StoryOutput 
              story={story} 
              loading={loading} 
              storyParams={storyParams || {}} 
            />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border/20 bg-gradient-to-r from-card via-background to-card">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Powered by Google Gemini API & React</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
