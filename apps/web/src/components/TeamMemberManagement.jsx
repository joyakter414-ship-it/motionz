import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import pb from '@/lib/pocketbaseClient.js';
import TeamMemberFormModal from './TeamMemberFormModal.jsx';

function TeamMemberManagement() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await pb.collection('team_members').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setMembers(records);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    try {
      await pb.collection('team_members').delete(memberToDelete.id, { $autoCancel: false });
      toast({ title: 'Success', description: 'Team member deleted successfully.' });
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
      toast({ title: 'Error', description: 'Failed to delete team member.', variant: 'destructive' });
    } finally {
      setMemberToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-[hsl(var(--admin-text))] mb-4">{error}</p>
        <Button onClick={fetchMembers} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--admin-text))] flex items-center gap-2">
          <Users className="w-6 h-6 text-[hsl(var(--admin-gold))]" />
          Team Members
        </h2>
        <Button 
          onClick={handleAdd}
          className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium">Profile</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
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
                    <td className="px-6 py-4"><Skeleton className="w-20 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No team members found. Click "Add New Member" to get started.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[hsl(var(--admin-bg))] border border-[hsl(var(--admin-border))]">
                        {member.profileImage ? (
                          <img 
                            src={pb.files.getUrl(member, member.profileImage, { thumb: '100x100' })} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[hsl(var(--admin-text-muted))]">
                            <Users className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{member.name}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))]">{member.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))] hover:bg-[hsl(var(--admin-gold))]/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setMemberToDelete(member)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive hover:bg-destructive/10">
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

      <TeamMemberFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        memberToEdit={selectedMember}
        onSuccess={fetchMembers}
      />

      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <AlertDialogContent className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-text-muted))]">
              This will permanently delete {memberToDelete?.name} from the team. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg))]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TeamMemberManagement;