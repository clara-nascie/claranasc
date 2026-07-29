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

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'all', label: 'Todos' },
  { id: 'fineline', label: 'Fine Line' },
  { id: 'botanico', label: 'Botânico' },
  { id: 'blackwork', label: 'Blackwork' },
  { id: 'geek', label: 'Geek & Animes' },
  { id: 'coberturas', label: 'Coberturas' }
];

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
