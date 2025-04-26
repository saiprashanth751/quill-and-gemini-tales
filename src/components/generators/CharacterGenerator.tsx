
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const CHARACTER_DATA = {
  western: {
    firstNames: ["James", "Emma", "William", "Olivia", "Alexander"],
    lastNames: ["Smith", "Johnson", "Williams", "Brown", "Davis"],
  },
  eastern: {
    firstNames: ["Hiroshi", "Yuki", "Chen", "Ming", "Ji-eun"],
    lastNames: ["Tanaka", "Kim", "Wang", "Liu", "Zhang"],
  },
  fantasy: {
    firstNames: ["Aethel", "Thorne", "Sylvar", "Mystic", "Raven"],
    lastNames: ["Brightstar", "Shadowweave", "Moonwhisper", "Stormborn", "Frostwind"],
  },
};

export default function CharacterGenerator() {
  const [culture, setCulture] = useState<keyof typeof CHARACTER_DATA>("western");
  const [characterName, setCharacterName] = useState<string>("");

  const generateName = () => {
    const { firstNames, lastNames } = CHARACTER_DATA[culture];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    setCharacterName(`${firstName} ${lastName}`);
    toast.success("New character name generated!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={culture} onValueChange={(value: keyof typeof CHARACTER_DATA) => setCulture(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select culture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="western">Western</SelectItem>
            <SelectItem value="eastern">Eastern</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={generateName} className="ml-auto">
          <Wand className="w-4 h-4 mr-2" />
          Generate Name
        </Button>
      </div>
      
      {characterName && (
        <div className="bg-muted/50 p-4 rounded-lg border border-border/30">
          <p className="text-sm">{characterName}</p>
        </div>
      )}
    </div>
  );
}
