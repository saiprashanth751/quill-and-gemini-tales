import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { StoryParams } from "@/api/geminiApi";
import { Loader, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceInput from "./VoiceInput";
import ImageUpload from "./ImageUpload";
import { StoryLength } from "./story-settings/StoryLength";
import { StoryMood } from "./story-settings/StoryMood";
import { StoryPeriod } from "./story-settings/StoryPeriod";
import { StoryAtmosphere } from "./story-settings/StoryAtmosphere";

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
    format: "narrative",
    length: "medium",
    mood: "happy",
    period: "modern",
    atmosphere: "sunny",
  });
  
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");

  const handleChange = (field: keyof StoryParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "image" && imageBase64) {
      onSubmit({ ...formData, imageBase64 });
    } else {
      onSubmit(formData);
    }
  };

  const handleTranscriptReady = (transcript: string) => {
    handleChange("plot", transcript);
  };

  const handleImageChange = (base64: string | null) => {
    setImageBase64(base64);
  };

  const isTextFormValid = formData.plot.trim().length > 10;
  const isImageFormValid = imageBase64 !== null;
  const isFormValid = 
    (activeTab === "text" && isTextFormValid) || 
    (activeTab === "image" && isImageFormValid);

  return (
    <Card className="bg-card border border-border/30 shadow-md dark:shadow-none backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground font-decorative">Craft Your Tale</h2>
          <p className="text-sm text-muted-foreground">Choose how you want to create your story</p>
          
          <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="text">Text & Voice</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <VoiceInput onTranscriptReady={handleTranscriptReady} />
                
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
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload Image</Label>
                <ImageUpload onImageChange={handleImageChange} />
                <p className="text-xs text-muted-foreground mt-2">
                  The AI will generate a story based on the content of the image
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StoryLength 
              value={formData.length} 
              onChange={(value) => handleChange("length", value)} 
            />
            <StoryAtmosphere 
              value={formData.atmosphere} 
              onChange={(value) => handleChange("atmosphere", value)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StoryMood 
              value={formData.mood} 
              onChange={(value) => handleChange("mood", value)} 
            />
            <StoryPeriod 
              value={formData.period} 
              onChange={(value) => handleChange("period", value)} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="erotic">Erotic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Story
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
