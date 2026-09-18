import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { R2_ASSETS } from '@/lib/r2Config.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login Error:', err);
      // Display the user-friendly error message thrown by AuthContext
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-bg))] px-4">
      <Helmet>
        <title>Admin Login | MotionZ</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <img 
            src={R2_ASSETS.favicon} 
            alt="MotionZ Logo" 
            className="h-16 w-auto rounded-2xl mb-4 shadow-lg object-contain" 
          />
          <h1 className="text-2xl font-bold text-[hsl(var(--admin-text))]">Admin Access</h1>
          <p className="text-[hsl(var(--admin-text-muted))] mt-2 text-center">
            Sign in to manage your portfolio and settings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[hsl(var(--admin-text))] font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] placeholder:text-[hsl(var(--admin-text-muted))] focus-visible:ring-[hsl(var(--admin-gold))] h-11"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-[hsl(var(--admin-text))] font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] placeholder:text-[hsl(var(--admin-text-muted))] focus-visible:ring-[hsl(var(--admin-gold))] h-11"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90 font-semibold transition-all duration-200 active:scale-[0.98] mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLoginPage;