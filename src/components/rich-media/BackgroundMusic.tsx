
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
  onToggleMusic?: (playing: boolean) => void;
}

// Audio files available locally for better reliability
const musicMap: Record<Genre, string> = {
  "fantasy": "/audio/fantasy.mp3",
  "sci-fi": "/audio/sci-fi.mp3",
  "mystery": "/audio/mystery.mp3",
  "horror": "/audio/horror.mp3",
  "adventure": "/audio/adventure.mp3",
  "romance": "/audio/romance.mp3",
  "erotic": "/audio/romance.mp3"  // Reusing romance for erotic
};

// Fallback to external tracks if local ones don't exist
const fallbackMusicMap: Record<Genre, string> = {
  "fantasy": "https://assets.mixkit.co/music/preview/mixkit-medieval-show-fanfare-announcement-226.mp3",
  "sci-fi": "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
  "mystery": "https://assets.mixkit.co/music/preview/mixkit-suspense-mystery-bass-685.mp3",
  "horror": "https://assets.mixkit.co/music/preview/mixkit-horror-suspense-atmosphere-2839.mp3",
  "adventure": "https://assets.mixkit.co/music/preview/mixkit-wild-west-atmosphere-2325.mp3",
  "romance": "https://assets.mixkit.co/music/preview/mixkit-piano-romantic-light-562.mp3",
  "erotic": "https://assets.mixkit.co/music/preview/mixkit-loungey-beat-220.mp3"
};

export function BackgroundMusic({ 
  genre, 
  isPlaying = false, 
  defaultVolume = 0.5,
  onToggleMusic 
}: BackgroundMusicProps) {
  const [playing, setPlaying] = useState(isPlaying);
  const [volume, setVolume] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(genre);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
      
      // Try loading the primary source first
      audioRef.current.src = musicMap[genre];
      
      // Handle errors by switching to fallback
      audioRef.current.onerror = () => {
        console.error("Audio error occurred with primary source, trying fallback");
        if (!usingFallback) {
          setUsingFallback(true);
          if (audioRef.current) {
            audioRef.current.src = fallbackMusicMap[genre];
            
            // If we were trying to play, retry with the fallback source
            if (playing) {
              audioRef.current.play().catch(e => {
                console.error("Fallback audio playback failed:", e);
                toast.error("Failed to play audio track");
                setPlaying(false);
                if (onToggleMusic) onToggleMusic(false);
              });
            }
          }
        } else {
          console.error("Both audio sources failed");
          toast.error("Failed to load audio track");
          setPlaying(false);
          if (onToggleMusic) onToggleMusic(false);
        }
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
      setUsingFallback(false);
      
      if (audioRef.current) {
        const wasPlaying = playing && !muted;
        
        // First try the primary source
        audioRef.current.src = musicMap[genre];
        audioRef.current.load();
        
        // Setup error handler for this specific load event
        const handleError = () => {
          console.error("Audio source error when changing genre, trying fallback");
          if (audioRef.current) {
            audioRef.current.src = fallbackMusicMap[genre];
            audioRef.current.load();
            
            if (wasPlaying) {
              audioRef.current.play().catch(e => {
                console.error("Audio playback failed on fallback:", e);
                toast.error("Failed to play audio track");
                setPlaying(false);
                if (onToggleMusic) onToggleMusic(false);
              });
            }
          }
          
          // Remove this specific error handler
          if (audioRef.current) {
            audioRef.current.removeEventListener('error', handleError);
          }
        };
        
        audioRef.current.addEventListener('error', handleError, { once: true });
        
        if (wasPlaying) {
          audioRef.current.play().catch(e => {
            // Error will be handled by the error event listener
            console.error("Initial playback failed when changing genre:", e);
          });
        }
      }
    }
  }, [genre, currentGenre, playing, muted, onToggleMusic]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Update based on parent component control
    if (isPlaying !== playing) {
      setPlaying(isPlaying);
    }
    
    if (playing && !muted) {
      audioRef.current.volume = volume;
      
      // Make sure we have a source
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        audioRef.current.src = usingFallback ? fallbackMusicMap[genre] : musicMap[genre];
      }
      
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          toast.error("Playback failed. Click again or check browser autoplay settings.");
          setPlaying(false);
          if (onToggleMusic) onToggleMusic(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing, isPlaying, muted, genre, volume, usingFallback, onToggleMusic]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const togglePlay = () => {
    const newPlayingState = !playing;
    
    if (newPlayingState) {
      // Try to play and handle any autoplay restrictions
      if (audioRef.current) {
        // Ensure we have a valid source
        if (!audioRef.current.src || audioRef.current.src === window.location.href) {
          audioRef.current.src = usingFallback ? fallbackMusicMap[genre] : musicMap[genre];
        }
        
        audioRef.current.play()
          .then(() => {
            setPlaying(true);
            if (onToggleMusic) onToggleMusic(true);
          })
          .catch(e => {
            console.error("Audio playback failed:", e);
            toast.error("Playback failed. Click again or check browser autoplay settings.");
            setPlaying(false);
            if (onToggleMusic) onToggleMusic(false);
          });
      }
    } else {
      setPlaying(false);
      if (onToggleMusic) onToggleMusic(false);
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
    
    if (audioRef.current) {
      audioRef.current.volume = !muted ? 0 : volume;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Update system volume indicator
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : newVolume;
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
        <Music className="h-4 w-4 text-primary" />
        Background Music <span className="text-xs text-muted-foreground ml-1">({genre})</span>
      </h3>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
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
