import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

function CategoryFormModal({ isOpen, onClose, categoryToEdit, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        slug: categoryToEdit.slug || '',
        description: categoryToEdit.description || ''
      });
    } else {
      setFormData({ name: '', slug: '', description: '' });
    }
  }, [categoryToEdit, isOpen]);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      name: newName,
      slug: !categoryToEdit ? generateSlug(newName) : formData.slug
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (categoryToEdit) {
        await pb.collection('categories').update(categoryToEdit.id, formData, { $autoCancel: false });
        toast.success('Category updated successfully');
      } else {
        await pb.collection('categories').create(formData, { $autoCancel: false });
        toast.success('Category created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))] max-w-md">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-muted))]">
            Organize your portfolio videos into structured categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[hsl(var(--admin-text))]">Category Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              placeholder="e.g., Motion Graphics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-[hsl(var(--admin-text))]">Slug (URL-friendly)</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              placeholder="e.g., motion-graphics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[hsl(var(--admin-text))]">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
              {isLoading ? 'Saving...' : 'Save Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormModal;