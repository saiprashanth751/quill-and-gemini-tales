
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

type Genre = "fantasy" | "sci-fi" | "mystery" | "horror" | "adventure" | "romance" | "erotic";

interface BackgroundMusicProps {
  genre: Genre;
  isPlaying?: boolean;
  defaultVolume?: number;
}

// Demo audio URLs that actually work (replace with real audio files in production)
const musicMap: Record<Genre, string> = {
  "fantasy": "https://assets.mixkit.co/music/preview/mixkit-medieval-show-fanfare-announcement-226.mp3",
  "sci-fi": "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
  "mystery": "https://assets.mixkit.co/music/preview/mixkit-suspense-mystery-bass-685.mp3",
  "horror": "https://assets.mixkit.co/music/preview/mixkit-horror-suspense-atmosphere-2839.mp3",
  "adventure": "https://assets.mixkit.co/music/preview/mixkit-wild-west-atmosphere-2325.mp3",
  "romance": "https://assets.mixkit.co/music/preview/mixkit-piano-romantic-light-562.mp3",
  "erotic": "https://assets.mixkit.co/music/preview/mixkit-loungey-beat-220.mp3"
};

export function BackgroundMusic({ genre, isPlaying = false, defaultVolume = 0.5 }: BackgroundMusicProps) {
  const [playing, setPlaying] = useState(isPlaying);
  const [volume, setVolume] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(genre);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
      
      // Add error handling
      audioRef.current.onerror = (e) => {
        console.error("Audio error:", e);
        toast.error("Failed to load audio track");
        setPlaying(false);
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update audio source when genre changes
  useEffect(() => {
    if (genre !== currentGenre) {
      setCurrentGenre(genre);
      
      if (audioRef.current && musicMap[genre]) {
        const wasPlaying = playing && !muted;
        audioRef.current.src = musicMap[genre];
        audioRef.current.load();
        
        if (wasPlaying) {
          audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
            toast.error("Failed to play audio track");
            setPlaying(false);
          });
        }
      }
    }
  }, [genre, currentGenre, playing, muted]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (playing && !muted) {
      audioRef.current.volume = volume;
      audioRef.current.src = audioRef.current.src || musicMap[genre];
      
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          toast.error("Failed to play audio track");
          setPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing, muted, genre, volume]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const togglePlay = () => {
    if (!playing) {
      // Try to play and handle any autoplay restrictions
      if (audioRef.current) {
        audioRef.current.src = audioRef.current.src || musicMap[genre];
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch(e => {
            console.error("Audio playback failed:", e);
            toast.error("Playback failed. Click again or check browser autoplay settings.");
            setPlaying(false);
          });
      }
    } else {
      setPlaying(false);
    }
  };
  
  const toggleMute = () => setMuted(!muted);
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Update system volume indicator
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : newVolume;
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 bg-background/80 rounded-lg p-3 backdrop-blur-sm border border-border/40">
      <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
        <Music className="h-4 w-4 text-primary" />
        Background Music <span className="text-xs text-muted-foreground ml-1">({genre})</span>
      </h3>
      
      <div className="flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant={playing && !muted ? "default" : "outline"}
          className={cn(
            "h-8 px-3",
            playing && !muted ? "bg-primary text-primary-foreground" : ""
          )}
          onClick={togglePlay}
        >
          {playing && !muted ? "Playing" : "Play Music"}
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
          <span className="text-xs w-10">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
