
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

// Define both local and online sources
const localMusicMap: Record<Genre, string> = {
  "fantasy": "/audio/fantasy-adventure.mp3",
  "sci-fi": "/audio/sci-fi-ambient.mp3", 
  "mystery": "/audio/mystery-suspense.mp3",
  "horror": "/audio/horror-atmosphere.mp3",
  "adventure": "/audio/adventure-journey.mp3",
  "romance": "/audio/romantic-melody.mp3",
  "erotic": "/audio/smooth-jazz.mp3"
};

// Fallback to reliable online sources if local files aren't available
const onlineMusicMap: Record<Genre, string> = {
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
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount with improved error handling
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
      
      // Try local source first
      audioRef.current.src = localMusicMap[genre];
      
      const handleCanPlayThrough = () => {
        setAudioLoaded(true);
        console.log("Audio loaded successfully:", audioRef.current?.src);
      };
      
      const handleError = () => {
        // If local file fails, try online source
        if (!usingFallback && audioRef.current) {
          console.log("Audio error occurred with primary source, trying fallback");
          setUsingFallback(true);
          audioRef.current.src = onlineMusicMap[genre];
          
          // Add one-time error handler for fallback
          const fallbackErrorHandler = () => {
            console.error("Fallback audio source also failed");
            toast.error("Audio playback issue. Please try again in a few moments.");
            setPlaying(false);
            if (onToggleMusic) onToggleMusic(false);
            audioRef.current?.removeEventListener('error', fallbackErrorHandler);
          };
          
          audioRef.current.addEventListener('error', fallbackErrorHandler, { once: true });
        }
      };
      
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current.src = "";
          audioRef.current = null;
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
      setAudioLoaded(false);
      setUsingFallback(false);
      
      if (audioRef.current) {
        const wasPlaying = playing && !muted;
        
        // Try local source first for new genre
        audioRef.current.src = localMusicMap[genre];
        audioRef.current.load();
        
        // If local source fails, this will be handled by the error event listener
        
        // Resume playing if it was playing before
        if (wasPlaying) {
          audioRef.current.play().catch(e => {
            console.error("Audio playback failed when changing genre:", e);
            
            // Check if we need to try the fallback
            if (!usingFallback) {
              setUsingFallback(true);
              audioRef.current!.src = onlineMusicMap[genre];
              audioRef.current!.load();
              
              // Try playing the fallback
              audioRef.current!.play().catch(fallbackError => {
                console.error("Fallback audio also failed:", fallbackError);
                toast.error("Audio playback unavailable at this time");
                setPlaying(false);
                if (onToggleMusic) onToggleMusic(false);
              });
            } else {
              toast.error("Failed to play audio track");
              setPlaying(false);
              if (onToggleMusic) onToggleMusic(false);
            }
          });
        }
      }
    }
  }, [genre, currentGenre, playing, muted, onToggleMusic, usingFallback]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Update based on parent component control
    if (isPlaying !== playing) {
      setPlaying(isPlaying);
    }
    
    if (playing && !muted) {
      audioRef.current.volume = volume;
      
      if (audioRef.current.paused) {
        // Add small timeout to avoid immediate playback which can trigger browser restrictions
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => {
              console.error("Audio playback failed:", e);
              
              // If not already using fallback, try it
              if (!usingFallback) {
                setUsingFallback(true);
                audioRef.current!.src = onlineMusicMap[genre];
                audioRef.current!.load();
                
                // Try playing the fallback
                audioRef.current!.play().catch(fallbackError => {
                  console.error("Fallback audio also failed:", fallbackError);
                  toast.error("Playback failed. Click again or check browser autoplay settings.");
                  toast.info("Try interacting with the page first (click somewhere) then try again", {
                    duration: 5000
                  });
                  setPlaying(false);
                  if (onToggleMusic) onToggleMusic(false);
                });
              } else {
                toast.error("Playback failed. Click again or check browser autoplay settings.");
                toast.info("Try interacting with the page first (click somewhere) then try again", {
                  duration: 5000
                });
                setPlaying(false);
                if (onToggleMusic) onToggleMusic(false);
              }
            });
          }
        }, 300);
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing, isPlaying, muted, volume, onToggleMusic, genre, usingFallback]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const togglePlay = () => {
    const newPlayingState = !playing;
    
    if (newPlayingState) {
      // Try to play
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setPlaying(true);
            if (onToggleMusic) onToggleMusic(true);
          })
          .catch(e => {
            console.error("Audio playback failed:", e);
            
            // If not already using fallback, try it
            if (!usingFallback) {
              setUsingFallback(true);
              audioRef.current!.src = onlineMusicMap[genre];
              audioRef.current!.load();
              
              // Try playing the fallback
              audioRef.current!.play().catch(fallbackError => {
                console.error("Fallback audio also failed:", fallbackError);
                toast.error("Playback failed. Click again or check browser autoplay settings.");
                toast.info("Try interacting with the page first (click somewhere) then try again", {
                  duration: 5000
                });
                setPlaying(false);
                if (onToggleMusic) onToggleMusic(false);
              });
            } else {
              toast.error("Playback failed. Click again or check browser autoplay settings.");
              toast.info("Try interacting with the page first (click somewhere) then try again", {
                duration: 5000
              });
              setPlaying(false);
              if (onToggleMusic) onToggleMusic(false);
            }
          });
      }
    } else {
      setPlaying(false);
      if (onToggleMusic) onToggleMusic(false);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
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
    
    // Update volume
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : newVolume;
    }
  };

  const getSourceText = () => {
    if (!audioLoaded) return "";
    return usingFallback ? " (online)" : " (local)";
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
        <Music className="h-4 w-4 text-primary" />
        Background Music <span className="text-xs text-muted-foreground ml-1">({genre}{getSourceText()})</span>
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
