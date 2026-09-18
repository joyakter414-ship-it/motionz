import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function FAQItem({ question, answer, value }) {
  return (
    <AccordionItem value={value} className="border-border">
      <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default FAQItem;