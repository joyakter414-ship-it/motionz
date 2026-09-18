import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient.js';

function PortfolioCard({ video, onClick, index = 0 }) {
  if (!video) return null;

  const thumbnail = video.thumbnail_image 
    ? pb.files.getUrl(video, video.thumbnail_image, { thumb: '600x400' })
    : 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop'; // Fallback
    
  const categoryName = video.expand?.category_id?.name || video.category || 'Uncategorized';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(video)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-card border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out backdrop-blur-sm">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary border-none">
            {categoryName}
          </Badge>
        </div>
        <h3 className="font-bold text-xl mb-2 text-foreground line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-auto">
            {video.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default PortfolioCard;