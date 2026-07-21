
import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, onClose, imageSrc, altText }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[90vw] max-h-[90vh] p-0 border-none overflow-hidden">
        <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center p-2">
          <img 
            src={imageSrc} 
            alt={altText} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          <DialogClose className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/80 border border-white/10 hover:bg-eythor-blue/20 transition-colors">
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
