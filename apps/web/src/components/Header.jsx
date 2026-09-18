import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { R2_ASSETS } from '@/lib/r2Config.js';
import { Menu, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSettings } from '@/hooks/useSettings.js';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Left Aligned */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src={R2_ASSETS.logo} 
              alt="MotionZ Logo" 
              className="h-10 w-auto rounded-xl transition-all duration-300 group-hover:blue-glow object-contain" 
            />
            <span className="text-2xl font-bold text-foreground block">
              MotionZ
            </span>
          </Link>

          {/* Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-6 lg:gap-8 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions - Right Aligned */}
          <div className="hidden md:flex items-center justify-end gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 mr-2">
              {settings?.whatsapp_number && (
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.email_address && (
                <a 
                  href={getEmailLink()} 
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>

            {!isAuthenticated ? (
              <Button
                variant="outline"
                asChild
                className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
                >
                  <Link to="/admin">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Logout
                </Button>
              </>
            )}
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 hover:blue-glow-strong active:scale-[0.98]"
            >
              <Link to="/contact">Book a call</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background border-l border-border">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-border my-2" />
                
                <div className="flex gap-4">
                  {settings?.whatsapp_number && (
                    <a 
                      href={getWhatsAppLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {settings?.email_address && (
                    <a 
                      href={getEmailLink()} 
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <div className="h-px bg-border my-2" />
                
                {!isAuthenticated ? (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-primary transition-colors hover:text-accent"
                  >
                    Admin Login
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-primary transition-colors hover:text-accent"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-lg font-medium text-left text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
                
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-accent mt-4"
                >
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    Book a free call
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;