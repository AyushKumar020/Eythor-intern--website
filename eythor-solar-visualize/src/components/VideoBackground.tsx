
import React, { useRef, useState, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  children?: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  src, 
  poster, 
  className = '', 
  children 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsLoaded(true);
      setHasError(false);
      console.log("Video loaded successfully:", src);
    };

    const handleError = () => {
      setHasError(true);
      console.error("Error loading video:", src);
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {hasError ? (
        <div className="absolute inset-0 bg-eythor-dark"></div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-eythor-dark/30 via-eythor-dark/60 to-eythor-dark" />
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;
