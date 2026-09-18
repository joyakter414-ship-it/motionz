import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useVideoSourceDetector } from '@/hooks/useVideoSourceDetector.js';

function VideoPlayerModal({ isOpen, onClose, video }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { type, src, isValid } = useVideoSourceDetector(video);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset states when modal opens/closes or video changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(!isValid);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isValid, video]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          aria-label="Close modal"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Modal Content container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          className="relative w-full max-w-5xl aspect-video bg-zinc-950 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        >
          {/* Loading State */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-zinc-400 font-medium">Loading video...</p>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Video unavailable</h3>
              <p className="text-zinc-400">The video source could not be loaded or is invalid.</p>
            </div>
          )}

          {/* Video Players */}
          {!hasError && type === 'video' && (
            <video
              src={src}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onLoadedData={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />
          )}

          {!hasError && type === 'youtube' && (
            <iframe
              src={`https://www.youtube.com/embed/${src}?autoplay=1&rel=0`}
              title={video?.title || 'YouTube video player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />
          )}

          {!hasError && type === 'vimeo' && (
            <iframe
              src={`https://player.vimeo.com/video/${src}?autoplay=1&title=0&byline=0&portrait=0`}
              title={video?.title || 'Vimeo video player'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />
          )}
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VideoPlayerModal;