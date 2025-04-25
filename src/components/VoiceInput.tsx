
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Add type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

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
      // Use type assertion to inform TypeScript about the browser's SpeechRecognition implementation
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
    // Use type assertion to inform TypeScript about the browser's SpeechRecognition implementation
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      const recognition = new SpeechRecognitionAPI();
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript(''); // Clear previous transcript
      const recognition = new SpeechRecognitionAPI();
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

// We no longer need the previous global declaration as we've defined the interfaces above
// And we're using type assertions instead

export default VoiceInput;
