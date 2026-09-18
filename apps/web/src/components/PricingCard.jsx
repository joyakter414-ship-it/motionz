import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PricingCard({ tier, price, features, isPopular = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-card rounded-2xl p-8 transition-all duration-300 ${
        isPopular 
          ? 'scale-105 ring-2 ring-primary shadow-xl gold-glow' 
          : 'hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
          Most popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2 text-card-foreground">{tier}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">{price}</span>
          {price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-card-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full transition-all duration-300 ${
          isPopular 
            ? 'bg-primary text-primary-foreground hover:bg-accent hover:gold-glow-strong' 
            : 'bg-secondary text-secondary-foreground hover:bg-muted'
        }`}
      >
        Get started
      </Button>
    </motion.div>
  );
}

export default PricingCard;