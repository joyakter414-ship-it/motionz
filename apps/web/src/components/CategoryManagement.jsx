import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CategoryFormModal from './CategoryFormModal.jsx';
import pb from '@/lib/pocketbaseClient.js';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('categories').getFullList({
        sort: 'name',
        $autoCancel: false
      });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await pb.collection('categories').delete(category.id, { $autoCancel: false });
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--admin-text))]">Categories</h2>
        <Button onClick={handleAdd} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border))]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-24 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-48 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="w-20 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No categories found. Click "Add Category" to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{category.name}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))]">{category.slug}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))] truncate max-w-[200px]">{category.description || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))]">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive">
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

      <CategoryFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        categoryToEdit={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}

export default CategoryManagement;