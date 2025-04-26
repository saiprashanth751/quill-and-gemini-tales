
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BackgroundMusic } from "./BackgroundMusic";
import { StoryIllustration } from "./StoryIllustration";
import { TextToSpeech } from "./TextToSpeech";
import { StoryTransitionEffects } from "./StoryTransitionEffects";
import { StoryParams } from "@/api/geminiApi";

interface MediaControlsProps {
  storyText: string | null;
  storyParams: StoryParams;
}

export function MediaControls({ storyText, storyParams }: MediaControlsProps) {
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);
  
  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audio" className="space-y-4">
          <BackgroundMusic 
            genre={storyParams.genre as any}
            isPlaying={!!storyText}
          />
          
          <TextToSpeech 
            text={storyText} 
            enabled={!!storyText}
          />
        </TabsContent>
        
        <TabsContent value="visual" className="space-y-4">
          <StoryIllustration 
            storyText={storyText} 
            storyGenre={storyParams.genre}
            enabled={!!storyText}
          />
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-medium">Animation Settings</h3>
            <StoryTransitionEffects 
              enabled={transitionsEnabled}
              onChange={setTransitionsEnabled}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enable or disable animation effects for story transitions and paragraph reveals.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
