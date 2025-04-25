import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      toast.info("Listening... Speak your story plot now");
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
      toast.error(`Speech recognition error: ${event.error}`);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim().length > 0) {
        toast.success("Voice input captured!");
        onTranscriptReady(transcript);
      } else if (isListening) {
        toast.info("No speech detected. Try again?");
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim().length > 0) {
          toast.success("Voice input captured!");
          onTranscriptReady(transcript);
        } else if (isListening) {
          toast.info("No speech detected. Try again?");
        }
      };
    }
  }, [transcript, isListening, onTranscriptReady]);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported or not initialized.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      toast.info("Voice recording stopped");
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Button
          type="button"
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          className={`relative ${isListening ? 'animate-pulse' : ''} transition-all duration-300 w-full sm:w-auto`}
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

      {isListening && (
        <div className="flex justify-center items-center gap-2 p-3 my-2 border border-primary/30 rounded-md bg-primary/5">
          <div className="flex space-x-1">
            <div className="w-1 h-8 bg-primary animate-pulse rounded"></div>
            <div className="w-1 h-8 bg-primary animate-pulse rounded animation-delay-200"></div>
            <div className="w-1 h-8 bg-primary animate-pulse rounded animation-delay-500"></div>
            <div className="w-1 h-8 bg-primary animate-pulse rounded animation-delay-300"></div>
            <div className="w-1 h-8 bg-primary animate-pulse rounded animation-delay-100"></div>
          </div>
          <span className="text-sm font-medium text-primary animate-pulse">
            Listening... Speak clearly
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
