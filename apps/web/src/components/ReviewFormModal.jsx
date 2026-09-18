import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

function ReviewFormModal({ isOpen, onClose, reviewToEdit, onSuccess }) {
  const [formData, setFormData] = useState({ client_name: '', client_company: '', review_text: '', rating: 5 });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setFormData({
        client_name: reviewToEdit.client_name || '',
        client_company: reviewToEdit.client_company || '',
        review_text: reviewToEdit.review_text || '',
        rating: reviewToEdit.rating || 5
      });
      setFile(null);
    } else {
      setFormData({ client_name: '', client_company: '', review_text: '', rating: 5 });
      setFile(null);
    }
  }, [reviewToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('client_name', formData.client_name);
      data.append('client_company', formData.client_company);
      data.append('review_text', formData.review_text);
      data.append('rating', formData.rating);
      
      if (file) {
        data.append('client_photo', file);
      }

      if (reviewToEdit) {
        await pb.collection('reviews').update(reviewToEdit.id, data, { $autoCancel: false });
        toast.success('Review updated successfully');
      } else {
        await pb.collection('reviews').create(data, { $autoCancel: false });
        toast.success('Review created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save review');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))] max-w-lg">
        <DialogHeader>
          <DialogTitle>{reviewToEdit ? 'Edit Review' : 'Add Review'}</DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-muted))]">
            Manage client testimonials for the public pages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name" className="text-[hsl(var(--admin-text))]">Client Name</Label>
              <Input
                id="client_name"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_company" className="text-[hsl(var(--admin-text))]">Company (Optional)</Label>
              <Input
                id="client_company"
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--admin-text))]">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      star <= formData.rating ? 'text-[hsl(var(--admin-gold))] fill-[hsl(var(--admin-gold))]' : 'text-[hsl(var(--admin-border))]'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review_text" className="text-[hsl(var(--admin-text))]">Review Text</Label>
            <Textarea
              id="review_text"
              required
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_photo" className="text-[hsl(var(--admin-text))]">Client Photo (Optional)</Label>
            <Input
              id="client_photo"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] cursor-pointer file:text-[hsl(var(--admin-gold))] file:bg-transparent file:border-0"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
              {isLoading ? 'Saving...' : 'Save Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewFormModal;