import React, { useState } from 'react';
import { ExternalLink, Play, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import pb from '@/lib/pocketbaseClient.js';

function TeamMemberCard({ member }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const profileImageUrl = member.profileImage 
    ? pb.files.getUrl(member, member.profileImage) 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=random';
    
  const additionalImageUrl = member.additionalImage 
    ? pb.files.getUrl(member, member.additionalImage) 
    : null;

  const videoUrl = member.video 
    ? pb.files.getUrl(member, member.video) 
    : null;

  return (
    <>
      <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        {/* Header Image Area */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
          {additionalImageUrl ? (
            <img 
              src={additionalImageUrl} 
              alt={`${member.name} workspace`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
          )}
          
          {/* Video Play Button Overlay */}
          {videoUrl && (
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label={`Play video for ${member.name}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-5 h-5 ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 flex-1 flex flex-col relative">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 flex justify-between items-end z-20">
            <div className="w-24 h-24 rounded-xl border-4 border-card overflow-hidden bg-muted shadow-md">
              <img 
                src={profileImageUrl} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {member.profileLink && (
              <a 
                href={member.profileLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm mb-2"
                aria-label={`${member.name}'s profile link`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
            <p className="text-sm font-medium text-primary mb-4">{member.role}</p>
            
            {member.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mb-4 flex-1">
                {member.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoUrl && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="sm:max-w-3xl p-0 bg-black border-border overflow-hidden">
            <DialogTitle className="sr-only">Video of {member.name}</DialogTitle>
            <div className="relative w-full aspect-video bg-black">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default TeamMemberCard;