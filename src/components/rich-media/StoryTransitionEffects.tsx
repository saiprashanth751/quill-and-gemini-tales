
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";

interface StoryTransitionEffectsProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

export function StoryTransitionEffects({ enabled = true, onChange }: StoryTransitionEffectsProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
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
        // Re-trigger animations by removing and adding animated class
        const paragraphs = storyContainer.querySelectorAll("p");
        paragraphs.forEach((p, index) => {
          p.classList.remove("animated");
          setTimeout(() => {
            p.classList.add("animated");
          }, 50 * index);
        });
        toast.success("Animations enabled");
      } else {
        storyContainer.classList.remove("story-transitions-enabled");
        // Make all paragraphs visible immediately
        const paragraphs = storyContainer.querySelectorAll("p");
        paragraphs.forEach(p => {
          p.classList.add("animated");
        });
        toast.success("Animations disabled");
      }
    }
  };
  
  const handleSpeedChange = (value: number[]) => {
    const speed = value[0];
    setAnimationSpeed(speed);
    
    // Update animation speed via CSS variables
    document.documentElement.style.setProperty('--story-animation-speed', `${1 / speed}s`);
    
    // Re-trigger animations to apply new speed
    if (isEnabled) {
      const storyContainer = document.querySelector(".story-content");
      if (storyContainer) {
        const paragraphs = storyContainer.querySelectorAll("p");
        paragraphs.forEach((p, index) => {
          p.classList.remove("animated");
          setTimeout(() => {
            p.classList.add("animated");
          }, 50 * index);
        });
      }
    }
  };
  
  return (
    <div className="space-y-4">
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
      
      <div className={cn("space-y-2", !isEnabled && "opacity-50")}>
        <div className="flex items-center justify-between">
          <Label htmlFor="animation-speed" className="text-sm">Animation Speed</Label>
          <span className="text-xs text-muted-foreground">{animationSpeed.toFixed(1)}x</span>
        </div>
        <Slider
          id="animation-speed"
          min={0.5}
          max={2}
          step={0.1}
          value={[animationSpeed]}
          onValueChange={handleSpeedChange}
          disabled={!isEnabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slower</span>
          <span>Faster</span>
        </div>
      </div>
    </div>
  );
}
