import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Film, Upload, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

function AboutMediaManagement() {
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const fetchMediaRecord = async () => {
    setIsLoading(true);
    try {
      const result = await pb.collection('about_media').getList(1, 1, { $autoCancel: false });
      if (result.items.length > 0) {
        setRecord(result.items[0]);
      } else {
        // If no record exists, create an empty one
        const newRecord = await pb.collection('about_media').create({}, { $autoCancel: false });
        setRecord(newRecord);
      }
    } catch (error) {
      console.error('Error fetching about media:', error);
      toast.error('Failed to load media settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaRecord();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !record) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, WebP, or GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const updatedRecord = await pb.collection('about_media').update(record.id, formData, { $autoCancel: false });
      setRecord(updatedRecord);
      toast.success('Image uploaded successfully.');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !record) return;

    // Validate file
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an MP4, WebM, or OGG.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 100MB.');
      return;
    }

    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const updatedRecord = await pb.collection('about_media').update(record.id, formData, { $autoCancel: false });
      setRecord(updatedRecord);
      toast.success('Video uploaded successfully.');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video.');
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!record) return;
    try {
      const updatedRecord = await pb.collection('about_media').update(record.id, { image: null }, { $autoCancel: false });
      setRecord(updatedRecord);
      toast.success('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image.');
    }
  };

  const handleDeleteVideo = async () => {
    if (!record) return;
    try {
      const updatedRecord = await pb.collection('about_media').update(record.id, { video: null }, { $autoCancel: false });
      setRecord(updatedRecord);
      toast.success('Video deleted successfully.');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-[hsl(var(--admin-border))]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl bg-[hsl(var(--admin-border))]" />
          <Skeleton className="h-64 w-full rounded-xl bg-[hsl(var(--admin-border))]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[hsl(var(--admin-text))] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[hsl(var(--admin-gold))]" />
            About Page Media
          </h2>
          <p className="text-sm text-[hsl(var(--admin-text-muted))] mt-1">
            Manage the image and video displayed on the public About page.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[hsl(var(--admin-text))] flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              About Image
            </h3>
            {record?.image && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDeleteImage}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--admin-border))] rounded-lg p-4 bg-[hsl(var(--admin-bg))]/50 relative overflow-hidden min-h-[240px]">
            {record?.image ? (
              <img 
                src={pb.files.getUrl(record, record.image)} 
                alt="About" 
                className="w-full h-full object-cover rounded-md absolute inset-0"
              />
            ) : (
              <div className="text-center text-[hsl(var(--admin-text-muted))]">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No image uploaded</p>
                <p className="text-xs mt-1">Max size: 10MB (JPG, PNG, WebP, GIF)</p>
              </div>
            )}
            
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-white flex flex-col items-center">
                  <Upload className="w-8 h-8 animate-bounce mb-2" />
                  <span>Uploading...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <input 
              type="file" 
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
            />
            <Button 
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploadingImage}
              className="w-full bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              {record?.image ? 'Replace Image' : 'Upload Image'}
            </Button>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[hsl(var(--admin-text))] flex items-center gap-2">
              <Film className="w-4 h-4" />
              About Video
            </h3>
            {record?.video && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDeleteVideo}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--admin-border))] rounded-lg p-4 bg-[hsl(var(--admin-bg))]/50 relative overflow-hidden min-h-[240px]">
            {record?.video ? (
              <video 
                src={pb.files.getUrl(record, record.video)} 
                controls
                className="w-full h-full object-cover rounded-md absolute inset-0 bg-black"
              />
            ) : (
              <div className="text-center text-[hsl(var(--admin-text-muted))]">
                <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No video uploaded</p>
                <p className="text-xs mt-1">Max size: 100MB (MP4, WebM, OGG)</p>
              </div>
            )}
            
            {isUploadingVideo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-white flex flex-col items-center">
                  <Upload className="w-8 h-8 animate-bounce mb-2" />
                  <span>Uploading...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <input 
              type="file" 
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
            />
            <Button 
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploadingVideo}
              className="w-full bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              {record?.video ? 'Replace Video' : 'Upload Video'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMediaManagement;