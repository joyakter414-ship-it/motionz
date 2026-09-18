import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

function PortfolioFilter({ activeCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const records = await pb.collection('categories').getFullList({
          sort: 'name',
          $autoCancel: false
        });
        setCategories(records);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      <Button
        onClick={() => onCategoryChange('all')}
        variant={activeCategory === 'all' ? 'default' : 'secondary'}
        className={`rounded-full px-6 transition-all duration-300 ${
          activeCategory === 'all'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          variant={activeCategory === category.id ? 'default' : 'secondary'}
          className={`rounded-full px-6 transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}

export default PortfolioFilter;