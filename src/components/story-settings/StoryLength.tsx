
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StoryLengthProps {
  value: string;
  onChange: (value: string) => void;
}

export function StoryLength({ value, onChange }: StoryLengthProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Story Length</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { value: "short", label: "Short", words: "~1000 words" },
          { value: "medium", label: "Medium", words: "~2500 words" },
          { value: "long", label: "Long", words: "~5000 words" },
        ].map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className="cursor-pointer"
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
            />
            <div className="rounded-lg border-2 border-muted p-3 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all h-full flex flex-col justify-center items-center">
              <div className="font-semibold text-base">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.words}</div>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
