
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const PROMPT_TYPES = {
  adventure: [
    "A mysterious map leads to an unexpected discovery...",
    "During a routine journey, your character stumbles upon...",
    "An ancient artifact suddenly activates, causing...",
  ],
  mystery: [
    "A series of impossible coincidences points to...",
    "An old diary reveals a long-buried secret about...",
    "Strange symbols appear overnight in the town square...",
  ],
  fantasy: [
    "A spell goes wrong, transforming the protagonist into...",
    "A dragon's egg hatches in an unusual place...",
    "Magic suddenly stops working, except for...",
  ],
};

export default function PromptGenerator() {
  const [genre, setGenre] = useState<keyof typeof PROMPT_TYPES>("adventure");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  const generatePrompt = () => {
    const prompts = PROMPT_TYPES[genre];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    toast.success("New prompt generated!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={genre} onValueChange={(value: keyof typeof PROMPT_TYPES) => setGenre(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={generatePrompt} className="ml-auto">
          <Wand className="w-4 h-4 mr-2" />
          Generate Prompt
        </Button>
      </div>
      
      {currentPrompt && (
        <div className="bg-muted/50 p-4 rounded-lg border border-border/30">
          <p className="text-sm">{currentPrompt}</p>
        </div>
      )}
    </div>
  );
}
