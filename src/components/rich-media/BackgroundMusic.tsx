
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Genre = "fantasy" | "sci-fi" | "mystery" | "horror" | "adventure" | "romance" | "erotic";

interface BackgroundMusicProps {
  genre: Genre;
  isPlaying?: boolean;
  defaultVolume?: number;
}

const musicMap: Record<Genre, string> = {
  "fantasy": "/audio/fantasy-adventure.mp3",
  "sci-fi": "/audio/sci-fi-ambient.mp3",
  "mystery": "/audio/mystery-suspense.mp3",
  "horror": "/audio/horror-atmosphere.mp3",
  "adventure": "/audio/adventure-journey.mp3",
  "romance": "/audio/romantic-melody.mp3",
  "erotic": "/audio/smooth-jazz.mp3"
};

export function BackgroundMusic({ genre, isPlaying = false, defaultVolume = 0.5 }: BackgroundMusicProps) {
  const [playing, setPlaying] = useState(isPlaying);
  const [volume, setVolume] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount
  useEffect(() => {
    audioRef.current = new Audio(musicMap[genre]);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update audio source when genre changes
  useEffect(() => {
    if (audioRef.current && musicMap[genre]) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = musicMap[genre];
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
  }, [genre]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (playing && !muted) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing, muted]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const handleVolumeChange = (value: number[]) => setVolume(value[0]);
  
  return (
    <div className="flex items-center space-x-2 bg-background/80 rounded-lg p-3 backdrop-blur-sm border border-border/40">
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "w-8 h-8 p-0 rounded-full",
          playing && !muted ? "text-primary" : "text-muted-foreground"
        )}
        onClick={togglePlay}
      >
        <Music className="h-4 w-4" />
        <span className="sr-only">{playing ? "Pause" : "Play"} background music</span>
      </Button>
      
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
          className="w-24 md:w-32"
          defaultValue={[defaultVolume]}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
