
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ImagePreviewProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImagePreview = ({ 
  images, 
  initialIndex = 0, 
  open,
  onOpenChange
}: ImagePreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  if (images.length === 0) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
        <DialogClose className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 z-50">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="relative flex items-center justify-center h-[80vh]">
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="flex justify-center gap-2 p-4 bg-black/80">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
