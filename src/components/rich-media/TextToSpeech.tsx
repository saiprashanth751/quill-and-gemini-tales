
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Headphones 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TextToSpeechProps {
  text: string | null;
  enabled?: boolean;
}

interface VoiceOption {
  id: string;
  name: string;
  gender?: string;
}

export function TextToSpeech({ text, enabled = true }: TextToSpeechProps) {
  const [playing, setPlaying] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string>("default");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  
  // Refs
  const synth = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synth.current = window.speechSynthesis;
      
      // Get available voices (may be async)
      const getVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        const voiceOptions = availableVoices.map(voice => ({
          id: voice.voiceURI,
          name: `${voice.name} (${voice.lang})`,
          gender: voice.name.includes('Female') ? 'female' : 'male'
        }));
        
        setVoices(voiceOptions);
      };
      
      // Some browsers load voices asynchronously
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = getVoices;
      }
      
      getVoices();
      
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel();
        }
      };
    }
  }, []);
  
  // Update utterance when text changes
  useEffect(() => {
    if (!text || !synth.current) return;
    
    // Stop any current speech
    if (synth.current.speaking) {
      synth.current.cancel();
      setPlaying(false);
    }
    
    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = rate;
    
    // Set voice if selected
    if (currentVoice !== "default" && voices.length > 0) {
      const selectedVoice = synth.current.getVoices().find(v => v.voiceURI === currentVoice);
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
    }
    
    // Handle speech end
    utteranceRef.current.onend = () => setPlaying(false);
    utteranceRef.current.onerror = () => setPlaying(false);
  }, [text, currentVoice, rate]);
  
  const togglePlayback = () => {
    if (!synth.current || !utteranceRef.current || !text) return;
    
    if (playing) {
      synth.current.cancel();
      setPlaying(false);
    } else {
      synth.current.speak(utteranceRef.current);
      setPlaying(true);
    }
  };
  
  const handleRateChange = (value: number[]) => {
    const newRate = value[0];
    setRate(newRate);
    
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
      
      // Update speech if already playing
      if (playing && synth.current) {
        synth.current.cancel();
        synth.current.speak(utteranceRef.current);
      }
    }
  };
  
  const handleVoiceChange = (voiceId: string) => {
    setCurrentVoice(voiceId);
  };
  
  if (!enabled || !text) return null;
  
  return (
    <div className="bg-background/80 rounded-lg p-3 backdrop-blur-sm border border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Headphones className="h-4 w-4 text-primary" />
          Text to Speech
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "w-8 h-8 p-0 rounded-full",
              playing && "text-primary border-primary"
            )}
            onClick={togglePlayback}
            disabled={!text || voices.length === 0}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        
        <Select value={currentVoice} onValueChange={handleVoiceChange}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Voice</SelectItem>
            {voices.map(voice => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <Slider
            className="w-24"
            min={0.5}
            max={2}
            step={0.1}
            value={[rate]}
            onValueChange={handleRateChange}
          />
          <span className="text-xs w-8">{rate.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
