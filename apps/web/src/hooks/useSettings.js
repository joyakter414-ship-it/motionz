import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const DEFAULT_SETTINGS = {
  id: 'twk0gx6rafozn6e',
  whatsapp_number: '+8801518904165',
  email_address: 'motionz.studio.team@gmail.com'
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const record = await pb.collection('settings').getFirstListItem('', { $autoCancel: false });
        setSettings(record);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}