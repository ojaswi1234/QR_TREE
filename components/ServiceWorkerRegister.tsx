'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Ensure serviceWorker is supported AND (we are on HTTPS OR localhost)
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }

    // specific sync logging logs
    const handleOnline = () => console.log('[Sync] Online - will sync to MongoDB');
    const handleOffline = () => console.log('[Sync] Offline - using IndexedDB only');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    console.log('[Sync] Initial status:', navigator.onLine ? 'Online' : 'Offline');

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
