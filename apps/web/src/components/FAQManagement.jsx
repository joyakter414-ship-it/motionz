import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

function FAQManagement() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0
  });

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('faqs').getFullList({
        sort: 'order',
        $autoCancel: false
      });
      setFaqs(records);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAdd = () => {
    setSelectedFaq(null);
    setFormData({ question: '', answer: '', order: faqs.length });
    setIsFormOpen(true);
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (faq) => {
    setSelectedFaq(faq);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedFaq) {
        await pb.collection('faqs').update(selectedFaq.id, formData, { $autoCancel: false });
        toast({ title: "Success", description: "FAQ updated successfully." });
      } else {
        await pb.collection('faqs').create(formData, { $autoCancel: false });
        toast({ title: "Success", description: "FAQ created successfully." });
      }
      setIsFormOpen(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to save FAQ. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFaq) return;
    try {
      await pb.collection('faqs').delete(selectedFaq.id, { $autoCancel: false });
      toast({ title: "Success", description: "FAQ deleted successfully." });
      setIsDeleteOpen(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[hsl(var(--admin-text))]">Manage FAQs</h2>
        <Button 
          onClick={handleAdd}
          className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Order</th>
                <th className="px-6 py-4 font-medium w-1/3">Question</th>
                <th className="px-6 py-4 font-medium">Answer</th>
                <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border))]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-8 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-3/4 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-full h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-16 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No FAQs found. Click "Add FAQ" to get started.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{faq.order}</td>
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{faq.question}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))] line-clamp-2 max-w-xs md:max-w-md">
                      {faq.answer}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))] hover:bg-[hsl(var(--admin-gold))]/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(faq)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive hover:bg-destructive/10">
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                name="question"
                value={formData.question}
                onChange={handleFormChange}
                required
                className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                placeholder="E.g., What is your typical turnaround time?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleFormChange}
                required
                rows={4}
                className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                placeholder="Detailed answer here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={handleFormChange}
                required
                className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
              />
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-card))]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
              >
                {isSubmitting ? 'Saving...' : 'Save FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))] border-[hsl(var(--admin-border))]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-text-muted))]">
              This action cannot be undone. This will permanently delete the FAQ.
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

export default FAQManagement;