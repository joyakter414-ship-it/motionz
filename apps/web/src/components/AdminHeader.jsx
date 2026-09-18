import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { R2_ASSETS } from '@/lib/r2Config.js';

function AdminHeader({ breadcrumb }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--admin-bg))]/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <Link to="/admin" className="flex items-center gap-3 font-bold text-xl text-[hsl(var(--admin-text))]">
          <img 
            src={R2_ASSETS.favicon} 
            alt="MotionZ Logo" 
            className="h-8 w-auto rounded-lg object-contain" 
          />
          MotionZ
        </Link>
        
        <div className="h-6 w-px bg-[hsl(var(--admin-border))] mx-2" />
        
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--admin-text-muted))]">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
          {breadcrumb && (
            <>
              <span className="mx-1">/</span>
              <span className="text-[hsl(var(--admin-text))] font-medium">{breadcrumb}</span>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-[hsl(var(--admin-text-muted))] hidden md:inline-block">
            {currentUser?.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-card))] hover:text-[hsl(var(--admin-gold))]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;