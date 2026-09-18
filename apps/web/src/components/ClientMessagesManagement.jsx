import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

function ClientMessagesManagement() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('client_messages').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setMessages(records);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load client messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteClick = (message) => {
    setSelectedMessage(message);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMessage) return;
    try {
      await pb.collection('client_messages').delete(selectedMessage.id, { $autoCancel: false });
      toast({ title: "Success", description: "Message deleted successfully." });
      setIsDeleteOpen(false);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[hsl(var(--admin-text))] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[hsl(var(--admin-gold))]" />
            Client Messages
          </h2>
          <p className="text-sm text-[hsl(var(--admin-text-muted))] mt-1">
            Total messages: {isLoading ? '...' : messages.length}
          </p>
        </div>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Name</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Email</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">WhatsApp Number</th>
                <th className="px-6 py-4 font-medium w-1/3 min-w-[200px]">Message</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border))]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-24 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-28 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-full h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-8 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No client messages found.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))] whitespace-nowrap">{message.name}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text))] whitespace-nowrap">
                      <a href={`mailto:${message.email}`} className="hover:text-[hsl(var(--admin-gold))] transition-colors">
                        {message.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text))] whitespace-nowrap">
                      <a href={`https://wa.me/${message.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--admin-gold))] transition-colors">
                        {message.whatsapp_number}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))]">
                      <div className="line-clamp-3" title={message.message}>
                        {message.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))] whitespace-nowrap">
                      {formatDate(message.created)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(message)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive hover:bg-destructive/10">
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

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-text-muted))]">
              This action cannot be undone. This will permanently delete the message from {selectedMessage?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-card))]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ClientMessagesManagement;