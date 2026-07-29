export interface PortfolioCategory {
  id: string;
  label: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  alt: string;
  /**
   * Texto de apoio do item. Ainda não é renderizado na home — será consumido
   * pelas páginas por nicho (Issue 5), onde cada item ganha legenda própria.
   * Não remova como código morto: o conteúdo é autoral.
   */
  description?: string;
}

/**
 * Ordem intencional: Blackwork primeiro, porque é a especialidade da Clara.
 * A ordem aparece nos filtros da galeria e é reaproveitada no schema JSON-LD,
 * então ela comunica prioridade tanto para a visitante quanto para o Google.
 */
export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'all', label: 'Todos' },
  { id: 'blackwork', label: 'Blackwork' },
  { id: 'fineline', label: 'Fine Line' },
  { id: 'botanico', label: 'Botânico' },
  { id: 'geek', label: 'Geek & Animes' },
  { id: 'coberturas', label: 'Coberturas' }
];

/**
 * As três imagens da vitrine do hero, em ordem: a primeira é a grande.
 *
 * Escolha deliberada — a primeira deve ser um Blackwork, que é a especialidade,
 * e as outras duas mostram leque de estilos. Troque os ids aqui para mudar a
 * vitrine sem mexer no componente.
 *
 * TODO(clara): reapontar para as fotos reais quando o portfólio for atualizado.
 */
export const HERO_SHOWCASE_IDS = [3, 1, 4] as const;

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Floral Lavender & Ramalhetes',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: '/portfolio/tattoo1.webp',
    alt: 'Tatuagem delicada de ramos de lavanda em traço fino (Fine Line) por Clara Nasc em Belo Horizonte',
    description: 'Composição fluida acompanhando a anatomia do antebraço.'
  },
  {
    id: 2,
    title: 'Ramo Botânico & Orquídeas',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: '/portfolio/tattoo5.webp',
    alt: 'Tatuagem botânica autoral de orquídea com traço fino e acabamento delicado',
    description: 'Elementos florais orgânicos e traços suaves.'
  },
  {
    id: 3,
    title: 'Shadow Serpent & Botânica Dark',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: '/portfolio/tattoo2.webp',
    alt: 'Tatuagem de serpente entre folhagens detalhada em estilo Blackwork autoral',
    description: 'Contraste marcante de sombras e textura de preenchimento.'
  },
  {
    id: 4,
    title: 'Símbolo Geek & Ilustração Anime',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: '/portfolio/tattoo4.webp',
    alt: 'Tatuagem no estilo Geek e Anime com linhas finas e sombreamento preciso',
    description: 'Ilustração inspirada na cultura pop e animes.'
  },
  {
    id: 5,
    title: 'Cobertura Autoral com Arte Fluida',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: '/portfolio/tattoo3.webp',
    alt: 'Cobertura de tatuagem antiga (Cover-up) com arte ornamental e fluxo anatômico',
    description: 'Projeto de reestruturação visual e cobertura de marca anterior.'
  },
  {
    id: 6,
    title: 'Mini Ilustração Delicada Fine Line',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: '/portfolio/tattoo6.webp',
    alt: 'Tatuagem minimalista em fine line com traços limpos e elegantes',
    description: 'Minimalismo contemporâneo e linhas perfeitas.'
  }
];

/**
 * Itens da vitrine do hero, resolvidos a partir de `HERO_SHOWCASE_IDS`.
 *
 * O `filter` garante que um id inexistente não gere buraco na vitrine, e o
 * `sort` preserva a ordem declarada em HERO_SHOWCASE_IDS (a ordem do array de
 * itens é irrelevante aqui).
 */
export const heroShowcase: PortfolioItem[] = HERO_SHOWCASE_IDS.map((id) =>
  portfolioItems.find((item) => item.id === id)
).filter((item): item is PortfolioItem => item !== undefined);
