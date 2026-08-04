/**
 * As imagens são **importadas**, não referenciadas por caminho de texto.
 *
 * Isso não é detalhe de estilo: só o que entra por `import` de dentro de `src/`
 * passa pelo pipeline do `astro:assets`, que gera as variantes responsivas em
 * WebP no build. Arquivo em `public/` é copiado byte a byte para o `dist/` —
 * o navegador da visitante receberia a foto original inteira.
 *
 * Os arquivos aqui já vêm reduzidos para caber em 1600px, que é o suficiente
 * para a maior variante que o site pede (o lightbox, 1400px). Os originais de
 * até 9000px ficam fora do repositório, em Anúncios/ (ver .gitignore).
 *
 * O nome do arquivo é conteúdo, não identificador: `cobertura-girassol-ombro`
 * descreve a foto para quem busca por imagem. Ao trocar uma foto, troque o
 * nome junto.
 */

// --- Coberturas ---
import coberturaGirassol from '../assets/portfolio/cobertura-girassol-ombro.webp';
import coberturaCrisantemo from '../assets/portfolio/cobertura-crisantemo-ombro.webp';
import coberturaOnca from '../assets/portfolio/cobertura-onca-flores-braco.webp';
import coberturaFloralPeito from '../assets/portfolio/cobertura-floral-peito.webp';
import coberturaSamurai from '../assets/portfolio/cobertura-samurai-braco.webp';
import coberturaGeometrica from '../assets/portfolio/cobertura-composicao-geometrica-braco.webp';

// --- Botânico ---
import botanicoRamo from '../assets/portfolio/botanico-ramo-ombro.webp';
import botanicoDenteDeLeao from '../assets/portfolio/botanico-dente-de-leao-clavicula.webp';
import botanicoFloresCostas from '../assets/portfolio/botanico-flores-costas.webp';
import botanicoBracadeira from '../assets/portfolio/botanico-bracadeira-floral-antebraco.webp';
import botanicoFolhasFlores from '../assets/portfolio/botanico-folhas-flores-braco.webp';
import botanicoGirassol from '../assets/portfolio/botanico-girassol-costela.webp';

// --- Geek & Animes ---
import geekTorre from '../assets/portfolio/geek-torre-e-anel-ombro.webp';
import geekCheshire from '../assets/portfolio/geek-gato-de-cheshire-costas.webp';
import geekCoringa from '../assets/portfolio/geek-coringa-braco.webp';
import geekDragao from '../assets/portfolio/geek-dragao-vermelho-antebraco.webp';
import geekArvore from '../assets/portfolio/geek-arvore-branca-ombro.webp';
import geekCaveira from '../assets/portfolio/geek-caveira-alada-antebraco.webp';

// --- Blackwork ---
import blackworkLobo from '../assets/portfolio/blackwork-lobo-geometrico-braco.webp';
import blackworkFaixas from '../assets/portfolio/blackwork-faixas-antebraco.webp';
import blackworkVegvisir from '../assets/portfolio/blackwork-vegvisir-corvo-ombro.webp';
import blackworkMascara from '../assets/portfolio/blackwork-mascara-tribal-braco.webp';
import blackworkTucano from '../assets/portfolio/blackwork-tucano-losango-braco.webp';
import blackworkNavio from '../assets/portfolio/blackwork-navio-polvo-coxa.webp';

// --- Fine Line ---
import finelineFigura from '../assets/portfolio/fineline-figura-entre-nuvens-antebraco.webp';
import finelineMedusa from '../assets/portfolio/fineline-medusa-abdomen.webp';
import finelineEspelho from '../assets/portfolio/fineline-espelho-e-tesoura-costas.webp';
import finelineLivros from '../assets/portfolio/fineline-livros-e-cartola-coxa.webp';
import finelineBorboleta from '../assets/portfolio/fineline-borboleta-antebraco.webp';
import finelineCavalo from '../assets/portfolio/fineline-cavalo-costas.webp';

export interface PortfolioCategory {
  id: string;
  label: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  /** `ImageMetadata` vindo do import — o `<Image>` do Astro precisa do objeto,
   *  não da URL. Traz `src`, `width`, `height` e `format` já resolvidos. */
  image: ImageMetadata;
  alt: string;
  /**
   * ⚠️ Não é renderizado em lugar nenhum desde 04/08/2026.
   *
   * Chegou a virar legenda embaixo da foto nas páginas por nicho e a Clara
   * removeu no mesmo dia — "só as fotos fica melhor". Os 30 textos que existem
   * ficam porque são autorais e não custam nada; **fotos novas não precisam
   * deste campo**. O que descreve a foto para o Google e para leitor de tela
   * é o `alt`, que é obrigatório.
   */
  description?: string;
}

/**
 * Ordem intencional — e o motivo mudou.
 *
 * Blackwork continua sendo a especialidade da Clara, mas o objetivo comercial
 * do site é **ampliar o público** para Coberturas, Botânico e Geek, que hoje
 * recebem muito menos procura. Por isso essas três vêm primeiro: a ordem
 * aparece nos filtros e é reaproveitada no JSON-LD, então ela comunica
 * prioridade tanto para a visitante quanto para o Google.
 *
 * Blackwork e Fine Line já trazem público sozinhas e seguem encontráveis logo
 * abaixo. Não reordene "porque Blackwork é a especialidade" — isso já foi
 * tentado e trabalha contra a meta.
 */
export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'all', label: 'Todos' },
  { id: 'coberturas', label: 'Coberturas' },
  { id: 'botanico', label: 'Botânico' },
  { id: 'geek', label: 'Geek & Animes' },
  { id: 'blackwork', label: 'Blackwork' },
  { id: 'fineline', label: 'Fine Line' }
];

/**
 * As três imagens da vitrine do hero, em ordem: a primeira é a grande.
 *
 * Escolha da Clara: o floral no peito na vaga grande, e duas peças de
 * Blackwork nas menores — faixas em preto sólido e vegvisir com corvo.
 *
 * A combinação funciona nos dois sentidos. A foto grande é uma Cobertura, que
 * é justamente a categoria que o site quer fazer crescer, e as duas menores
 * são as peças que melhor sobrevivem à miniatura. Como cada vaga imprime o
 * nome da própria categoria na legenda, o hero também deixa de repetir
 * "Blackwork" três vezes.
 *
 * Troque os ids aqui para mudar a vitrine sem mexer no componente.
 */
export const HERO_SHOWCASE_IDS = [4, 20, 21] as const;

