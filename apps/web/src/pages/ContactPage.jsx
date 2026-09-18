import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/useSettings.js';
import pb from '@/lib/pocketbaseClient.js';

function ContactPage() {
  const {
    settings,
    loading
  } = useSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp_number || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await pb.collection('client_messages').create({
        name: formData.name,
        email: formData.email,
        whatsapp_number: formData.whatsapp_number,
        message: formData.message
      }, {
        $autoCancel: false
      });
      
      toast.success("Message sent successfully. We'll get back to you soon!");
      
      setFormData({
        name: '',
        email: '',
        whatsapp_number: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getWhatsAppLink = () => {
    if (!settings?.whatsapp_number) return '#';
    const cleanNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}`;
  };
  
  const getEmailLink = () => {
    if (!settings?.email_address) return '#';
    return `mailto:${settings.email_address}`;
  };
  
  return <>
      <Helmet>
        <title>Contact Us - Get in Touch | MotionZ</title>
        <meta name="description" content="Contact MotionZ for professional video editing services. Book a free consultation or send us a message." />
      </Helmet>

      <Header />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-secondary-foreground">
              Get in touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a project in mind? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-muted text-foreground border-border" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-muted text-foreground border-border" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp Number *</Label>
                  <Input id="whatsapp_number" name="whatsapp_number" type="tel" value={formData.whatsapp_number} onChange={handleChange} required className="bg-muted text-foreground border-border" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="bg-muted text-foreground border-border" placeholder="Tell us about your project" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 hover:blue-glow-strong active:scale-[0.98]">
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact information</h2>
                <div className="space-y-6">
                  {!loading && settings?.email_address && <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <a href={getEmailLink()} className="text-muted-foreground hover:text-primary transition-colors">
                          {settings.email_address}
                        </a>
                      </div>
                    </div>}

                  {!loading && settings?.whatsapp_number && <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">WhatsApp</p>
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          {settings.whatsapp_number}
                        </a>
                      </div>
                    </div>}

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Location</p>
                      <p className="text-muted-foreground">
                        Remote team serving clients worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Business hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>We’re Available 24/7 to Assist You Anytime</p>
                  <p>Available 24/7
Open Every Day, All Day</p>
                  <p>Closed on Major Holidays (New Year’s Day, Christmas, Eid, and Other Important Holidays)</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We’re available 24/7 and respond to inquiries as quickly as possible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>;
}

export default ContactPage;