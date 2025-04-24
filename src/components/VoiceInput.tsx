
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onTranscriptReady: (transcript: string) => void;
}

const VoiceInput = ({ onTranscriptReady }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        // Only return the transcript if we actually got something
        if (transcript.trim().length > 0) {
          onTranscriptReady(transcript);
        }
      };
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      const recognition = new SpeechRecognition();
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript(''); // Clear previous transcript
      const recognition = new SpeechRecognition();
      recognition.start();
    }
  };
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Button
          type="button"
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          className={`relative ${isListening ? 'animate-pulse' : ''} transition-all duration-300`}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Speak Plot
            </>
          )}
          
          {isListening && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
        
        {transcript && (
          <span className="text-sm text-muted-foreground">
            {transcript.length} characters
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mb-2">{error}</p>
      )}
      
      {transcript && (
        <div className="p-2 border border-border rounded-md bg-background/50 mb-2">
          <p className="text-sm font-medium">Transcript:</p>
          <p className="text-sm text-muted-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
};

// Add type definition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default VoiceInput;
