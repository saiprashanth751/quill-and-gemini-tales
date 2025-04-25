
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudSun, ThermometerSun, CloudMoonRain, Sun } from "lucide-react";

interface StoryMoodProps {
  value: string;
  onChange: (value: string) => void;
}

export function StoryMood({ value, onChange }: StoryMoodProps) {
  const moods = [
    { value: "happy", label: "Happy", icon: Sun },
    { value: "mysterious", label: "Mysterious", icon: CloudMoonRain },
    { value: "humorous", label: "Humorous", icon: CloudSun },
    { value: "sad", label: "Melancholic", icon: ThermometerSun },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="mood" className="text-sm font-medium">Story Mood</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="mood" className="w-full bg-background/50">
          <SelectValue placeholder="Select mood" />
        </SelectTrigger>
        <SelectContent>
          {moods.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
