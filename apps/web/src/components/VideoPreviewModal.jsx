import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient.js';

function VideoPreviewModal({ isOpen, onClose, video }) {
  if (!video) return null;

  // Simple helper to convert youtube/vimeo links to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    if (url.includes('vimeo.com/')) {
      return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] p-0 overflow-hidden">
        <div className="aspect-video w-full bg-black relative">
          {video.video_url ? (
            <iframe
              src={getEmbedUrl(video.video_url)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <img 
              src={pb.files.getUrl(video, video.thumbnail_image)} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-[hsl(var(--admin-gold))]/10 text-[hsl(var(--admin-gold))] hover:bg-[hsl(var(--admin-gold))]/20 border-0">
                {video.category}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-[hsl(var(--admin-text))]">
              {video.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-[hsl(var(--admin-text-muted))] leading-relaxed">
            {video.description}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VideoPreviewModal;