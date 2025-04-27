
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BackgroundMusic } from "./BackgroundMusic";
import { TextToSpeech } from "./TextToSpeech";
import { Book, Headphones } from "lucide-react";
import { StoryParams } from "@/api/geminiApi";
import { cn } from "@/lib/utils";

interface MediaControlsProps {
  storyText: string | null;
  storyParams: StoryParams;
}

export function MediaControls({ storyText, storyParams }: MediaControlsProps) {
  const [musicEnabled, setMusicEnabled] = useState(false);
  
  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <Tabs defaultValue="read" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="read" className="flex items-center gap-2">
            <Book className="h-4 w-4" /> Read
          </TabsTrigger>
          <TabsTrigger value="listen" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" /> Listen
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="read" className="space-y-4 min-h-[100px]">
          <div className="p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-border/40">
            <p className="text-sm text-muted-foreground mb-2">
              Scroll through your story above. You can enable background music to enhance your reading experience.
            </p>
            
            <BackgroundMusic 
              genre={storyParams.genre as any}
              isPlaying={musicEnabled}
              onToggleMusic={(playing) => setMusicEnabled(playing)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="listen" className="space-y-4 min-h-[180px]">
          <div className="grid grid-cols-1 gap-4">
            <TextToSpeech 
              text={storyText} 
              enabled={!!storyText}
            />
            
            <div className={cn(
              "p-4 bg-background/80 rounded-lg backdrop-blur-sm border border-border/40",
              "transition-opacity duration-300",
              musicEnabled ? "opacity-100" : "opacity-80"
            )}>
              <BackgroundMusic 
                genre={storyParams.genre as any}
                isPlaying={musicEnabled}
                onToggleMusic={(playing) => setMusicEnabled(playing)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
