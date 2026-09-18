import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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
  const [thumbnailFile, setThumbnailFile] = useState(null);

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
      setThumbnailFile(null);
    } else {
      setFormData({ title: '', description: '', category_id: '', video_url: '' });
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id || !formData.video_url) {
      toast.error('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = categories.find(c => c.id === formData.category_id);
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category_id', formData.category_id);
      data.append('category', selectedCat ? selectedCat.name : ''); // Keep category text field populated for backward compatibility
      data.append('video_url', formData.video_url);
      
      if (thumbnailFile) {
        data.append('thumbnail_image', thumbnailFile);
      }

      if (videoToEdit) {
        await pb.collection('portfolio_videos').update(videoToEdit.id, data, { $autoCancel: false });
        toast.success('Video updated successfully.');
      } else {
        if (!thumbnailFile) {
          toast.error('Thumbnail image is required for new videos.');
          setIsSubmitting(false);
          return;
        }
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
      <DialogContent className="sm:max-w-[600px] bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--admin-gold))]">
            {videoToEdit ? 'Edit Video' : 'Add New Video'}
          </DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-muted))]">
            Fill in the details below to {videoToEdit ? 'update the' : 'add a new'} portfolio video.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[hsl(var(--admin-text))]">Title *</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Tech Product Launch"
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-[hsl(var(--admin-text))]">Category *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="video_url" className="text-[hsl(var(--admin-text))]">Video URL (YouTube/Vimeo) *</Label>
            <Input 
              id="video_url" 
              name="video_url" 
              value={formData.video_url} 
              onChange={handleChange} 
              placeholder="https://youtube.com/watch?v=..."
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-[hsl(var(--admin-text))]">
              Thumbnail Image {videoToEdit ? '(Leave blank to keep current)' : '*'}
            </Label>
            <Input 
              id="thumbnail" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] file:text-[hsl(var(--admin-gold))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[hsl(var(--admin-text))]">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
              placeholder="Describe the project..."
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loadingCategories}
              className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
            >
              {isSubmitting ? 'Saving...' : 'Save Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VideoFormModal;