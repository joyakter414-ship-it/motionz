import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdminHeader from '@/components/AdminHeader.jsx';
import VideoFormModal from '@/components/VideoFormModal.jsx';
import pb from '@/lib/pocketbaseClient.js';

function VideoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const record = await pb.collection('portfolio_videos').getOne(id, { $autoCancel: false });
        setVideo(record);
      } catch (error) {
        console.error('Error fetching video:', error);
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  const handleClose = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))]">
        <AdminHeader breadcrumb="Edit Video" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))]">
      <Helmet>
        <title>Edit Video | MotionZ Admin</title>
      </Helmet>
      <AdminHeader breadcrumb="Edit Video" />
      
      {/* We reuse the modal component but keep it open, and navigate away on close */}
      <VideoFormModal 
        isOpen={true} 
        onClose={handleClose} 
        videoToEdit={video}
        onSuccess={handleClose}
      />
    </div>
  );
}

export default VideoEditPage;