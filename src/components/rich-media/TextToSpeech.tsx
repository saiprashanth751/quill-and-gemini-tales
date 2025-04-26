
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
  SkipForward, 
  SkipBack, 
  Headphones,
  Volume2,
  VolumeX 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

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
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  
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
        if (availableVoices.length === 0) return;
        
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
    } else {
      toast.error("Text-to-speech is not supported in your browser");
    }
  }, []);
  
  // Split text into sentences when text changes
  useEffect(() => {
    if (!text) {
      setSentences([]);
      return;
    }
    
    // Simple sentence splitting (could be improved)
    const sentenceArray = text
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter(s => s.trim().length > 0);
      
    setSentences(sentenceArray);
    setCurrentSentence(0);
    
    // Stop any current speech
    if (synth.current?.speaking) {
      synth.current.cancel();
      setPlaying(false);
    }
  }, [text]);
  
  // Create utterance for current sentence
  useEffect(() => {
    if (!sentences.length || currentSentence >= sentences.length) return;
    
    const currentText = sentences[currentSentence];
    
    if (!currentText || !synth.current) return;
    
    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(currentText);
    utteranceRef.current.rate = rate;
    utteranceRef.current.volume = muted ? 0 : volume;
    
    // Set voice if selected
    if (currentVoice !== "default" && voices.length > 0) {
      const selectedVoice = synth.current.getVoices().find(v => v.voiceURI === currentVoice);
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
    }
    
    // Handle speech end - move to next sentence
    utteranceRef.current.onend = () => {
      if (currentSentence < sentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    };
    
    utteranceRef.current.onerror = () => {
      toast.error("Speech synthesis error");
      setPlaying(false);
    };
    
    // If we're playing, speak this sentence
    if (playing) {
      synth.current.speak(utteranceRef.current);
    }
  }, [currentSentence, sentences, playing, currentVoice, rate, volume, muted]);
  
  const togglePlayback = () => {
    if (!synth.current || !sentences.length) return;
    
    if (playing) {
      synth.current.cancel();
      setPlaying(false);
    } else {
      // Create utterance if needed (should be created in useEffect)
      if (!utteranceRef.current && sentences[currentSentence]) {
        utteranceRef.current = new SpeechSynthesisUtterance(sentences[currentSentence]);
        utteranceRef.current.rate = rate;
        utteranceRef.current.volume = muted ? 0 : volume;
        
        if (currentVoice !== "default" && voices.length > 0) {
          const selectedVoice = synth.current.getVoices().find(v => v.voiceURI === currentVoice);
          if (selectedVoice) {
            utteranceRef.current.voice = selectedVoice;
          }
        }
        
        utteranceRef.current.onend = () => {
          if (currentSentence < sentences.length - 1) {
            setCurrentSentence(prev => prev + 1);
          } else {
            setPlaying(false);
          }
        };
      }
      
      if (utteranceRef.current) {
        synth.current.speak(utteranceRef.current);
        setPlaying(true);
      }
    }
  };
  
  const handlePrevSentence = () => {
    if (!synth.current) return;
    
    synth.current.cancel();
    setCurrentSentence(prev => Math.max(0, prev - 1));
    setPlaying(false);
  };
  
  const handleNextSentence = () => {
    if (!synth.current) return;
    
    synth.current.cancel();
    setCurrentSentence(prev => Math.min(sentences.length - 1, prev + 1));
    setPlaying(false);
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
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (utteranceRef.current) {
      utteranceRef.current.volume = muted ? 0 : newVolume;
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
    
    if (utteranceRef.current) {
      utteranceRef.current.volume = !muted ? 0 : volume;
      
      // Update speech if already playing
      if (playing && synth.current) {
        synth.current.cancel();
        synth.current.speak(utteranceRef.current);
      }
    }
  };
  
  const handleVoiceChange = (voiceId: string) => {
    setCurrentVoice(voiceId);
    // Voice will be updated on the next utterance
  };
  
  if (!enabled || !text || sentences.length === 0) return null;
  
  return (
    <div className="bg-background/80 rounded-lg p-3 backdrop-blur-sm border border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Headphones className="h-4 w-4 text-primary" />
          Text to Speech
        </h3>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 rounded-full"
              onClick={handlePrevSentence}
              disabled={currentSentence <= 0 || playing}
            >
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <Button
              size="sm"
              variant={playing ? "default" : "outline"}
              className={cn(
                "w-10 h-8 p-0 rounded-full",
                playing && "text-primary-foreground bg-primary"
              )}
              onClick={togglePlayback}
              disabled={!sentences.length}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="sr-only">{playing ? "Pause" : "Play"}</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 rounded-full"
              onClick={handleNextSentence}
              disabled={currentSentence >= sentences.length - 1 || playing}
            >
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {currentSentence + 1}/{sentences.length}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
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
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 rounded-full"
              onClick={toggleMute}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="sr-only">{muted ? "Unmute" : "Mute"}</span>
            </Button>
            
            <Slider
              className="w-24"
              min={0.1}
              max={1}
              step={0.1}
              value={[volume]}
              onValueChange={handleVolumeChange}
            />
            <span className="text-xs w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
      
      {/* Show current sentence being read */}
      <div className="mt-2 text-sm p-2 bg-muted/20 rounded border border-border/20">
        <p className="italic">
          {sentences[currentSentence] || "Ready to read your story..."}
        </p>
      </div>
    </div>
  );
}
