
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CloudSun, ThermometerSun, ThermometerSnowflake, CloudMoonRain } from "lucide-react";

interface StoryAtmosphereProps {
  value: string;
  onChange: (value: string) => void;
}

export function StoryAtmosphere({ value, onChange }: StoryAtmosphereProps) {
  const atmospheres = [
    { value: "summer", label: "Summer", icon: ThermometerSun },
    { value: "winter", label: "Winter", icon: ThermometerSnowflake },
    { value: "rainy", label: "Rainy", icon: CloudMoonRain },
    { value: "sunny", label: "Sunny", icon: CloudSun },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Weather & Season</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onChange}
        className="justify-start gap-4"
      >
        {atmospheres.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={label}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
