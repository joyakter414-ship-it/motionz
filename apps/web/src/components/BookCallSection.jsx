import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function BookCallSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const submissions = JSON.parse(localStorage.getItem('callSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('callSubmissions', JSON.stringify(submissions));

      toast({
        title: "Request received",
        description: "We'll get back to you within 24 hours."
      });

      setFormData({ name: '', email: '', company: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleBookCall = () => {
    window.open('https://wa.me/8801518904165', '_blank');
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground">
            Book a free consultation
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your video editing needs and how we can help grow your brand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold text-card-foreground">Book a call</h3>
            </div>
            <p className="text-card-foreground mb-6">
              Chat with us directly on WhatsApp to discuss your project and get a quick response.
            </p>
            <Button
              onClick={handleBookCall}
              className="w-full bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 hover:gold-glow-strong active:scale-[0.98]"
            >
              Open WhatsApp
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold text-card-foreground">Send us a message</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-card-foreground">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-card-foreground">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-card-foreground">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-card-foreground">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 bg-background text-foreground border-border"
                  placeholder="Tell us about your project"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 hover:gold-glow-strong active:scale-[0.98]"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BookCallSection;