
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const ITEMS = {
  weapon: {
    prefixes: ["Ancient", "Mystical", "Cursed", "Blessed", "Legendary"],
    items: ["Sword", "Bow", "Staff", "Dagger", "Axe"],
    suffixes: ["of Power", "of Truth", "of Light", "of Shadows", "of Time"],
  },
  magical: {
    prefixes: ["Enchanted", "Ethereal", "Celestial", "Arcane", "Divine"],
    items: ["Ring", "Amulet", "Crystal", "Orb", "Pendant"],
    suffixes: ["of Wisdom", "of Dreams", "of Fortune", "of Life", "of Magic"],
  }
};

export default function ItemGenerator() {
  const [type, setType] = useState<keyof typeof ITEMS>("weapon");
  const [item, setItem] = useState<string>("");

  const generateItem = () => {
    const { prefixes, items, suffixes } = ITEMS[type];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseItem = items[Math.floor(Math.random() * items.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    setItem(`${prefix} ${baseItem} ${suffix}`);
    toast.success("New magical item generated!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={type} onValueChange={(value: keyof typeof ITEMS) => setType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select item type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weapon">Weapon</SelectItem>
            <SelectItem value="magical">Magical Item</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={generateItem} className="ml-auto">
          <Wand className="w-4 h-4 mr-2" />
          Generate Item
        </Button>
      </div>
      
      {item && (
        <div className="bg-muted/50 p-4 rounded-lg border border-border/30">
          <p className="text-sm">{item}</p>
        </div>
      )}
    </div>
  );
}
