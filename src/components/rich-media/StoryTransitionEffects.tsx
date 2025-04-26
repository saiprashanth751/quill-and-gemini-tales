
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StoryTransitionEffectsProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

export function StoryTransitionEffects({ enabled = true, onChange }: StoryTransitionEffectsProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);
  
  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (onChange) {
      onChange(checked);
    }
    
    // Add or remove transition classes from the story container
    const storyContainer = document.querySelector(".story-content");
    if (storyContainer) {
      if (checked) {
        storyContainer.classList.add("story-transitions-enabled");
      } else {
        storyContainer.classList.remove("story-transitions-enabled");
      }
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="transitions" 
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="transitions" className="text-sm cursor-pointer">
        Animation Effects
      </Label>
    </div>
  );
}
