import { portfolioItems } from '../data/portfolioData';

export async function GET() {
  // Mapeia quais categorias correspondem a quais slugs de URL
  const slugs = {
    'coberturas': 'coberturas',
    'botanico': 'botanico',
    'geek': 'geek',
    'blackwork': 'blackwork',
    'fineline': 'fine-line',
  };

  // Agrupa as imagens por URL da página
  const paginas = {
    'https://claranasc.com/': portfolioItems.filter(foto => foto.destaque),
    'https://claranasc.com/tatuagem/coberturas/': portfolioItems.filter(foto => foto.category === 'coberturas'),
    'https://claranasc.com/tatuagem/botanico/': portfolioItems.filter(foto => foto.category === 'botanico'),
    'https://claranasc.com/tatuagem/geek/': portfolioItems.filter(foto => foto.category === 'geek'),
    'https://claranasc.com/tatuagem/blackwork/': portfolioItems.filter(foto => foto.category === 'blackwork'),
    'https://claranasc.com/tatuagem/fine-line/': portfolioItems.filter(foto => foto.category === 'fineline'),
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const [url, fotos] of Object.entries(paginas)) {
    if (fotos.length === 0) continue;

    xml += `\n  <url>\n    <loc>${url}</loc>`;
    
    for (const foto of fotos) {
      // Escape special XML characters for safety (e.g. &, <, >)
      const esc = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      
      const imgLoc = new URL(foto.image.src, 'https://claranasc.com').href;
      xml += `
    <image:image>
      <image:loc>${esc(imgLoc)}</image:loc>
      <image:title>${esc(foto.title)}</image:title>
      <image:caption>${esc(foto.alt)}</image:caption>
    </image:image>`;
    }
    
    xml += `\n  </url>`;
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
