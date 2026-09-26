'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const daftar = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Fallback gracefully
      });
    };

    if (document.readyState === 'complete') {
      daftar();
      return;
    }

    window.addEventListener('load', daftar);
    return () => window.removeEventListener('load', daftar);
  }, []);

  return null;
}
