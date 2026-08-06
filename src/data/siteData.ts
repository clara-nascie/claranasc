// Fonte única de verdade dos dados do site e do negócio.

export const SITE = {
  url: 'https://claranasc.com',
  name: 'Clara Nasc',
  // Precisa bater exatamente com o nome no Google Business Profile, senão o
  // Google lê a ficha e o site como dois negócios diferentes.
  businessName: 'Clara Nasc',
  jobTitle: 'Tatuadora',
  locale: 'pt_BR',
  lang: 'pt-BR',
  priceRange: '$$'
} as const;

/**
 * Titularidade das fotos, para os dados estruturados de imagem.
 * ⚠️ `caminho` precisa apontar para uma página que descreva os termos — é
 * requisito do Google para o selo "Licenciável" no Google Imagens.
 */
export const LICENCIAMENTO = {
  caminho: '/licenciamento/',
  titular: 'Clara Nascimento',
  credito: 'Clara Nasc',
  aviso: '© 2026 Clara Nascimento. Todos os direitos reservados.'
} as const;

export const CONTACT = {
  whatsapp: '5531983529270',
  telephone: '+5531983529270',
  email: null as string | null
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const LOCATION = {
  studioName: 'Iuna Tattoo',
  streetAddress: 'Av. Brasil, 673, sala 105' as string | null,
  neighborhood: 'Santa Efigênia' as string | null,
  postalCode: '30140-000' as string | null,
  geo: { latitude: -19.9241341, longitude: -43.9214529 } as { latitude: number; longitude: number } | null,
  city: 'Belo Horizonte',
  region: 'MG',
  regionName: 'Minas Gerais',
  country: 'BR',
  areaServed: ['Belo Horizonte', 'Nova Lima', 'Contagem', 'Betim', 'Região Metropolitana de Belo Horizonte']
} as const;

export function enderecoLinha(): string {
  return `${LOCATION.streetAddress} · ${LOCATION.neighborhood}, ${LOCATION.city}`;
}

export function mapsUrl(): string {
  const consulta = `${LOCATION.studioName}, ${LOCATION.streetAddress}, ${LOCATION.neighborhood}, ${LOCATION.city} - ${LOCATION.region}, ${LOCATION.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

export const SOCIAL = {
  instagram: 'https://www.instagram.com/clara.nasc/' as string | null,
  tiktok: 'https://www.tiktok.com/@clara.nasc13' as string | null
} as const;

export const OPENING_HOURS = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:00',
    closes: '22:00'
  },
  {
    days: ['PublicHolidays'],
    opens: '11:00',
    closes: '22:00'
  }
] as { days: string[]; opens: string; closes: string }[] | null;

export const OG_IMAGE = {
  path: '/assets/og-clara-nasc.jpg',
  width: 1200,
  height: 630,
  alt: 'Cobertura floral em traço fino no peito, feita por Clara Nasc, tatuadora em Belo Horizonte'
} as const;
