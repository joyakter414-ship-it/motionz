import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function TestimonialCard({ name, company, review, rating, initials, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-lg break-inside-avoid mb-6"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-primary text-primary' : 'text-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-card-foreground mb-6 leading-relaxed">{review}</p>
      <div className="flex items-center gap-3">
        <Avatar className="rounded-xl">
          <AvatarFallback className={`rounded-xl ${color} text-white font-semibold`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-card-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default TestimonialCard;