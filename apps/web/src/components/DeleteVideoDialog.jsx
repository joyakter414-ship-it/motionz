import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

function DeleteVideoDialog({ isOpen, onClose, video, onSuccess }) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!video) return;
    setIsDeleting(true);
    try {
      await pb.collection('portfolio_videos').delete(video.id, { $autoCancel: false });
      toast({ title: 'Success', description: 'Video deleted successfully.' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to delete video.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[hsl(var(--admin-text))]">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[hsl(var(--admin-text-muted))]">
            This action cannot be undone. This will permanently delete the video
            <span className="font-semibold text-[hsl(var(--admin-gold))]"> "{video?.title}" </span>
            from your portfolio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteVideoDialog;