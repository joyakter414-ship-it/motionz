import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

function PackageFormModal({ isOpen, onClose, packageToEdit, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', features: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (packageToEdit) {
      setFormData({
        name: packageToEdit.name || '',
        price: packageToEdit.price || '',
        description: packageToEdit.description || '',
        features: packageToEdit.features || ''
      });
    } else {
      setFormData({ name: '', price: '', description: '', features: '' });
    }
  }, [packageToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (packageToEdit) {
        await pb.collection('packages').update(packageToEdit.id, dataToSave, { $autoCancel: false });
        toast.success('Package updated successfully');
      } else {
        await pb.collection('packages').create(dataToSave, { $autoCancel: false });
        toast.success('Package created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save package');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))] max-w-lg">
        <DialogHeader>
          <DialogTitle>{packageToEdit ? 'Edit Package' : 'Add Package'}</DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-muted))]">
            Configure pricing plans. Enter one feature per line in the features box.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[hsl(var(--admin-text))]">Package Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                placeholder="e.g., Starter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-[hsl(var(--admin-text))]">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[hsl(var(--admin-text))]">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              placeholder="Short summary of this package..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features" className="text-[hsl(var(--admin-text))]">Features (One per line)</Label>
            <Textarea
              id="features"
              required
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              placeholder="4 videos per month&#10;Unlimited revisions&#10;24-48h turnaround"
              rows={5}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
              {isLoading ? 'Saving...' : 'Save Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PackageFormModal;