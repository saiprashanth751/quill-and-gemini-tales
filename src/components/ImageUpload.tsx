
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ImageUploadProps {
  onImageChange: (base64: string | null) => void;
}

const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageChange(base64);
      setLoading(false);
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleButtonClick}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        
        {preview && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClear}
            className="text-destructive hover:text-destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8 border border-dashed rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      )}
      
      {preview && !loading && (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-[200px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
            Image uploaded successfully
          </div>
        </div>
      )}
      
      {!preview && !loading && (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md bg-muted/20">
          <ImageIcon className="h-12 w-12 text-muted mb-2" />
          <p className="text-sm text-muted-foreground">
            Upload an image to generate a story based on it
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
