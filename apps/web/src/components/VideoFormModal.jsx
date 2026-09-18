import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { UploadCloud, Video, FileVideo, X, CheckCircle, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

function VideoFormModal({ isOpen, onClose, videoToEdit, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    video_url: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const records = await pb.collection('categories').getFullList({
          sort: 'name',
          $autoCancel: false
        });
        setCategories(records);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (videoToEdit) {
      setFormData({
        title: videoToEdit.title || '',
        description: videoToEdit.description || '',
        category_id: videoToEdit.category_id || '',
        video_url: videoToEdit.video_url || '',
      });
      setVideoFile(null);
      setThumbnailFile(null);
    } else {
      setFormData({ title: '', description: '', category_id: '', video_url: '' });
      setVideoFile(null);
      setThumbnailFile(null);
    }
  }, [videoToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category_id: value }));
  };

  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 524288000) { // 500MB limit
        toast.error('Video file must be less than 500MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a video title.');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category.');
      return;
    }

    const hasExistingVideo = videoToEdit && (videoToEdit.video_file || videoToEdit.video_url);
    if (!videoFile && !formData.video_url.trim() && !hasExistingVideo) {
      toast.error('Please upload a video file (WebM or MP4) or enter a video URL.');
      return;
    }

    if (!videoToEdit && !thumbnailFile) {
      toast.error('Thumbnail image is required for new videos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = categories.find(c => c.id === formData.category_id);
      
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category_id', formData.category_id);
      data.append('category', selectedCat ? selectedCat.name : '');

      // Direct video file upload
      if (videoFile) {
        data.append('video_file', videoFile);
        data.append('video_url', formData.video_url.trim() || videoFile.name);
      } else if (formData.video_url.trim()) {
        data.append('video_url', formData.video_url.trim());
      }
      
      if (thumbnailFile) {
        data.append('thumbnail_image', thumbnailFile);
      }

      if (videoToEdit) {
        await pb.collection('portfolio_videos').update(videoToEdit.id, data, { $autoCancel: false });
        toast.success('Video updated successfully.');
      } else {
        await pb.collection('portfolio_videos').create(data, { $autoCancel: false });
        toast.success('Video added successfully.');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--admin-gold))] flex items-center gap-2">
            <Video className="w-6 h-6" />
            {videoToEdit ? 'Edit Video' : 'Add New Portfolio Video'}
          </DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-muted))]">
            Upload your WebM or MP4 video directly, or link an external source.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[hsl(var(--admin-text))] font-medium">Title *</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. 3D Product Animation Showreel"
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-[hsl(var(--admin-text))] font-medium">Category *</Label>
            {loadingCategories ? (
              <Skeleton className="h-10 w-full bg-[hsl(var(--admin-border))]" />
            ) : (
              <Select value={formData.category_id} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="focus:bg-[hsl(var(--admin-bg))] focus:text-[hsl(var(--admin-gold))]">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Direct Video Upload (WebM / MP4) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[hsl(var(--admin-text))] font-medium flex items-center gap-1.5">
                <FileVideo className="w-4 h-4 text-[hsl(var(--admin-gold))]" />
                Video File Upload (WebM or MP4)
              </Label>
              <span className="text-xs text-[hsl(var(--admin-text-muted))]">Max 500MB • WebM, MP4, MOV</span>
            </div>

            <div className="border-2 border-dashed border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-gold))]/60 rounded-xl p-4 bg-[hsl(var(--admin-bg))] transition-colors">
              {videoFile ? (
                <div className="flex items-center justify-between bg-[hsl(var(--admin-card))] p-3 rounded-lg border border-[hsl(var(--admin-border))]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-[hsl(var(--admin-gold))]/10 text-[hsl(var(--admin-gold))]">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate text-[hsl(var(--admin-text))]">{videoFile.name}</p>
                      <p className="text-xs text-[hsl(var(--admin-text-muted))]">
                        {formatFileSize(videoFile.size)} • {videoFile.type || 'video'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideoFile}
                    className="p-1.5 hover:bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text-muted))] hover:text-red-400 rounded-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="cursor-pointer flex flex-col items-center justify-center py-5 text-center"
                >
                  <UploadCloud className="w-9 h-9 text-[hsl(var(--admin-gold))] mb-2" />
                  <p className="text-sm font-medium text-[hsl(var(--admin-text))]">
                    Click to browse or drop your video file here
                  </p>
                  <p className="text-xs text-[hsl(var(--admin-text-muted))] mt-1">
                    Supports high-quality WebM VP9 and MP4 formats
                  </p>
                  {videoToEdit?.video_file && (
                    <p className="text-xs text-[hsl(var(--admin-gold))] mt-2 font-medium">
                      Current file: {videoToEdit.video_file} (upload a new file to replace)
                    </p>
                  )}
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/webm,video/mp4,video/quicktime,video/x-matroska,video/ogg,.webm,.mp4,.mov,.mkv"
                onChange={handleVideoFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Optional Video URL */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="video_url" className="text-xs text-[hsl(var(--admin-text-muted))]">
                Optional: Or specify external URL (YouTube / Vimeo / Cloudflare R2 URL)
              </Label>
            </div>
            <Input 
              id="video_url" 
              name="video_url" 
              value={formData.video_url} 
              onChange={handleChange} 
              placeholder="https://... or leave empty if uploading video file above"
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-xs"
            />
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-[hsl(var(--admin-text))] font-medium">
              Thumbnail Image {videoToEdit ? '(Leave blank to keep current)' : '*'}
            </Label>
            <div className="flex items-center gap-3">
              <Input 
                id="thumbnail" 
                ref={thumbInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleThumbnailChange}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] file:text-[hsl(var(--admin-gold))]"
              />
            </div>
            {thumbnailFile && (
              <p className="text-xs text-[hsl(var(--admin-gold))] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Selected: {thumbnailFile.name} ({formatFileSize(thumbnailFile.size)})
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[hsl(var(--admin-text))] font-medium">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3}
              placeholder="Describe the editing software used, style, duration, or client goals..."
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              disabled={isSubmitting}
              onClick={onClose}
              className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loadingCategories}
              className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90 font-medium min-w-[130px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                videoToEdit ? 'Update Video' : 'Upload Video'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VideoFormModal;