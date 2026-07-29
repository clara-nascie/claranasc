// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Obrigatório para URLs absolutas (canonical, og:image) e para o sitemap.
  site: 'https://claranasc.com',
  vite: {
    resolve: {
      alias: {
        // O lucide-react não declara campo `exports`, só `main` (CommonJS) e
        // `module` (ESM). O Node ignora `module` — é convenção de bundler — e
        // resolve para o CommonJS, onde os imports nomeados quebram na
        // renderização do servidor ("Named export 'Instagram' not found").
        // Apontar direto para o arquivo ESM resolve na origem.
        'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs'
      }
    },
    ssr: {
      noExternal: ['lucide-react']
    }
  },
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
