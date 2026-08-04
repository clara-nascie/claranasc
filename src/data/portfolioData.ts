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
import coberturaFullmetal from '../assets/portfolio/cobertura-fullmetal-alchemist-braco.webp';
import coberturaGuitarra from '../assets/portfolio/cobertura-guitarra-trash-polka-braco.webp';
import coberturaMargaridas from '../assets/portfolio/cobertura-margaridas-braco.webp';
import coberturaAguaViva from '../assets/portfolio/cobertura-agua-viva-panturrilha.webp';
import coberturaPlanetas from '../assets/portfolio/cobertura-planetas-ombro.webp';
import coberturaFloresColuna from '../assets/portfolio/cobertura-flores-coluna.webp';
import coberturaCoracao from '../assets/portfolio/cobertura-coracao-anatomico-braco.webp';
import coberturaAguaVivaLado from '../assets/portfolio/cobertura-agua-viva-panturrilha-de-lado.webp';

// --- Botânico ---
import botanicoRamo from '../assets/portfolio/botanico-ramo-ombro.webp';
import botanicoSempreViva from '../assets/portfolio/botanico-sempre-viva-clavicula.webp';
import botanicoFloresCostas from '../assets/portfolio/botanico-flores-costas.webp';
import botanicoBracadeira from '../assets/portfolio/botanico-bracadeira-floral-antebraco.webp';
import botanicoFolhasFlores from '../assets/portfolio/botanico-folhas-flores-braco.webp';
import botanicoGirassol from '../assets/portfolio/botanico-girassol-costela.webp';
import botanicoLettering from '../assets/portfolio/botanico-flores-e-lettering-antebraco.webp';
import botanicoRamoFolhas from '../assets/portfolio/botanico-ramo-folhas-antebraco.webp';
import botanicoCafe from '../assets/portfolio/botanico-ramo-de-cafe-punho.webp';
import botanicoMargarida from '../assets/portfolio/botanico-margarida-colorida-antebraco.webp';
import botanicoBuqueDeNoiva from '../assets/portfolio/botanico-ramo-de-buque-de-noiva-braco.webp';
import botanicoLetteringFrente from '../assets/portfolio/botanico-flores-e-lettering-antebraco-de-frente.webp';
import botanicoRamoOutroLado from '../assets/portfolio/botanico-ramo-folhas-antebraco-outro-lado.webp';
import botanicoFloralDelicado from '../assets/portfolio/botanico-floral-delicado-braco.webp';
import botanicoBracadeiraCompleta from '../assets/portfolio/botanico-bracadeira-floral-antebraco-completa.webp';

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

