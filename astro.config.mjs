// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Obrigatório para URLs absolutas (canonical, og:image) e para o sitemap.
  site: 'https://claranasc.com',
  integrations: [
    react(),
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
      priority: 0.8,
      // A home é o alvo principal; as páginas por nicho herdam 0.8.
      serialize(item) {
        if (item.url === 'https://claranasc.com/') {
          item.priority = 1.0;
        }
        return item;
      }
    })
  ]
});