export const portfolioItems: PortfolioItem[] = [
  // ------------------------------------------------------------- Coberturas
  {
    id: 1,
    title: 'Girassol em Pontilhismo',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaGirassol,
    alt: 'Cobertura de tatuagem antiga com girassol em pontilhismo no ombro e clavícula',
    description: 'Pontilhismo denso no miolo da flor para apagar o traço anterior sem endurecer o desenho.'
  },
  {
    id: 2,
    title: 'Crisântemo no Ombro',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaCrisantemo,
    alt: 'Cobertura de tatuagem com crisântemo e pequenas flores cobrindo o ombro',
    description: 'As pétalas em camadas dão volume suficiente para esconder marcas antigas.'
  },
  {
    id: 3,
    title: 'Onça entre Flores',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaOnca,
    alt: 'Cobertura em braço fechado com rosto de onça entre flores em preto e cinza',
    description: 'Braço fechado: a mancha da onça resolve as áreas de maior saturação da tatuagem coberta.'
  },
  {
    id: 4,
    title: 'Floral no Peito',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFloralPeito,
    alt: 'Cobertura de tatuagem com composição floral simétrica no peito',
    description: 'Composição simétrica que acompanha as clavículas e distribui o peso do preto.'
  },
  {
    id: 5,
    title: 'Samurai em Braço Fechado',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaSamurai,
    alt: 'Cobertura de tatuagem com samurai, montanhas e torii em braço fechado',
    description: 'Cena inteira construída por cima do trabalho anterior, do ombro ao cotovelo.'
  },
  {
    id: 6,
    title: 'Composição Geométrica',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaGeometrica,
    alt: 'Cobertura de tatuagem com composição geométrica e figuras em braço fechado',
    description: 'Geometria e pontilhismo dividindo o espaço para reaproveitar áreas já pigmentadas.'
  },

  // --------------------------------------------------------------- Botânico
  {
    id: 7,
    title: 'Ramo Botânico no Ombro',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoRamo,
    alt: 'Tatuagem botânica de ramo com folhas descendo do ombro pelo braço',
    description: 'O ramo acompanha a curva do deltoide em vez de disputar com ela.'
  },
  {
    id: 8,
    title: 'Dente-de-leão na Clavícula',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoDenteDeLeao,
    alt: 'Tatuagem de dente-de-leão em traço fino sobre a clavícula',
    description: 'Sementes soltas em pontos finos, que envelhecem melhor do que linhas muito próximas.'
  },
  {
    id: 9,
    title: 'Flores nas Costas',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFloresCostas,
    alt: 'Tatuagem botânica com flores e folhas atravessando as costas e o ombro',
    description: 'Desenho aberto, pensado para receber continuação no braço mais tarde.'
  },
  {
    id: 10,
    title: 'Braçadeira Floral',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoBracadeira,
    alt: 'Tatuagem botânica em forma de braçadeira floral contornando o antebraço',
    description: 'Fecha a volta do antebraço sem virar faixa cheia, mantendo pele respirando entre os elementos.'
  },
  {
    id: 11,
    title: 'Folhas e Flores no Braço',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFolhasFlores,
    alt: 'Tatuagem botânica de folhas e flores em traço fino no braço',
    description: 'Folhagem em traço fino com sombreado leve só nas bordas.'
  },
  {
    id: 12,
    title: 'Girassol na Costela',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoGirassol,
    alt: 'Tatuagem de girassol com folhas na lateral da costela',
    description: 'Região sensível, resolvida em uma sessão com linha contínua e pouco preenchimento.'
  },

  // ----------------------------------------------------------- Geek & Animes
  {
    id: 13,
    title: 'Torre e Anel',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTorre,
    alt: 'Tatuagem geek de torre sombria e anel dentro de moldura em blackwork, no ombro',
    description: 'Moldura em preto sólido contra pontilhismo no interior — o contraste é o que dá profundidade à cena.'
  },
  {
    id: 14,
    title: 'Gato de Cheshire nas Costas',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCheshire,
    alt: 'Tatuagem do Gato de Cheshire com xícaras e cogumelos ocupando as costas',
    description: 'Peça grande de costas, com os elementos empilhados seguindo a coluna.'
  },
  {
    id: 15,
    title: 'Coringa no Braço',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCoringa,
    alt: 'Tatuagem do Coringa em preto e cinza cobrindo o braço',
    description: 'Alto contraste para o rosto continuar legível de longe.'
  },
  {
    id: 16,
    title: 'Dragão com Detalhe em Vermelho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDragao,
    alt: 'Tatuagem de dragão oriental no antebraço com detalhes pontuais em vermelho',
    description: 'O vermelho aparece em três pontos só, para marcar sem competir com o preto.'
  },
  {
    id: 17,
    title: 'Árvore Branca no Ombro',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekArvore,
    alt: 'Tatuagem de árvore branca com espada e inscrições élficas no ombro',
    description: 'Negativo trabalhado: a árvore é a pele, não a tinta.'
  },
  {
    id: 18,
    title: 'Caveira Alada',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCaveira,
    alt: 'Tatuagem de caveira com asas e correntes no antebraço',
    description: 'Sombreado pesado nas asas para a caveira saltar do fundo.'
  },

  // -------------------------------------------------------------- Blackwork
  {
    id: 19,
    title: 'Lobo Geométrico',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkLobo,
    alt: 'Tatuagem blackwork de lobo dividido entre realismo e formas geométricas no braço',
    description: 'Metade em pontilhismo, metade em geometria sólida, separadas por uma única linha reta.'
  },
  {
    id: 20,
    title: 'Faixas em Preto Sólido',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkFaixas,
    alt: 'Tatuagem blackwork de faixas em preto sólido envolvendo o antebraço',
    description: 'Preto chapado sem contorno: o desenho é feito pelo vazio entre as faixas.'
  },
  {
    id: 21,
    title: 'Vegvisir e Corvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkVegvisir,
    alt: 'Tatuagem blackwork de bússola viking vegvisir com corvo em preto sólido no ombro',
    description: 'Runas em traço seco contra o corvo totalmente preenchido.'
  },
  {
    id: 22,
    title: 'Máscara Tribal',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMascara,
    alt: 'Tatuagem blackwork de máscara tribal ocupando o braço inteiro',
    description: 'Braço fechado em uma peça só, com textura construída por hachura.'
  },
  {
    id: 23,
    title: 'Tucano em Losango',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkTucano,
    alt: 'Tatuagem blackwork de tucano e paisagem dentro de moldura em losango, no braço',
    description: 'Moldura fechada obriga a paisagem a caber — é o que segura a composição.'
  },
  {
    id: 24,
    title: 'Navio e Polvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkNavio,
    alt: 'Tatuagem blackwork de navio, lanterna e polvo na coxa',
    description: 'Três elementos em uma cena só, com os tentáculos costurando o conjunto.'
  },

  // -------------------------------------------------------------- Fine Line
  {
    id: 25,
    title: 'Figura entre Nuvens',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineFigura,
    alt: 'Tatuagem fine line de figura feminina entre nuvens pontilhadas no antebraço',
    description: 'Traço fino contínuo com as nuvens em pontilhismo — volume sem engrossar a linha.'
  },
  {
    id: 26,
    title: 'Medusa',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMedusa,
    alt: 'Tatuagem fine line de Medusa com serpentes no abdômen',
    description: 'Fine line com sombreado interno, que é o que dá relevo às serpentes.'
  },
  {
    id: 27,
    title: 'Espelho e Tesoura',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEspelho,
    alt: 'Tatuagem fine line de espelho de mão, tesoura e flores nas costas',
    description: 'Objetos cruzados formando um X, centralizados entre as escápulas.'
  },
  {
    id: 28,
    title: 'Livros e Cartola',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLivros,
    alt: 'Tatuagem fine line de pilha de livros, cartola e cartas na coxa',
    description: 'Narrativa inteira construída só com linha e pontos, sem preenchimento sólido.'
  },
  {
    id: 29,
    title: 'Borboleta',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBorboleta,
    alt: 'Tatuagem fine line de borboleta com asas detalhadas no antebraço',
    description: 'Asas em linha fina com o corpo em preto para ancorar o desenho.'
  },
  {
    id: 30,
    title: 'Cavalo',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCavalo,
    alt: 'Tatuagem fine line de cabeça de cavalo em traço contínuo nas costas',
    description: 'Economia de traço: a crina é sugerida, não desenhada.'
  }
];

/**
 * Itens da vitrine do hero, resolvidos a partir de `HERO_SHOWCASE_IDS`.
 *
 * O `filter` garante que um id inexistente não gere buraco na vitrine, e a
 * ordem declarada em HERO_SHOWCASE_IDS é preservada (a ordem do array de itens
 * é irrelevante aqui).
 */
export const heroShowcase: PortfolioItem[] = HERO_SHOWCASE_IDS.map((id) =>
  portfolioItems.find((item) => item.id === id)
).filter((item): item is PortfolioItem => item !== undefined);
