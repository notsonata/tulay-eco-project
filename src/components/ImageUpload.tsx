
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImagesSelected: (images: File[]) => void;
  maxImages?: number;
  previewUrls?: string[];
  readOnly?: boolean;
}

const ImageUpload = ({ 
  onImagesSelected, 
  maxImages = 3, 
  previewUrls = [],
  readOnly = false
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>(previewUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (files.length + previews.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images`);
      return;
    }
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    onImagesSelected(files);
  };
  
  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    // This callback would need to be adjusted in a real implementation
    // to actually remove the file from the parent component's state
    // Right now it only updates the UI
  };

  return (
    <div className="space-y-3">
      {!readOnly && (
        <div 
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Click to upload images</p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG up to 5MB ({previews.length}/{maxImages})
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg, image/png"
            multiple
            onChange={handleFileChange}
            disabled={previews.length >= maxImages}
          />
        </div>
      )}
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              {!readOnly && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {/* Add placeholder for remaining slots */}
          {!readOnly && Array.from({length: Math.max(0, maxImages - previews.length)}).map((_, index) => (
            <div 
              key={`placeholder-${index}`}
              className="h-24 border border-dashed rounded-md flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-6 w-6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
