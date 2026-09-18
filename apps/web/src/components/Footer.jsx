import React, { useState } from 'react';
import { R2_ASSETS } from '@/lib/r2Config.js';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings.js';

function Footer() {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const { settings } = useSettings();

  const handleNewsletterSubmit = e => {
    e.preventDefault();
    if (emailInput) {
      toast({
        title: "Subscribed",
        description: "You've been added to our newsletter."
      });
      setEmailInput('');
    }
  };

  const quickLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="bg-[#0a0a0a] text-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={R2_ASSETS.logo} 
                alt="MotionZ Logo" 
                className="h-10 w-auto rounded-xl object-contain" 
              />
              <span className="text-2xl font-bold">
                MotionZ
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Professional video editing services that help creators and brands stand out.
            </p>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Quick links</span>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Contact</span>
            <ul className="space-y-3">
              <li>
                <a href="mailto:motionz.studio.team@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  motionz.studio.team@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/8801873877905" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp +8801873877905
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Newsletter</span>
            <p className="text-muted-foreground mb-4">
              Get tips and updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input type="email" placeholder="Your email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required className="bg-muted text-foreground border-border" />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-accent transition-all duration-300">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MotionZ. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;