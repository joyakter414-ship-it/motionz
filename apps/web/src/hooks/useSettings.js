import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export function useSettings() {
  const [settings, setSettings] = useState({ whatsapp_number: '', email_address: '' });
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