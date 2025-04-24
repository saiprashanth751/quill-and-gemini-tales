
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { StoryParams } from "@/api/geminiApi";
import { Loader } from "lucide-react";

interface StoryFormProps {
  onSubmit: (params: StoryParams) => void;
  loading: boolean;
}

export default function StoryForm({ onSubmit, loading }: StoryFormProps) {
  const [formData, setFormData] = useState<StoryParams>({
    genre: "fantasy",
    plot: "",
    perspective: "third-person",
    characters: "",
    setting: "",
    format: "narrative"
  });

  const handleChange = (field: keyof StoryParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.plot.trim().length > 10;

  return (
    <Card className="bg-card border border-border/30 shadow-md dark:shadow-none">
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Craft Your Tale</h2>
          <p className="text-sm text-muted-foreground">Fill the details below to generate your story</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Genre Selection */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium">
              Genre
            </Label>
            <Select 
              value={formData.genre}
              onValueChange={(value) => handleChange("genre", value)}
            >
              <SelectTrigger id="genre" className="w-full bg-background/50 border-border/40 focus:ring-ring/40">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="sci-fi">Science Fiction</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Perspective Selection */}
          <div className="space-y-2">
            <Label htmlFor="perspective" className="text-sm font-medium">
              Perspective
            </Label>
            <Select 
              value={formData.perspective}
              onValueChange={(value) => handleChange("perspective", value)}
            >
              <SelectTrigger id="perspective" className="w-full bg-background/50 border-border/40 focus:ring-ring/40">
                <SelectValue placeholder="Select perspective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first-person">First Person</SelectItem>
                <SelectItem value="second-person">Second Person</SelectItem>
                <SelectItem value="third-person">Third Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium">
              Story Format
            </Label>
            <Select 
              value={formData.format}
              onValueChange={(value) => handleChange("format", value)}
            >
              <SelectTrigger id="format" className="w-full bg-background/50 border-border/40 focus:ring-ring/40">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrative">Narrative</SelectItem>
                <SelectItem value="dialogue">Dialogue Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Plot */}
        <div className="space-y-2">
          <Label htmlFor="plot" className="text-sm font-medium">
            Main Plot <span className="text-muted-foreground">(required)</span>
          </Label>
          <Textarea
            id="plot"
            placeholder="Describe the main plot of your story..."
            value={formData.plot}
            onChange={(e) => handleChange("plot", e.target.value)}
            className="min-h-[80px] resize-none bg-background/50 border-border/40 focus:ring-ring/40"
          />
        </div>
        
        {/* Characters */}
        <div className="space-y-2">
          <Label htmlFor="characters" className="text-sm font-medium">
            Characters <span className="text-muted-foreground">(comma separated)</span>
          </Label>
          <Textarea
            id="characters"
            placeholder="e.g., John (brave knight), Sarah (wise mage)"
            value={formData.characters}
            onChange={(e) => handleChange("characters", e.target.value)}
            className="min-h-[60px] resize-none bg-background/50 border-border/40 focus:ring-ring/40"
          />
        </div>
        
        {/* Setting */}
        <div className="space-y-2">
          <Label htmlFor="setting" className="text-sm font-medium">
            Setting Description
          </Label>
          <Textarea
            id="setting"
            placeholder="Describe the world or environment..."
            value={formData.setting}
            onChange={(e) => handleChange("setting", e.target.value)}
            className="min-h-[60px] resize-none bg-background/50 border-border/40 focus:ring-ring/40"
          />
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading || !isFormValid}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Crafting Your Tale...
            </>
          ) : (
            "Generate Story"
          )}
        </Button>
      </form>
    </Card>
  );
}
