import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import VideoPlayerModal from '@/components/VideoPlayerModal.jsx';
import PortfolioFilter from '@/components/PortfolioFilter.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient.js';

function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await pb.collection('portfolio_videos').getFullList({
        sort: '-created',
        expand: 'category_id',
        $autoCancel: false
      });
      setProjects(records);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => 
        project.category_id === activeCategory || 
        project.expand?.category_id?.id === activeCategory
      );

  return (
    <>
      <Helmet>
        <title>Portfolio - Our Video Editing Work | MotionZ</title>
        <meta name="description" content="Browse our portfolio of video editing projects including short form, long form, motion graphics, and color grading work." />
      </Helmet>

      <Header />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-secondary-foreground text-balance">
              Our portfolio
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our recent video editing projects across different styles and formats
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PortfolioFilter 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />

          <div className="min-h-[400px]">
            {error ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-muted/30 rounded-2xl border border-border">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
                <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
                <Button onClick={fetchVideos} variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden shadow-sm border bg-card flex flex-col h-full">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="p-5 flex flex-col flex-grow">
                      <Skeleton className="h-5 w-24 mb-4" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mt-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-muted/10 rounded-2xl border border-dashed border-border">
                <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No videos available</h3>
                <p className="text-muted-foreground max-w-sm text-balance">
                  {activeCategory === 'all' 
                    ? "We haven't added any videos to our portfolio yet. Please check back soon!"
                    : "There are currently no videos in this category."}
                </p>
                {activeCategory !== 'all' && (
                  <Button onClick={() => setActiveCategory('all')} variant="outline" className="mt-6">
                    View all projects
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <PortfolioCard
                      key={project.id}
                      video={project}
                      onClick={handleVideoClick}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={selectedVideo}
      />
    </>
  );
}

export default PortfolioPage;