// IMPORTS-AUTOMATICOS — o `scripts/importar-fotos.mjs --aplicar` escreve aqui.
// Não remova o marcador nem escreva abaixo dele à mão.
import geekHeadstockEFitaCassetePanturrilha from '../assets/portfolio/geek-headstock-e-fita-cassete-panturrilha.webp';
import geekOnePiecePersonagemAntebraco from '../assets/portfolio/geek-one-piece-personagem-antebraco.webp';
import geekJackSkellingtonAntebraco from '../assets/portfolio/geek-jack-skellington-antebraco.webp';
import geekCenaDeAnimeEmAquarelaPanturrilha from '../assets/portfolio/geek-cena-de-anime-em-aquarela-panturrilha.webp';
import geekPersonagemDeMangaPanturrilha from '../assets/portfolio/geek-personagem-de-manga-panturrilha.webp';
import geekPokemonMeowthAntebraco from '../assets/portfolio/geek-pokemon-meowth-antebraco.webp';
import geekStitchAntebraco from '../assets/portfolio/geek-stitch-antebraco.webp';
import geekSimbolosNasMaos from '../assets/portfolio/geek-simbolos-nas-maos.webp';
import geekEspadaQuebradaAntebraco from '../assets/portfolio/geek-espada-quebrada-antebraco.webp';
import geekPretoSolidoEmNegativoAntebraco from '../assets/portfolio/geek-preto-solido-em-negativo-antebraco.webp';
import geekDarkSoulsFogueiraBraco from '../assets/portfolio/geek-dark-souls-fogueira-braco.webp';
import geekCranioComChifresPanturrilha from '../assets/portfolio/geek-cranio-com-chifres-panturrilha.webp';
import geekCartaDeTaroDeathPanturrilha from '../assets/portfolio/geek-carta-de-taro-death-panturrilha.webp';
import geekCoringaEmCartaDeBaralhoPanturrilha from '../assets/portfolio/geek-coringa-em-carta-de-baralho-panturrilha.webp';
import geekSimboloEmVermelhoAntebraco from '../assets/portfolio/geek-simbolo-em-vermelho-antebraco.webp';
import geekRpgD20RollInitiativeAntebraco from '../assets/portfolio/geek-rpg-d20-roll-initiative-antebraco.webp';
import geekDoisPersonagensDeAnimePanturrilha from '../assets/portfolio/geek-dois-personagens-de-anime-panturrilha.webp';
import geekNarutoEmQuadroAntebraco from '../assets/portfolio/geek-naruto-em-quadro-antebraco.webp';
import geekBerserkMarcaDoSacrificioPescoco from '../assets/portfolio/geek-berserk-marca-do-sacrificio-pescoco.webp';
import geekHomemAranhaEmQuadroAntebraco from '../assets/portfolio/geek-homem-aranha-em-quadro-antebraco.webp';
import geekSimboloCircularPeito from '../assets/portfolio/geek-simbolo-circular-peito.webp';
import geekOnePieceLetteringPeito from '../assets/portfolio/geek-one-piece-lettering-peito.webp';
import geekOnePiecePeitoCompleto from '../assets/portfolio/geek-one-piece-peito-completo.webp';
import geekPersonagensEmAquarelaPerna from '../assets/portfolio/geek-personagens-em-aquarela-perna.webp';
import geekCalciferAntebraco from '../assets/portfolio/geek-calcifer-antebraco.webp';
import geekDeadpoolQuadrinhoAntebraco from '../assets/portfolio/geek-deadpool-quadrinho-antebraco.webp';
import geekBobEsponjaNoLapisBraco from '../assets/portfolio/geek-bob-esponja-no-lapis-braco.webp';
import geekColagemRetroAntebraco from '../assets/portfolio/geek-colagem-retro-antebraco.webp';
import geekManoplaDoInfinitoAntebraco from '../assets/portfolio/geek-manopla-do-infinito-antebraco.webp';
import geekPokemonLinhaDoCharmanderAntebraco from '../assets/portfolio/geek-pokemon-linha-do-charmander-antebraco.webp';
import geekSenhorDosAneisEspadaArcoMachadoAntebraco from '../assets/portfolio/geek-senhor-dos-aneis-espada-arco-machado-antebraco.webp';
import geekSenhorDosAneisEspadaArcoMachadoAntebracoDeLado from '../assets/portfolio/geek-senhor-dos-aneis-espada-arco-machado-antebraco-de-lado.webp';
import geekBioshockFarolPanturrilha from '../assets/portfolio/geek-bioshock-farol-panturrilha.webp';
import geekTheWitcherMedalhaoPanturrilha from '../assets/portfolio/geek-the-witcher-medalhao-panturrilha.webp';
import geekCenaDeCoelhosAntebraco from '../assets/portfolio/geek-cena-de-coelhos-antebraco.webp';
import geekTRexPunkPerna from '../assets/portfolio/geek-t-rex-punk-perna.webp';
import geekLifeIsStrangeBorboletaPanturrilha from '../assets/portfolio/geek-life-is-strange-borboleta-panturrilha.webp';
import geekPersonagemEmCirculoDeChamasPanturrilha from '../assets/portfolio/geek-personagem-em-circulo-de-chamas-panturrilha.webp';
import geekVanEmBlackworkCoxa from '../assets/portfolio/geek-van-em-blackwork-coxa.webp';
import geekCenaEmMolduraCircularPanturrilha from '../assets/portfolio/geek-cena-em-moldura-circular-panturrilha.webp';

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
   * Marca a foto como parte da **camada de destaque**: as que aparecem na home.
   *
   * A home mostra 6 por categoria, igual para todas, para nenhuma pesar mais
   * que outra no que se vê primeiro. As páginas por nicho mostram tudo, sem
   * cota. Sem esta marca a home cresceria junto com o acervo — no primeiro
   * lote importado ela pulou de 30 para 36 fotos.
   *
   * Para trocar o que aparece na home, mova o `destaque: true` de uma foto
   * para outra da mesma categoria. Mantenha 6 por categoria.
   */
  destaque?: boolean;
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
    destaque: true,
    title: 'Girassol em Pontilhismo',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaGirassol,
    alt: 'Cobertura de tatuagem antiga com girassol em pontilhismo no ombro e clavícula',
    description: 'Pontilhismo denso no miolo da flor para apagar o traço anterior sem endurecer o desenho.'
  },
  {
    id: 2,
    destaque: true,
    title: 'Crisântemo no Ombro',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaCrisantemo,
    alt: 'Cobertura de tatuagem com crisântemo e pequenas flores cobrindo o ombro',
    description: 'As pétalas em camadas dão volume suficiente para esconder marcas antigas.'
  },
  {
    id: 3,
    destaque: true,
    title: 'Onça entre Flores',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaOnca,
    alt: 'Cobertura em braço fechado com rosto de onça entre flores em preto e cinza',
    description: 'Braço fechado: a mancha da onça resolve as áreas de maior saturação da tatuagem coberta.'
  },
  {
    id: 4,
    destaque: true,
    title: 'Floral no Peito',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFloralPeito,
    alt: 'Cobertura de tatuagem com composição floral no peito',
    description: 'Composição simétrica que acompanha as clavículas e distribui o peso do preto.'
  },
  {
    id: 5,
    destaque: true,
    title: 'Samurai em Braço Fechado',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaSamurai,
    alt: 'Cobertura de tatuagem com  samurai, montanhas e torii em braço fechado',
    description: 'Cena inteira construída por cima do trabalho anterior, do ombro ao cotovelo.'
  },
  {
    id: 6,
    destaque: true,
    title: 'Fullmetal Alchemist',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFullmetal,
    alt: 'Cobertura de tatuagem de Fullmetal Alchemist com círculo de transmutação e personagens em braço fechado',
    description: 'Cena inteira construída por cima do trabalho anterior, com o círculo de transmutação ancorando a composição.'
  },
  /*
    A partir daqui, a camada de volume (Issue #16). Os ids seguem a ordem de
    importação e não a posição no array — 31 vem depois de 6 porque 7 a 30 já
    estavam em uso. Só a unicidade importa: o id indexa o lightbox e o
    HERO_SHOWCASE_IDS, nunca a ordem de exibição. Renumerar quebraria o hero.
  */
  {
    id: 31,
    title: 'Guitarra em Trash Polka',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaGuitarra,
    alt: 'Cobertura de tatuagem em trash polka com guitarra, letras e respingos vermelhos no braço, do ombro ao bíceps'
  },
  {
    id: 32,
    title: 'Margaridas no Braço',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaMargaridas,
    alt: 'Cobertura de tatuagem com margaridas e folhagem em preto e cinza no braço, sobre o tríceps'
  },
  {
    id: 33,
    title: 'Água-viva na Panturrilha',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaAguaViva,
    alt: 'Cobertura de tatuagem com água-viva em preto e cinza cobrindo a panturrilha'
  },
  {
    id: 34,
    title: 'Planetas no Ombro',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaPlanetas,
    alt: 'Cobertura de tatuagem com planetas e cauda de cometa em pontilhismo no ombro e clavícula'
  },
  {
    id: 35,
    title: 'Flores na Coluna',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFloresColuna,
    alt: 'Cobertura de tatuagem com ramo de flores em traço fino na parte alta das costas'
  },
  {
    id: 36,
    title: 'Coração Anatômico',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaCoracao,
    alt: 'Cobertura de tatuagem com coração anatômico e linha de eletrocardiograma no braço, sobre o bíceps'
  },
  {
    id: 46,
    title: 'Cobertura com Água-viva',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaAguaVivaLado,
    alt: 'Cobertura de tatuagem com água-viva em preto e cinza na panturrilha, vista pela lateral da perna'
  },

  // ITENS-AUTOMATICOS — o `scripts/importar-fotos.mjs --aplicar` escreve aqui.
  // A partir deste ponto os itens vêm na ordem de importação, não por
  // categoria: a página filtra por `category`, então a ordem no array não
  // muda nada do que aparece na tela.
  {
    id: 67,
    title: 'Headstock e Fita Cassete',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekHeadstockEFitaCassetePanturrilha,
    alt: 'Tatuagem geek de braço de violão com fita cassete e folhagem, em blackwork na panturrilha'
  },
  {
    id: 68,
    title: 'Personagem de One Piece',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePiecePersonagemAntebraco,
    alt: 'Tatuagem geek de One Piece com personagem de chapéu malhado e espada, em cores no antebraço'
  },
  {
    id: 69,
    title: 'Jack Skellington',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekJackSkellingtonAntebraco,
    alt: 'Tatuagem geek de Jack Skellington, de O Estranho Mundo de Jack, em blackwork no antebraço'
  },
  {
    id: 70,
    title: 'Cena de Anime em Aquarela',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCenaDeAnimeEmAquarelaPanturrilha,
    alt: 'Tatuagem geek com cena de anime em aquarela colorida na panturrilha'
  },
  {
    id: 71,
    title: 'Personagem de Mangá',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPersonagemDeMangaPanturrilha,
    alt: 'Tatuagem geek de personagem de mangá com sorriso largo, em preto e cinza na panturrilha'
  },
  {
    id: 72,
    title: 'Meowth',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPokemonMeowthAntebraco,
    alt: 'Tatuagem geek de Pokémon com o Meowth em pontilhismo no antebraço'
  },
  {
    id: 73,
    title: 'Stitch',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekStitchAntebraco,
    alt: 'Tatuagem geek do Stitch, de Lilo & Stitch, em pontilhismo no antebraço'
  },
  {
    id: 74,
    title: 'Símbolos nas Mãos',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSimbolosNasMaos,
    alt: 'Tatuagem geek com símbolos minimalistas em preto sólido nas mãos de duas pessoas'
  },
  {
    id: 75,
    title: 'Espada Quebrada',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekEspadaQuebradaAntebraco,
    alt: 'Tatuagem geek de espada quebrada em preto e cinza no antebraço'
  },
  {
    id: 76,
    title: 'Preto Sólido em Negativo',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPretoSolidoEmNegativoAntebraco,
    alt: 'Tatuagem geek em preto sólido contornando o antebraço, com o desenho aparecendo pelo negativo da pele'
  },
  {
    id: 77,
    title: 'Fogueira',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDarkSoulsFogueiraBraco,
    alt: 'Tatuagem geek de Dark Souls com espada cravada na fogueira, em preto e cinza no braço'
  },
  {
    id: 78,
    title: 'Crânio com Chifres',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCranioComChifresPanturrilha,
    alt: 'Tatuagem geek de crânio com chifres em blackwork e pontilhismo na panturrilha'
  },
  {
    id: 79,
    title: 'Carta de Tarô Death',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCartaDeTaroDeathPanturrilha,
    alt: 'Tatuagem geek de carta de tarô Death com figura em cores na panturrilha'
  },
  {
    id: 80,
    title: 'Coringa em Carta de Baralho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCoringaEmCartaDeBaralhoPanturrilha,
    alt: 'Tatuagem geek do Coringa dentro de uma carta de baralho, colorida na panturrilha'
  },
  {
    id: 81,
    title: 'Símbolo em Vermelho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSimboloEmVermelhoAntebraco,
    alt: 'Tatuagem geek de símbolo em traço pincelado, em vermelho sólido, no antebraço'
  },
  {
    id: 82,
    title: 'Roll Initiative',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekRpgD20RollInitiativeAntebraco,
    alt: 'Tatuagem geek de RPG com dado d20, coruja e a fita Roll Initiative, em blackwork no antebraço'
  },
  {
    id: 83,
    title: 'Dois Personagens',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDoisPersonagensDeAnimePanturrilha,
    alt: 'Tatuagem geek com dois personagens de anime lado a lado, em traço fino na panturrilha'
  },
  {
    id: 84,
    title: 'Naruto em Quadro',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekNarutoEmQuadroAntebraco,
    alt: 'Tatuagem geek de Naruto em quadro com chakra em chamas, em traço fino no antebraço'
  },
  {
    id: 85,
    title: 'Marca do Sacrifício',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBerserkMarcaDoSacrificioPescoco,
    alt: 'Tatuagem geek de Berserk com a marca do sacrifício em preto sólido no pescoço'
  },
  {
    id: 86,
    title: 'Homem-Aranha em Quadro',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekHomemAranhaEmQuadroAntebraco,
    alt: 'Tatuagem geek do Homem-Aranha entre prédios, em quadro com traço fino, no antebraço'
  },
  {
    id: 47,
    title: 'Símbolo em Blackwork no Peito',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSimboloCircularPeito,
    alt: 'Tatuagem geek de símbolo circular em traço pincelado e preto sólido no peito'
  },
  {
    id: 48,
    title: '3D2Y e ASCE',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePieceLetteringPeito,
    alt: 'Tatuagem geek de One Piece com as inscrições 3D2Y e ASCE em lettering no peito'
  },
  {
    id: 49,
    title: 'Peito Fechado em One Piece',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePiecePeitoCompleto,
    alt: 'Tatuagem geek de One Piece no peito, com símbolo circular e lettering 3D2Y e ASCE, vista completa'
  },
  {
    id: 50,
    title: 'Personagens em Aquarela',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPersonagensEmAquarelaPerna,
    alt: 'Tatuagem geek de personagens de animação em aquarela colorida na perna'
  },
  {
    id: 51,
    title: 'Calcifer',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCalciferAntebraco,
    alt: 'Tatuagem geek do Calcifer, de O Castelo Animado, em cores no antebraço'
  },
  {
    id: 52,
    title: 'Deadpool em Quadrinho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDeadpoolQuadrinhoAntebraco,
    alt: 'Tatuagem geek do Deadpool em quadro de história em quadrinhos com a legenda Maximum Effort, no antebraço'
  },
  {
    id: 53,
    title: 'Bob Esponja no Lápis',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBobEsponjaNoLapisBraco,
    alt: 'Tatuagem geek do Bob Esponja em traço de rabisco pendurado em um lápis, em blackwork no braço'
  },
  {
    id: 54,
    title: 'Colagem Retrô',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekColagemRetroAntebraco,
    alt: 'Tatuagem geek em colagem de eletrônicos antigos, robô e gato, com detalhes coloridos no antebraço'
  },
  {
    id: 55,
    title: 'Manopla do Infinito',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekManoplaDoInfinitoAntebraco,
    alt: 'Tatuagem geek da Manopla do Infinito em traço fino com a frase Parte da jornada é o fim, no antebraço'
  },
  {
    id: 56,
    title: 'Linha Evolutiva do Charmander',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPokemonLinhaDoCharmanderAntebraco,
    alt: 'Tatuagem geek de Pokémon com Charmander, Charmeleon e Charizard e chamas em laranja, no antebraço'
  },
  {
    id: 57,
    title: 'Espada, Arco e Machado',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSenhorDosAneisEspadaArcoMachadoAntebraco,
    alt: 'Tatuagem geek de O Senhor dos Anéis com espada, arco e machado e a frase You have my sword, no antebraço'
  },
  {
    id: 58,
    title: 'Espada, Arco e Machado, de Lado',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSenhorDosAneisEspadaArcoMachadoAntebracoDeLado,
    alt: 'Tatuagem geek de O Senhor dos Anéis com espada, arco e machado no antebraço, vista pela lateral'
  },
  {
    id: 59,
    title: 'Farol de BioShock',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBioshockFarolPanturrilha,
    alt: 'Tatuagem geek de BioShock com farol e a frase No gods or kings, only man, em pontilhismo na panturrilha'
  },
  {
    id: 60,
    title: 'Medalhão do Bruxo',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTheWitcherMedalhaoPanturrilha,
    alt: 'Tatuagem geek de The Witcher com o medalhão do lobo e as duas espadas, em blackwork na panturrilha'
  },
  {
    id: 61,
    title: 'Cena de Coelhos',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCenaDeCoelhosAntebraco,
    alt: 'Tatuagem geek com cena de coelhos e figuras em pontilhismo, com respingos em vermelho, no antebraço'
  },
  {
    id: 62,
    title: 'T-Rex Punk',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTRexPunkPerna,
    alt: 'Tatuagem geek de T-Rex punk com moicano colorido e lettering em grafite, na perna'
  },
  {
    id: 63,
    title: 'Borboleta e Polaroid',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekLifeIsStrangeBorboletaPanturrilha,
    alt: 'Tatuagem geek de Life is Strange com polaroid e borboleta azul em aquarela, na panturrilha'
  },
  {
    id: 64,
    title: 'Personagem em Círculo de Chamas',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPersonagemEmCirculoDeChamasPanturrilha,
    alt: 'Tatuagem geek de personagem de anime correndo dentro de um círculo de chamas em vermelho, na panturrilha'
  },
  {
    id: 65,
    title: 'Van em Blackwork',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekVanEmBlackworkCoxa,
    alt: 'Tatuagem geek de van antiga vista de frente, em blackwork com pontilhismo, na coxa'
  },
  {
    id: 66,
    title: 'Cena em Moldura Circular',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCenaEmMolduraCircularPanturrilha,
    alt: 'Tatuagem geek com figura feminina e ave dentro de moldura circular, em blackwork na panturrilha'
  },

  // --------------------------------------------------------------- Botânico
  {
    id: 7,
    destaque: true,
    title: 'Ramo Botânico no Ombro',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoRamo,
    alt: 'Tatuagem botânica de ramo com folhas descendo do ombro pelo braço',
    description: 'O ramo acompanha a curva do deltoide em vez de disputar com ela.'
  },
  {
    id: 8,
    destaque: true,
    title: 'Sempre-viva na Clavícula',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoSempreViva,
    alt: 'Tatuagem botânica de sempre-viva em traço fino sobre a clavícula',
    description: 'Florzinhas em pontos finos e separados, que envelhecem melhor do que linhas muito próximas.'
  },
  {
    id: 9,
    destaque: true,
    title: 'Floral nas Costas',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFloresCostas,
    alt: 'Tatuagem botânica com flores e folhas atravessando as costas e o ombro',
    description: 'Desenho aberto, pensado para receber continuação no braço mais tarde.'
  },
  {
    id: 10,
    destaque: true,
    title: 'Braçadeira Floral',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoBracadeira,
    alt: 'Tatuagem botânica em forma de braçadeira floral contornando o antebraço',
    description: 'Fecha a volta do antebraço sem virar faixa cheia, mantendo pele respirando entre os elementos.'
  },
  {
    id: 11,
    destaque: true,
    title: 'Folhas e Flores no Braço',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFolhasFlores,
    alt: 'Tatuagem botânica de folhas e flores em traço fino no braço',
    description: 'Folhagem em traço fino com sombreado leve só nas bordas.'
  },
  {
    id: 12,
    destaque: true,
    title: 'Girassol na Costela',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoGirassol,
    alt: 'Tatuagem de girassol com folhas na lateral da costela',
    description: 'Região sensível, resolvida em uma sessão com linha contínua e pouco preenchimento.'
  },
  {
    id: 37,
    title: 'Flores e Lettering',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoLettering,
    alt: 'Tatuagem botânica com flores em traço fino e a palavra Família em lettering no antebraço'
  },
  {
    id: 38,
    title: 'Ramo de Folhas no Antebraço',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoRamoFolhas,
    alt: 'Tatuagem botânica de ramo com folhas contornando o antebraço, em traço fino com pontilhismo'
  },
  {
    id: 39,
    title: 'Ramo de Café',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoCafe,
    alt: 'Tatuagem botânica de ramo de café com frutos e folhas em pontilhismo, contornando o punho'
  },
  {
    id: 40,
    title: 'Margarida',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoMargarida,
    alt: 'Tatuagem botânica de margarida com miolo amarelo e folhas verdes no antebraço'
  },
  {
    id: 41,
    title: 'Ramo de Buquê-de-noiva',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoBuqueDeNoiva,
    alt: 'Tatuagem botânica de ramo de buquê-de-noiva em traço fino no braço, acima do cotovelo'
  },
  /*
    As quatro abaixo são outras vistas de peças que já aparecem acima ou no
    destaque. Não são repetição: uma tatuagem que dá a volta no braço não cabe
    em uma foto só, e cada ângulo mostra o que o outro esconde. Decisão da
    Clara — não "limpe" isso achando que é duplicata.
  */
  {
    id: 42,
    title: 'Flores e Fineline',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoLetteringFrente,
    alt: 'Tatuagem botânica com flores em traço fino e lettering no antebraço, vista de frente'
  },
  {
    id: 43,
    title: 'Volta do Ramo no Antebraço',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoRamoOutroLado,
    alt: 'Tatuagem botânica de ramo com folhas dando a volta no antebraço, vista pelo lado interno'
  },
  {
    id: 44,
    title: 'Floral Delicado',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFloralDelicado,
    alt: 'Tatuagem botânica de floral delicado em traço fino no braço, acima do cotovelo'
  },
  {
    id: 45,
    title: 'Braçadeira Floral Completa',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoBracadeiraCompleta,
    alt: 'Tatuagem botânica em braçadeira floral com ramo fino contornando o antebraço, vista completa'
  },

  // ----------------------------------------------------------- Geek & Animes
  {
    id: 13,
    destaque: true,
    title: 'Torre e Anel',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTorre,
    alt: 'Tatuagem geek de torre sombria e anel dentro de moldura em blackwork, no ombro',
    description: 'Moldura em preto sólido contra pontilhismo no interior — o contraste é o que dá profundidade à cena.'
  },
  {
    id: 14,
    destaque: true,
    title: 'Gato de Cheshire nas Costas',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCheshire,
    alt: 'Tatuagem do Gato de Cheshire com xícaras e cogumelos ocupando as costas',
    description: 'Peça grande de costas, com os elementos empilhados seguindo a coluna.'
  },
  {
    id: 15,
    destaque: true,
    title: 'Coringa no Braço',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCoringa,
    alt: 'Tatuagem do Coringa em preto e cinza cobrindo o braço',
    description: 'Alto contraste para o rosto continuar legível de longe.'
  },
  {
    id: 16,
    destaque: true,
    title: 'Dragão com Detalhe em Vermelho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDragao,
    alt: 'Tatuagem de dragão oriental no antebraço com detalhes pontuais em vermelho',
    description: 'O vermelho aparece em três pontos só, para marcar sem competir com o preto.'
  },
  {
    id: 17,
    destaque: true,
    title: 'Árvore Branca no Ombro',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekArvore,
    alt: 'Tatuagem de árvore branca com espada e inscrições élficas no ombro',
    description: 'Negativo trabalhado: a árvore é a pele, não a tinta.'
  },
  {
    id: 18,
    destaque: true,
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
    destaque: true,
    title: 'Lobo Geométrico',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkLobo,
    alt: 'Tatuagem blackwork de lobo dividido entre realismo e formas geométricas no braço',
    description: 'Metade em pontilhismo, metade em geometria sólida, separadas por uma única linha reta.'
  },
  {
    id: 20,
    destaque: true,
    title: 'Faixas em Preto Sólido',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkFaixas,
    alt: 'Tatuagem blackwork de faixas em preto sólido envolvendo o antebraço',
    description: 'Preto chapado sem contorno: o desenho é feito pelo vazio entre as faixas.'
  },
  {
    id: 21,
    destaque: true,
    title: 'Vegvisir e Corvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkVegvisir,
    alt: 'Tatuagem blackwork de bússola viking vegvisir com corvo em preto sólido no ombro',
    description: 'Runas em traço seco contra o corvo totalmente preenchido.'
  },
  {
    id: 22,
    destaque: true,
    title: 'Máscara Tribal',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMascara,
    alt: 'Tatuagem blackwork de máscara tribal ocupando o braço inteiro',
    description: 'Braço fechado em uma peça só, com textura construída por hachura.'
  },
  {
    id: 23,
    destaque: true,
    title: 'Tucano em Losango',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkTucano,
    alt: 'Tatuagem blackwork de tucano e paisagem dentro de moldura em losango, no braço',
    description: 'Moldura fechada obriga a paisagem a caber — é o que segura a composição.'
  },
  {
    id: 24,
    destaque: true,
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
    destaque: true,
    title: 'Figura entre Nuvens',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineFigura,
    alt: 'Tatuagem fine line de figura feminina entre nuvens pontilhadas no antebraço',
    description: 'Traço fino contínuo com as nuvens em pontilhismo — volume sem engrossar a linha.'
  },
  {
    id: 26,
    destaque: true,
    title: 'Medusa',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMedusa,
    alt: 'Tatuagem fine line de Medusa com serpentes no abdômen',
    description: 'Fine line com sombreado interno, que é o que dá relevo às serpentes.'
  },
  {
    id: 27,
    destaque: true,
    title: 'Espelho e Tesoura',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEspelho,
    alt: 'Tatuagem fine line de espelho de mão, tesoura e flores nas costas',
    description: 'Objetos cruzados formando um X, centralizados entre as escápulas.'
  },
  {
    id: 28,
    destaque: true,
    title: 'Livros e Cartola',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLivros,
    alt: 'Tatuagem fine line de pilha de livros, cartola e cartas na coxa',
    description: 'Narrativa inteira construída só com linha e pontos, sem preenchimento sólido.'
  },
  {
    id: 29,
    destaque: true,
    title: 'Borboleta',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBorboleta,
    alt: 'Tatuagem fine line de borboleta com asas detalhadas no antebraço',
    description: 'Asas em linha fina com o corpo em preto para ancorar o desenho.'
  },
  {
    id: 30,
    destaque: true,
    title: 'Cavalo',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCavalo,
    alt: 'Tatuagem fine line de cabeça de cavalo em traço contínuo nas costas',
    description: 'Economia de traço: a crina é sugerida, não desenhada.'
  }
];

/**
 * A camada de destaque: o que a home mostra.
 *
 * 6 por categoria, igual para todas. As páginas por nicho consomem
 * `portfolioItems` inteiro, sem cota — é o que separa "equilibrar as
 * categorias" de "mostrar volume de trabalho" sem ter que escolher um dos dois.
 */
export const itensDestaque: PortfolioItem[] = portfolioItems.filter((item) => item.destaque);

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
