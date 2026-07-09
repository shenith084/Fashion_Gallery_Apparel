import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile', '/api/', '/checkout', '/cart'],
    },
    sitemap: 'https://fashiongalleryapparel.lk/sitemap.xml',
  };
}
