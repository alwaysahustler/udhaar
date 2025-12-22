import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SplitKar',
    short_name: 'SplitKar',
    description: 'Split and settle expenses with Indian friends and family.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#16a34a',
    lang: 'en-IN',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}


