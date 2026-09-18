import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

function SettingsTab() {
  const { changePassword } = useAuth();
  
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const record = await pb.collection('settings').getFirstListItem('', { $autoCancel: false });
        setSettings(record);
        setWhatsapp(record.whatsapp_number || '');
        setEmail(record.email_address || '');
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settings) return;

    setSavingSettings(true);
    try {
      const updated = await pb.collection('settings').update(settings.id, {
        whatsapp_number: whatsapp,
        email_address: email
      }, { $autoCancel: false });
      setSettings(updated);
      toast.success('Contact settings updated successfully');
    } catch (error) {
      toast.error('Failed to update contact settings');
      console.error(error);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Settings */}
      <Card className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
        <form onSubmit={handleSaveSettings}>
          <CardHeader>
            <CardTitle>WhatsApp & Email Settings</CardTitle>
            <CardDescription className="text-[hsl(var(--admin-text-muted))]">
              Update the contact information displayed publicly on the website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSettings ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full bg-[hsl(var(--admin-border))]" />
                <Skeleton className="h-10 w-full bg-[hsl(var(--admin-border))]" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-[hsl(var(--admin-text))]">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1234567890"
                    className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[hsl(var(--admin-text))]">Contact Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@motionz.com"
                    className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={loadingSettings || savingSettings}
              className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90 w-full"
            >
              {savingSettings ? 'Saving...' : 'Save Contact Settings'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Account Settings */}
      <Card className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]">
        <form onSubmit={handleChangePassword}>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription className="text-[hsl(var(--admin-text-muted))]">
              Change your admin dashboard password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-[hsl(var(--admin-text))]">Current Password</Label>
              <Input 
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-[hsl(var(--admin-text))]">New Password</Label>
              <Input 
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[hsl(var(--admin-text))]">Confirm New Password</Label>
              <Input 
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={changingPassword}
              className="bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90 w-full"
            >
              {changingPassword ? 'Updating...' : 'Change Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SettingsTab;