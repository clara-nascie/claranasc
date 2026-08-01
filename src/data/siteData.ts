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
 * Dados reais informados pela Clara em 01/08/2026.
 */
export const LOCATION = {
  /**
   * Nome do estúdio onde ela atende. Aparece no hero, para a visitante saber
   * de imediato onde fica.
   *
   * ⚠️ Não é o mesmo que `SITE.businessName` ("Clara Nasc Tattoo"), e isso é
   * uma questão em aberto, não um descuido: o schema declara um TattooParlor
   * com o nome dela no endereço de um estúdio que tem nome próprio. Ver a
   * nota em `SOCIAL` — já são três nomes para a mesma entidade.
   */
  studioName: 'Iuna Tattoo',
  streetAddress: 'Av. Brasil, 673, sala 105' as string | null,
  neighborhood: 'Santa Efigênia' as string | null,
  /**
   * Confirmado na base dos Correios (ViaCEP): o trecho "até 999, lado ímpar"
   * da Avenida Brasil em Santa Efigênia é o 30140-000, e 673 é ímpar.
   */
  postalCode: '30140-000' as string | null,
  /**
   * ⚠️ Precisão de VIA, não de prédio. O OpenStreetMap não tem o número 673
   * cadastrado, então este ponto é do trecho da Avenida Brasil em Santa
   * Efigênia com o CEP certo — pode estar algumas dezenas de metros fora.
   *
   * Para trocar pelo ponto exato: Google Maps > clicar sobre o estúdio >
   * copiar lat/long. Vale fazer quando o Google Business Profile for criado,
   * porque aí o ponto exato já vai existir.
   */
  geo: { latitude: -19.9241341, longitude: -43.9214529 } as { latitude: number; longitude: number } | null,

  city: 'Belo Horizonte',
  /** Sigla do estado, como o schema.org espera em addressRegion. */
  region: 'MG',
  regionName: 'Minas Gerais',
  country: 'BR',
  /** Cidades/regiões atendidas — usado em `areaServed`. */
  areaServed: ['Belo Horizonte', 'Nova Lima', 'Contagem', 'Betim', 'Região Metropolitana de Belo Horizonte']
} as const;

/**
 * Endereço em uma linha, para exibir na tela.
 *
 * Existe para o endereço não ser reescrito à mão em componente nenhum: o
 * Google cruza o endereço do site com o do perfil e o de diretórios, e duas
 * grafias diferentes do mesmo lugar enfraquecem essa associação.
 */
export function enderecoLinha(): string {
  return `${LOCATION.streetAddress} · ${LOCATION.neighborhood}, ${LOCATION.city}`;
}

/**
 * Link para o Google Maps a partir do endereço em texto.
 *
 * Busca por endereço, e não por `place_id`: o estúdio ainda não tem ficha no
 * Google ([[sem Business Profile]]), então não existe id para apontar. Quando
 * existir, trocar por `https://www.google.com/maps/place/?q=place_id:...`
 * passa a ser melhor — cai na ficha em vez de num resultado de busca.
 */
export function mapsUrl(): string {
  const consulta = `${LOCATION.studioName}, ${LOCATION.streetAddress}, ${LOCATION.neighborhood}, ${LOCATION.city} - ${LOCATION.region}, ${LOCATION.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/**
 * Perfis sociais oficiais. Viram `sameAs` no JSON-LD, que é como o Google
 * conecta o site à mesma entidade nas outras plataformas.
 *
 * URL completa, não o handle: o valor vai direto para o `sameAs` e para o
 * `href` do rodapé, e os dois precisam de URL.
 *
 * No caso da Clara isto pesa mais que o normal. O Instagram tem histórico,
 * público e conteúdo; o site foi ao ar sem nenhuma impressão no Search
 * Console. Herdar a associação com um perfil já estabelecido é o sinal de
 * entidade mais forte disponível enquanto não existe Google Business Profile.
 *
 * ⚠️ O perfil se chama "Clara Nascimento TATTOO" e o `SITE.businessName` acima
 * diz "Clara Nasc Tattoo". O Google usa consistência de nome para juntar as
 * entidades — vale alinhar os dois quando o Business Profile for criado.
 */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/clara.nasc/' as string | null,
  /** Não use TikTok por ora. Preencher com URL completa, como o Instagram. */
  tiktok: null as string | null
} as const;

/**
 * Horário de atendimento, no formato do schema.org `OpeningHoursSpecification`.
 * Dias válidos: Monday a Sunday, mais `PublicHolidays`.
 *
 * Horário real da Clara, confirmado por ela em 01/08/2026: segunda a sábado
 * **e feriados**, das 11h às 22h.
 *
 * ⚠️ Isto NÃO é horário de porta aberta — ela atende só por agendamento. O
 * schema.org não tem como declarar "somente com hora marcada" (o Google
 * Business Profile tem, quando o perfil for criado), então o que se declara
 * aqui é a janela em que ela trabalha. Não gera expectativa de visita sem
 * aviso porque o site inteiro leva ao formulário e ao WhatsApp: nenhum texto
 * convida a aparecer no estúdio.
 *
 * Os feriados vão numa entrada separada de propósito. `PublicHolidays` é um
 * valor válido de `DayOfWeek` no schema.org, mas é o menos comum dos dois --
 * separado, ele pode ser removido sem tocar na entrada dos dias úteis se algum
 * validador implicar. E é informação que diferencia: a maioria dos estúdios
 * fecha em feriado.
 *
 * Deixe como `null` se deixar de ser o horário real — horário errado no schema
 * gera reclamação de cliente e o Google trata como sinal de baixa qualidade.
 */
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
