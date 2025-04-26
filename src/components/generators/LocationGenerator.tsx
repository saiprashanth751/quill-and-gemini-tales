
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const LOCATIONS = {
  fantasy: {
    names: ["Crystal", "Shadow", "Mystic", "Ancient", "Enchanted"],
    places: ["Castle", "Forest", "Cave", "Temple", "Tower"],
    features: ["with floating islands", "shrouded in mist", "of eternal twilight", "guarded by dragons", "lost in time"],
  },
  scifi: {
    names: ["Nova", "Quantum", "Stellar", "Cyber", "Neo"],
    places: ["Station", "Colony", "Port", "Base", "Hub"],
    features: ["in the asteroid belt", "on a dying star", "beyond the nebula", "in deep space", "under the ice moon"],
  },
};

export default function LocationGenerator() {
  const [genre, setGenre] = useState<keyof typeof LOCATIONS>("fantasy");
  const [location, setLocation] = useState<string>("");

  const generateLocation = () => {
    const { names, places, features } = LOCATIONS[genre];
    const name = names[Math.floor(Math.random() * names.length)];
    const place = places[Math.floor(Math.random() * places.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    setLocation(`The ${name} ${place} ${feature}`);
    toast.success("New location generated!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={genre} onValueChange={(value: keyof typeof LOCATIONS) => setGenre(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fantasy">Fantasy</SelectItem>
            <SelectItem value="scifi">Sci-Fi</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={generateLocation} className="ml-auto">
          <Wand className="w-4 h-4 mr-2" />
          Generate Location
        </Button>
      </div>
      
      {location && (
        <div className="bg-muted/50 p-4 rounded-lg border border-border/30">
          <p className="text-sm">{location}</p>
        </div>
      )}
    </div>
  );
}
