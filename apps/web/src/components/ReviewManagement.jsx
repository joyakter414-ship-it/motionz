import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ReviewFormModal from './ReviewFormModal.jsx';
import pb from '@/lib/pocketbaseClient.js';

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('reviews').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setReviews(records);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAdd = () => {
    setSelectedReview(null);
    setIsFormOpen(true);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (review) => {
    if (window.confirm(`Are you sure you want to delete the review from "${review.client_name}"?`)) {
      try {
        await pb.collection('reviews').delete(review.id, { $autoCancel: false });
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to delete review');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--admin-text))]">Reviews</h2>
        <Button onClick={handleAdd} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Review
        </Button>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium">Photo</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Review</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border))]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-12 h-12 rounded-full bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-24 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-48 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="w-20 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No reviews found. Click "Add Review" to get started.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4">
                      {review.client_photo ? (
                        <img 
                          src={pb.files.getUrl(review, review.client_photo, { thumb: '100x100' })} 
                          alt={review.client_name}
                          className="w-12 h-12 rounded-full object-cover border border-[hsl(var(--admin-border))]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[hsl(var(--admin-border))] flex items-center justify-center text-[hsl(var(--admin-text))] font-bold">
                          {review.client_name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[hsl(var(--admin-text))]">{review.client_name}</div>
                      {review.client_company && <div className="text-xs text-[hsl(var(--admin-text-muted))]">{review.client_company}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[hsl(var(--admin-gold))] fill-[hsl(var(--admin-gold))]' : 'text-[hsl(var(--admin-border))]'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))] truncate max-w-[200px]">
                      {review.review_text}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(review)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))]">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(review)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        reviewToEdit={selectedReview}
        onSuccess={fetchReviews}
      />
    </div>
  );
}

export default ReviewManagement;