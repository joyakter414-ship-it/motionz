import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';
import { Loader2 } from 'lucide-react';

function TeamMemberFormModal({ isOpen, onClose, memberToEdit, onSuccess }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    profileLink: ''
  });
  const [files, setFiles] = useState({
    profileImage: null,
    additionalImage: null,
    video: null
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || '',
        role: memberToEdit.role || '',
        bio: memberToEdit.bio || '',
        profileLink: memberToEdit.profileLink || ''
      });
      setFiles({ profileImage: null, additionalImage: null, video: null });
    } else {
      resetForm();
    }
  }, [memberToEdit, isOpen]);

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', profileLink: '' });
    setFiles({ profileImage: null, additionalImage: null, video: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];
      
      // Immediate validation feedback
      if (name === 'video' && selectedFile.size > 104857600) {
        toast({
          title: 'Error',
          description: 'Video file must be less than 100 MB',
          variant: 'destructive'
        });
        e.target.value = ''; // Reset input
        setFiles(prev => ({ ...prev, [name]: null }));
        return;
      }
      
      setFiles(prev => ({ ...prev, [name]: selectedFile }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Extra validation before submission
    if (files.video && files.video.size > 104857600) {
      toast({
        title: 'Error',
        description: 'Video file must be less than 100 MB',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('bio', formData.bio);
      data.append('profileLink', formData.profileLink);

      if (files.profileImage) data.append('profileImage', files.profileImage);
      if (files.additionalImage) data.append('additionalImage', files.additionalImage);
      if (files.video) data.append('video', files.video);

      if (memberToEdit) {
        await pb.collection('team_members').update(memberToEdit.id, data, { $autoCancel: false });
        toast({ title: 'Success', description: 'Team member updated successfully.' });
      } else {
        await pb.collection('team_members').create(data, { $autoCancel: false });
        toast({ title: 'Success', description: 'Team member added successfully.' });
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save team member.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[hsl(var(--admin-gold))]">
            {memberToEdit ? 'Edit Team Member' : 'Add New Team Member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileLink">Profile Link (URL)</Label>
            <Input
              id="profileLink"
              name="profileLink"
              type="url"
              value={formData.profileLink}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/..."
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <Input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-sm"
              />
              {memberToEdit?.profileImage && !files.profileImage && (
                <p className="text-xs text-[hsl(var(--admin-text-muted))]">Current file exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalImage">Additional Image</Label>
              <Input
                id="additionalImage"
                name="additionalImage"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-sm"
              />
              {memberToEdit?.additionalImage && !files.additionalImage && (
                <p className="text-xs text-[hsl(var(--admin-text-muted))]">Current file exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">
                Video <span className="text-xs font-normal text-[hsl(var(--admin-text-muted))]">(Max 100 MB)</span>
              </Label>
              <Input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-sm"
              />
              {memberToEdit?.video && !files.video && (
                <p className="text-xs text-[hsl(var(--admin-text-muted))]">Current file exists</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg))]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {memberToEdit ? 'Update Member' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TeamMemberFormModal;