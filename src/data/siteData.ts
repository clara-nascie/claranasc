/**
 * Fonte única de verdade dos dados do site e do negócio.
 *
 * Tudo que aparece em meta tags, JSON-LD, links de contato e rodapé sai daqui.
 * Nunca duplique número de WhatsApp, handle de rede social ou endereço em componentes.
 */

export const SITE = {
  url: 'https://claranasc.com',
  name: 'Clara Nasc',
  /** Nome do negócio como deve aparecer no Google (igual ao Google Business Profile). */
  businessName: 'Clara Nasc Tattoo',
  jobTitle: 'Tatuadora',
  locale: 'pt_BR',
  lang: 'pt-BR',
  /** Faixa de preço no padrão do schema.org: '$' a '$$$$'. */
  priceRange: '$$'
} as const;

export const CONTACT = {
  /** Formato E.164 sem '+' — usado direto na URL do wa.me. */
  whatsapp: '5531983529270',
  /** Mesmo número em E.164, para o campo `telephone` do schema.org. */
  telephone: '+5531983529270',
  /**
   * E-mail público de contato. Fica `null` de propósito: e-mail em JSON-LD é
   * lido por scrapers de spam. Só preencha se for um endereço profissional que
   * você aceita expor (evite o Gmail pessoal).
   */
  email: null as string | null
} as const;

/** URL do WhatsApp com mensagem opcional pré-preenchida. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Localização do estúdio.
 *
 * `streetAddress`, `postalCode` e `geo` alimentam o schema TattooParlor e são o
 * sinal mais forte para o local pack do Google. Campos em `null` são omitidos do
 * JSON-LD — schema.org com string vazia é pior que campo ausente.
 *
 * TODO(clara): preencher os 4 campos abaixo com os dados reais do estúdio.
 */
export const LOCATION = {
  streetAddress: null as string | null,
  neighborhood: null as string | null,
  postalCode: null as string | null,
  /** Coordenadas do estúdio. Pegue no Google Maps: clique no ponto > copiar lat/long. */
  geo: null as { latitude: number; longitude: number } | null,

  city: 'Belo Horizonte',
  /** Sigla do estado, como o schema.org espera em addressRegion. */
  region: 'MG',
  regionName: 'Minas Gerais',
  country: 'BR',
  /** Cidades/regiões atendidas — usado em `areaServed`. */
  areaServed: ['Belo Horizonte', 'Nova Lima', 'Contagem', 'Betim', 'Região Metropolitana de Belo Horizonte']
} as const;

/**
 * Perfis sociais oficiais. Viram `sameAs` no JSON-LD, que é como o Google
 * conecta o site à mesma entidade nas outras plataformas.
 *
 * TODO(clara): trocar o handle do Instagram pelo real.
 */
export const SOCIAL = {
  instagram: null as string | null,
  tiktok: null as string | null
} as const;

/**
 * Horário de atendimento, no formato do schema.org `OpeningHoursSpecification`.
 * Dias válidos: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
 *
 * Deixe como `null` enquanto não for o horário real — horário errado no schema
 * gera reclamação de cliente e o Google trata como sinal de baixa qualidade.
 *
 * TODO(clara): preencher com os dias e horários reais de atendimento.
 * Exemplo: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '10:00', closes: '19:00' }]
 */
export const OPENING_HOURS = null as
  | { days: string[]; opens: string; closes: string }[]
  | null;

/**
 * Imagem padrão de compartilhamento (Open Graph / Twitter Card).
 *
 * É o que o Google e o WhatsApp mostram como sendo o negócio. Até 31/07/2026
 * era o `hero-bg.webp`, uma tatuagem gerada por IA que não é trabalho da
 * Clara — invisível navegando o site, mas o cartão de visita dele em toda
 * busca e todo link compartilhado.
 *
 * Agora é um recorte de `cobertura-floral-peito`, trabalho real dela.
 *
 * JPEG, e não WebP como o resto do site: alguns raspadores de link ainda
 * tropeçam em WebP, e esta é justamente a imagem que precisa abrir em
 * qualquer lugar. Receita do recorte em assets/README.md.
 */
export const OG_IMAGE = {
  path: '/assets/og-clara-nasc.jpg',
  /** Dimensões reais do arquivo. 1200x630 é o formato que o OG pede. */
  width: 1200,
  height: 630,
  alt: 'Cobertura floral em traço fino no peito, feita por Clara Nasc, tatuadora em Belo Horizonte'
} as const;
