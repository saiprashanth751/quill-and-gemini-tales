
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand } from "lucide-react";
import PromptGenerator from "./PromptGenerator";
import CharacterGenerator from "./CharacterGenerator";
import ItemGenerator from "./ItemGenerator";
import LocationGenerator from "./LocationGenerator";
import { toast } from "@/components/ui/sonner";

export default function GeneratorsPanel() {
  return (
    <Card className="bg-card/80 backdrop-blur p-4 border border-border/30">
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="prompt">Prompts</TabsTrigger>
          <TabsTrigger value="character">Characters</TabsTrigger>
          <TabsTrigger value="item">Items</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="mt-0">
          <PromptGenerator />
        </TabsContent>
        
        <TabsContent value="character" className="mt-0">
          <CharacterGenerator />
        </TabsContent>
        
        <TabsContent value="item" className="mt-0">
          <ItemGenerator />
        </TabsContent>
        
        <TabsContent value="location" className="mt-0">
          <LocationGenerator />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
