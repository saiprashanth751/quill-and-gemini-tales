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

// Reliable online sources
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
  const [errorCount, setErrorCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount with improved error handling
  useEffect(() => {
    // Clean up previous audio element if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.remove();
      audioRef.current = null;
    }
    
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";
    
    // Try online source first as it's more reliable
    const tryAudio = (useLocal = false) => {
      if (!audioRef.current) return;
      
      audioRef.current.src = useLocal ? localMusicMap[genre] : onlineMusicMap[genre];
      setUsingFallback(!useLocal);
      
      console.log(`Trying ${useLocal ? "local" : "online"} audio source: ${audioRef.current.src}`);
    };
    
    // Start with online source
    tryAudio(false);
    
    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
      setErrorCount(0); // Reset error count on successful load
      console.log("Audio loaded successfully:", audioRef.current?.src);
    };
    
    const handleError = (e: Event) => {
      console.log("Audio error occurred:", e);
      
      // Don't try to switch sources if we've already had multiple errors
      // This prevents infinite error loops
      if (errorCount > 2) {
        console.log("Too many errors, stopping audio playback attempts");
        setPlaying(false);
        if (onToggleMusic) onToggleMusic(false);
        toast.error("Audio playback unavailable. Please try again later.");
        return;
      }
      
      setErrorCount(prev => prev + 1);
      
      // If online source fails, try local, and vice versa
      if (usingFallback) {
        // Already tried both sources, stop trying
        console.log("Both audio sources failed");
        setPlaying(false);
        if (onToggleMusic) onToggleMusic(false);
        toast.error("Audio playback unavailable. Please check if audio files exist in /public/audio folder.");
      } else {
        // If online failed, try local
        console.log("Trying local audio source as fallback");
        tryAudio(true);
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('error', handleError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [genre]); // Only recreate audio element when genre changes
  
  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || errorCount > 2) return;
    
    // Update based on parent component control
    if (isPlaying !== playing) {
      setPlaying(isPlaying);
    }
    
    if (playing && !muted) {
      audioRef.current.volume = volume;
      
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback failed:", e);
            // Don't keep trying if user interaction is needed
            if (e.name === "NotAllowedError") {
              toast.error("Playback requires user interaction first");
              setPlaying(false);
              if (onToggleMusic) onToggleMusic(false);
            }
          });
        }
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [playing, isPlaying, muted, volume, onToggleMusic, errorCount]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const togglePlay = () => {
    if (errorCount > 2) {
      toast.error("Audio playback unavailable. Please reload the page or check audio files.");
      return;
    }
    
    const newPlayingState = !playing;
    setPlaying(newPlayingState);
    if (onToggleMusic) onToggleMusic(newPlayingState);
    
    if (newPlayingState && audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Play error:", e);
          if (e.name === "NotAllowedError") {
            toast.error("Playback requires user interaction first");
          } else {
            toast.error("Failed to play audio. Try clicking again.");
          }
          setPlaying(false);
          if (onToggleMusic) onToggleMusic(false);
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
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
    
    if (audioRef.current && !muted) {
      audioRef.current.volume = newVolume;
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
          disabled={errorCount > 2}
        >
          {playing && !muted ? "Playing" : "Play Music"}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full"
            onClick={toggleMute}
            disabled={errorCount > 2}
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
            disabled={errorCount > 2}
          />
          <span className="text-xs w-10">{Math.round(volume * 100)}%</span>
        </div>
      </div>
      
      {errorCount > 2 && (
        <div className="text-xs text-orange-500 mt-1">
          Audio playback unavailable. Please check if audio files exist in /public/audio folder or reload the page.
        </div>
      )}
    </div>
  );
}
