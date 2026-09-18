import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ServiceCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-muted rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:gold-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:text-accent transition-colors">
        Learn more
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </motion.div>
  );
}

export default ServiceCard;