
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StoryPeriodProps {
  value: string;
  onChange: (value: string) => void;
}

export function StoryPeriod({ value, onChange }: StoryPeriodProps) {
  const periods = [
    { value: "ancient", label: "Ancient (Before 500 AD)" },
    { value: "medieval", label: "Medieval (500-1500 AD)" },
    { value: "renaissance", label: "Renaissance (1300-1600)" },
    { value: "victorian", label: "Victorian (1837-1901)" },
    { value: "modern", label: "Modern (Present Day)" },
    { value: "near-future", label: "Near Future (Next 50 years)" },
    { value: "far-future", label: "Far Future (100+ years)" },
    { value: "post-apocalyptic", label: "Post-Apocalyptic" },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="period" className="text-sm font-medium">Time Period</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="period" className="w-full bg-background/50">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
