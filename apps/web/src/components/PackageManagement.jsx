import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import PackageFormModal from './PackageFormModal.jsx';
import pb from '@/lib/pocketbaseClient.js';

function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('packages').getFullList({
        sort: 'price',
        $autoCancel: false
      });
      setPackages(records);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAdd = () => {
    setSelectedPackage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = async (pkg) => {
    if (window.confirm(`Are you sure you want to delete the package "${pkg.name}"?`)) {
      try {
        await pb.collection('packages').delete(pkg.id, { $autoCancel: false });
        toast.success('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        toast.error('Failed to delete package');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--admin-text))]">Packages</h2>
        <Button onClick={handleAdd} className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Package
        </Button>
      </div>

      <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Features Count</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border))]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-16 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-24 h-4 bg-[hsl(var(--admin-border))]" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="w-20 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                  </tr>
                ))
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                    No packages found. Click "Add Package" to get started.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{pkg.name}</td>
                    <td className="px-6 py-4 font-bold text-[hsl(var(--admin-gold))]">${pkg.price}</td>
                    <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))]">
                      {pkg.features ? pkg.features.split('\n').filter(Boolean).length : 0} items
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(pkg)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))]">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive">
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

      <PackageFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        packageToEdit={selectedPackage}
        onSuccess={fetchPackages}
      />
    </div>
  );
}

export default PackageManagement;