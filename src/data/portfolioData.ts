/**
 * ⚠️ As imagens são **importadas**, nunca referenciadas por caminho de texto:
 * só o que entra por `import` de dentro de `src/` passa pelo pipeline do
 * `astro:assets`. Arquivo em `public/` seria servido inteiro, sem variantes.
 *
 * Ver `docs/arquitetura/arquitetura.md`, seção "Pipeline de imagem".
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
import geekAliceNoPais from '../assets/portfolio/geek-alice-no-pais-das-maravilhas-costas.webp';
import geekBerserkGuts from '../assets/portfolio/geek-berserk-guts-braco.webp';
import geekOkamiAmaterasu from '../assets/portfolio/geek-okami-amaterasu-antebraco.webp';
import geekArvore from '../assets/portfolio/geek-arvore-branca-ombro.webp';
import geekBaraggan from '../assets/portfolio/geek-bleach-baraggan-antebraco.webp';

// --- Blackwork ---
import blackworkLobo from '../assets/portfolio/blackwork-lobo-geometrico-braco.webp';
import blackworkEscher from '../assets/portfolio/blackwork-escher-the-rind-antebraco.webp';
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
import finelineSimboloDeCapricornioBraco from '../assets/portfolio/fineline-simbolo-de-capricornio-braco.webp';
import finelineTatuagemDeCasalCruzAntebraco from '../assets/portfolio/fineline-tatuagem-de-casal-cruz-antebraco.webp';
import finelineLetteringLetGoBraco from '../assets/portfolio/fineline-lettering-let-go-braco.webp';
import finelineTatuagemDeIrmasLetteringBraco from '../assets/portfolio/fineline-tatuagem-de-irmas-lettering-braco.webp';
import finelineRosaVermelhaAntebraco from '../assets/portfolio/fineline-rosa-vermelha-antebraco.webp';
import finelineSimboloDeGraduacaoPunho from '../assets/portfolio/fineline-simbolo-de-graduacao-punho.webp';
import finelineTatuagemDeAmigosCopoLagoinhaAntebraco from '../assets/portfolio/fineline-tatuagem-de-amigos-copo-lagoinha-antebraco.webp';
import finelineDigitaisEPatinhaAntebraco from '../assets/portfolio/fineline-digitais-e-patinha-antebraco.webp';
import finelineSimboloDoBtsAntebraco from '../assets/portfolio/fineline-simbolo-do-bts-antebraco.webp';
import finelineRunasPescoco from '../assets/portfolio/fineline-runas-pescoco.webp';
import finelineLetteringIfNotNowAntebraco from '../assets/portfolio/fineline-lettering-if-not-now-antebraco.webp';
import finelineAmericaDoSulInvertidaAntebraco from '../assets/portfolio/fineline-america-do-sul-invertida-antebraco.webp';
import finelineEscritaVerticalNaColunaCostas from '../assets/portfolio/fineline-escrita-vertical-na-coluna-costas.webp';
import finelineOndaEmCirculoBraco from '../assets/portfolio/fineline-onda-em-circulo-braco.webp';
import finelineBaleiaAntebraco from '../assets/portfolio/fineline-baleia-antebraco.webp';
import finelineLetteringKaizenPescoco from '../assets/portfolio/fineline-lettering-kaizen-pescoco.webp';
import finelineTatuagemDelicadaViagensAntebraco from '../assets/portfolio/fineline-tatuagem-delicada-viagens-antebraco.webp';
import finelineLetteringTendernessAntebraco from '../assets/portfolio/fineline-lettering-tenderness-antebraco.webp';
import finelineLetteringEnjoyTheButterfliesBraco from '../assets/portfolio/fineline-lettering-enjoy-the-butterflies-braco.webp';
import finelineMaeEBebeAntebraco from '../assets/portfolio/fineline-mae-e-bebe-antebraco.webp';
import finelineLetteringObstinacaoAntebraco from '../assets/portfolio/fineline-lettering-obstinacao-antebraco.webp';
import finelineLetteringRespeitoAntebraco from '../assets/portfolio/fineline-lettering-respeito-antebraco.webp';
import finelineLetteringResilienciaAntebraco from '../assets/portfolio/fineline-lettering-resiliencia-antebraco.webp';
import finelineLetteringRespiraPunho from '../assets/portfolio/fineline-lettering-respira-punho.webp';
import finelinePataEMaoAntebraco from '../assets/portfolio/fineline-pata-e-mao-antebraco.webp';
import finelineDatasEmCirculoAntebraco from '../assets/portfolio/fineline-datas-em-circulo-antebraco.webp';
import finelineBorboletaEmLinhaContinuaBraco from '../assets/portfolio/fineline-borboleta-em-linha-continua-braco.webp';
import finelineCoracoesDeDigitaisBraco from '../assets/portfolio/fineline-coracoes-de-digitais-braco.webp';
import finelineLetteringNomeBraco from '../assets/portfolio/fineline-lettering-nome-braco.webp';
import finelineCachorroEmMolduraBraco from '../assets/portfolio/fineline-cachorro-em-moldura-braco.webp';
import finelineFamiliaEDatasAntebraco from '../assets/portfolio/fineline-familia-e-datas-antebraco.webp';
import finelineStitchAntebraco from '../assets/portfolio/fineline-stitch-antebraco.webp';
import finelineLetteringLiberteAntebraco from '../assets/portfolio/fineline-lettering-liberte-antebraco.webp';
import finelineLetteringLongaHistoriaAntebraco from '../assets/portfolio/fineline-lettering-longa-historia-antebraco.webp';
import finelineNossaSenhoraAparecidaAntebraco from '../assets/portfolio/fineline-nossa-senhora-aparecida-antebraco.webp';
import finelineFamiliaIlustradaPanturrilha from '../assets/portfolio/fineline-familia-ilustrada-panturrilha.webp';
import finelineLetteringReverdecerBraco from '../assets/portfolio/fineline-lettering-reverdecer-braco.webp';
import finelinePatinhaDeCachorroAntebraco from '../assets/portfolio/fineline-patinha-de-cachorro-antebraco.webp';
import finelineStarWarsMayTheForceAntebraco from '../assets/portfolio/fineline-star-wars-may-the-force-antebraco.webp';
import finelineCitacaoFerrisBuellerAntebraco from '../assets/portfolio/fineline-citacao-ferris-bueller-antebraco.webp';
import finelineStarTrekVidaLongaEProsperaBraco from '../assets/portfolio/fineline-star-trek-vida-longa-e-prospera-braco.webp';
import finelineNossaSenhoraEmLinhaContinuaAntebraco from '../assets/portfolio/fineline-nossa-senhora-em-linha-continua-antebraco.webp';
import finelineBastaoDeAsclepioAtrasDaOrelha from '../assets/portfolio/fineline-bastao-de-asclepio-atras-da-orelha.webp';
import finelineCruzEmPretoSolidoBraco from '../assets/portfolio/fineline-cruz-em-preto-solido-braco.webp';
import finelineCactoPunho from '../assets/portfolio/fineline-cacto-punho.webp';
import finelineLetteringTentarSempreClavicula from '../assets/portfolio/fineline-lettering-tentar-sempre-clavicula.webp';
import finelineMulanAntebraco from '../assets/portfolio/fineline-mulan-antebraco.webp';
import finelineLampadaComCerebroAntebraco from '../assets/portfolio/fineline-lampada-com-cerebro-antebraco.webp';
import finelineBaleiaJubarteBraco from '../assets/portfolio/fineline-baleia-jubarte-braco.webp';
import finelineLetteringStillIRisePeito from '../assets/portfolio/fineline-lettering-still-i-rise-peito.webp';
import finelineSimboloDeTresEspiraisAntebraco from '../assets/portfolio/fineline-simbolo-de-tres-espirais-antebraco.webp';
import finelinePassarosClavicula from '../assets/portfolio/fineline-passaros-clavicula.webp';
import finelineTravelerNotATouristBraco from '../assets/portfolio/fineline-traveler-not-a-tourist-braco.webp';
import finelineMachadosCruzadosAntebraco from '../assets/portfolio/fineline-machados-cruzados-antebraco.webp';
import finelineEspadaAntebraco from '../assets/portfolio/fineline-espada-antebraco.webp';
import finelineBorboletaMonarcaBraco from '../assets/portfolio/fineline-borboleta-monarca-braco.webp';
import finelineEspelhoDeIemanjaAntebraco from '../assets/portfolio/fineline-espelho-de-iemanja-antebraco.webp';
import finelineChocalhoMinimalistaBraco from '../assets/portfolio/fineline-chocalho-minimalista-braco.webp';
import finelinePatinhaEmContornoBraco from '../assets/portfolio/fineline-patinha-em-contorno-braco.webp';
import finelineLetteringAmorFatiCostas from '../assets/portfolio/fineline-lettering-amor-fati-costas.webp';
import finelineFenixOmbro from '../assets/portfolio/fineline-fenix-ombro.webp';
import finelineLetteringObstinadoPescoco from '../assets/portfolio/fineline-lettering-obstinado-pescoco.webp';
import blackworkUroboros from '../assets/portfolio/blackwork-uroboros-e-bussola-nordica-peito.webp';
import blackworkAstronautaEEntropiaAntebraco from '../assets/portfolio/blackwork-astronauta-e-entropia-antebraco.webp';
import blackworkPomoDeOuroNuca from '../assets/portfolio/blackwork-pomo-de-ouro-nuca.webp';
import blackworkLanternaEMariposaPanturrilha from '../assets/portfolio/blackwork-lanterna-e-mariposa-panturrilha.webp';
import blackworkMacMiller from '../assets/portfolio/blackwork-capa-de-album-mac-miller-panturrilha.webp';
import blackworkAtlasEGeometriaAntebraco from '../assets/portfolio/blackwork-atlas-e-geometria-antebraco.webp';
import blackworkMulherComPlanetasAntebraco from '../assets/portfolio/blackwork-mulher-com-planetas-antebraco.webp';
import blackworkSamuraiEGalhosAntebraco from '../assets/portfolio/blackwork-samurai-e-galhos-antebraco.webp';
import blackworkTeaRexBraco from '../assets/portfolio/blackwork-tea-rex-braco.webp';
import blackworkGaloDeBarcelos from '../assets/portfolio/blackwork-galo-de-barcelos-coxa.webp';
import blackworkCartaMorte from '../assets/portfolio/blackwork-carta-de-taro-da-morte-coxa.webp';
import blackworkCartaCupido from '../assets/portfolio/blackwork-carta-de-taro-do-cupido-coxa.webp';
import blackworkSerpentePerna from '../assets/portfolio/blackwork-serpente-perna.webp';
import blackworkCapaDeAlbum from '../assets/portfolio/blackwork-capa-de-album-braco.webp';
import blackworkCapaDeAlbumFrente from '../assets/portfolio/blackwork-capa-de-album-braco-de-frente.webp';
import blackworkLinkinPark from '../assets/portfolio/blackwork-simbolo-do-linkin-park-panturrilha.webp';
import blackworkLinkinParkPerto from '../assets/portfolio/blackwork-simbolo-do-linkin-park-panturrilha-de-perto.webp';
import blackworkNeotrad from '../assets/portfolio/blackwork-neotrad-braco.webp';
import blackworkCapaceteDoAyrtonSennaBraco from '../assets/portfolio/blackwork-capacete-do-ayrton-senna-braco.webp';
import blackworkJohnnyCash from '../assets/portfolio/blackwork-johnny-cash-braco.webp';
import blackworkCoracaoRemendadoAntebraco from '../assets/portfolio/blackwork-coracao-remendado-antebraco.webp';
import blackworkFechamentoPolvo from '../assets/portfolio/blackwork-fechamento-com-polvo-perna.webp';
import blackworkMinasGeraisUaiManoPanturrilha from '../assets/portfolio/blackwork-minas-gerais-uai-mano-panturrilha.webp';
import blackworkMulherComPlanetasAntebracoDePerto from '../assets/portfolio/blackwork-mulher-com-planetas-antebraco-de-perto.webp';
import blackworkEsqueletoBigHeartAbdomen from '../assets/portfolio/blackwork-esqueleto-big-heart-abdomen.webp';
import blackworkYemanjaEOgum from '../assets/portfolio/blackwork-yemanja-e-ogum-braco.webp';
import blackworkCartasDeTaroNasDuasCoxas from '../assets/portfolio/blackwork-cartas-de-taro-nas-duas-coxas.webp';
import blackworkDivindadeComAnkhAntebraco from '../assets/portfolio/blackwork-divindade-com-ankh-antebraco.webp';
import geekTheLastOfUsComposicao from '../assets/portfolio/geek-the-last-of-us-composicao-panturrilha.webp';
import geekCrossoverMewtwoELaw from '../assets/portfolio/geek-crossover-mewtwo-e-law-antebraco.webp';
import geekVariasReferencias from '../assets/portfolio/geek-varias-referencias-antebraco.webp';
import geekJinxArcane from '../assets/portfolio/geek-jinx-arcane-panturrilha.webp';
import geekZarakiKenpachi from '../assets/portfolio/geek-bleach-zaraki-kenpachi-panturrilha.webp';
import geekPokemonMeowthAntebraco from '../assets/portfolio/geek-pokemon-meowth-antebraco.webp';
import geekStitchECoragem from '../assets/portfolio/geek-stitch-e-coragem-antebraco.webp';
import geekBerserkMarcaNasMaos from '../assets/portfolio/geek-berserk-marca-nas-maos.webp';
import geekNarsil from '../assets/portfolio/geek-narsil-senhor-dos-aneis-antebraco.webp';
import geekBaldursGate from '../assets/portfolio/geek-baldurs-gate-simbolo-antebraco.webp';
import geekDarkSoulsFogueiraBraco from '../assets/portfolio/geek-dark-souls-fogueira-braco.webp';
import geekDiscoElysiumVolition from '../assets/portfolio/geek-disco-elysium-volition-panturrilha.webp';
import geekDeadCells from '../assets/portfolio/geek-dead-cells-panturrilha.webp';
import geekCupheadKingDice from '../assets/portfolio/geek-cuphead-king-dice-panturrilha.webp';
import geekSupernaturalMarcaDeCaim from '../assets/portfolio/geek-supernatural-marca-de-caim-antebraco.webp';
import geekDungeonsAndDragons from '../assets/portfolio/geek-dungeons-and-dragons-composicao-antebraco.webp';
import geekMobPsycho from '../assets/portfolio/geek-mob-psycho-panturrilha.webp';
import geekNarutoEmQuadroAntebraco from '../assets/portfolio/geek-naruto-em-quadro-antebraco.webp';
import geekBerserkMarcaDoSacrificioPescoco from '../assets/portfolio/geek-berserk-marca-do-sacrificio-pescoco.webp';
import geekHomemAranhaEmQuadroAntebraco from '../assets/portfolio/geek-homem-aranha-em-quadro-antebraco.webp';
import geekNarutoClaNara from '../assets/portfolio/geek-naruto-cla-nara-peito.webp';
import geekOnePieceTatuagemDoAce from '../assets/portfolio/geek-one-piece-tatuagem-do-ace-peito.webp';
import geekOnePieceENaruto from '../assets/portfolio/geek-one-piece-e-naruto-peito.webp';
import geekPersonagensAzuisDoCinema from '../assets/portfolio/geek-personagens-azuis-do-cinema-perna.webp';
import geekCalciferAntebraco from '../assets/portfolio/geek-calcifer-antebraco.webp';
import geekDeadpoolQuadrinhoAntebraco from '../assets/portfolio/geek-deadpool-quadrinho-antebraco.webp';
import geekBobEsponjaNoLapisBraco from '../assets/portfolio/geek-bob-esponja-no-lapis-braco.webp';
import geekLoveDeathAndRobots from '../assets/portfolio/geek-love-death-and-robots-antebraco.webp';
import geekManoplaDoInfinitoAntebraco from '../assets/portfolio/geek-manopla-do-infinito-antebraco.webp';
import geekPokemonLinhaDoCharmanderAntebraco from '../assets/portfolio/geek-pokemon-linha-do-charmander-antebraco.webp';
import geekSenhorDosAneisEspadaArcoMachadoAntebraco from '../assets/portfolio/geek-senhor-dos-aneis-espada-arco-machado-antebraco.webp';
import geekSenhorDosAneisEspadaArcoMachadoAntebracoDeLado from '../assets/portfolio/geek-senhor-dos-aneis-espada-arco-machado-antebraco-de-lado.webp';
import geekBioshockFarolPanturrilha from '../assets/portfolio/geek-bioshock-farol-panturrilha.webp';
import geekTheWitcherMedalhaoPanturrilha from '../assets/portfolio/geek-the-witcher-medalhao-panturrilha.webp';
import geekOkamiHanagami from '../assets/portfolio/geek-okami-hanagami-antebraco.webp';
import geekTRexPunkPerna from '../assets/portfolio/geek-t-rex-punk-perna.webp';
import geekLifeIsStrangeBorboletaPanturrilha from '../assets/portfolio/geek-life-is-strange-borboleta-panturrilha.webp';
import geekOnePieceAceELuffy from '../assets/portfolio/geek-one-piece-ace-e-luffy-panturrilha.webp';
import geekGandalfEmLego from '../assets/portfolio/geek-gandalf-em-lego-coxa.webp';
import geekTheLastOfUsEllie from '../assets/portfolio/geek-the-last-of-us-ellie-panturrilha.webp';

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
  destaque?: boolean;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'all', label: 'Todos' },
  { id: 'coberturas', label: 'Coberturas' },
  { id: 'botanico', label: 'Botânico' },
  { id: 'geek', label: 'Geek & Animes' },
  { id: 'blackwork', label: 'Blackwork' },
  { id: 'fineline', label: 'Fine Line' }
];

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
  },
  {
    id: 2,
    destaque: true,
    title: 'Crisântemo no Ombro',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaCrisantemo,
    alt: 'Cobertura de tatuagem com crisântemo e pequenas flores cobrindo o ombro',
  },
  {
    id: 3,
    destaque: true,
    title: 'Onça entre Flores',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaOnca,
    alt: 'Cobertura em braço fechado com rosto de onça entre flores em preto e cinza',
  },
  {
    id: 4,
    title: 'Floral no Peito',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFloralPeito,
    alt: 'Cobertura de tatuagem com composição floral no peito',
  },
  {
    id: 5,
    title: 'Samurai em Braço Fechado',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaSamurai,
    alt: 'Cobertura de tatuagem com tema oriental, samurai, montanhas e torii em braço fechado',
  },
  {
    id: 6,
    title: 'Fullmetal Alchemist',
    category: 'coberturas',
    categoryLabel: 'Coberturas',
    image: coberturaFullmetal,
    alt: 'Cobertura de tatuagem de Fullmetal Alchemist com círculo de transmutação e personagens em braço fechado',
  },
  /* ⚠️ O `id` só precisa ser único — ele indexa o lightbox, não a ordem de
     exibição. Segue a ordem de importação, não a posição no array. */
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
  {
    id: 115,
    title: 'Símbolo de Capricórnio',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineSimboloDeCapricornioBraco,
    alt: 'Tatuagem fine line com o símbolo de Capricórnio em traço contínuo no braço'
  },
  {
    id: 116,
    title: 'Tatuagem de Casal',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineTatuagemDeCasalCruzAntebraco,
    alt: 'Tatuagem de casal em fine line, com cruz formada por galhos no antebraço de duas pessoas'
  },
  {
    id: 117,
    title: 'Let Go',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringLetGoBraco,
    alt: 'Tatuagem fine line com o lettering Let Go no braço'
  },
  {
    id: 118,
    title: 'Tatuagem de Irmãs',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineTatuagemDeIrmasLetteringBraco,
    alt: 'Tatuagem de irmãs em fine line, com lettering em traço fino no braço de duas pessoas'
  },
  {
    id: 119,
    title: 'Rosa Vermelha',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineRosaVermelhaAntebraco,
    alt: 'Tatuagem fine line de rosa vermelha com caule em espiral no antebraço'
  },
  {
    id: 120,
    title: 'Símbolo de Graduação',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineSimboloDeGraduacaoPunho,
    alt: 'Tatuagem fine line com símbolo de letras de graduação, em pontilhismo no punho'
  },
  {
    id: 121,
    title: 'Tatuagem de Amigos — Copo Lagoinha',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineTatuagemDeAmigosCopoLagoinhaAntebraco,
    alt: 'Tatuagem de amigos em fine line, com o copo da Lagoinha em traço mínimo no antebraço de duas pessoas'
  },
  {
    id: 122,
    title: 'Digitais e Patinha',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineDigitaisEPatinhaAntebraco,
    alt: 'Tatuagem fine line com digitais dentro de triângulos e patinha de cachorro, no antebraço'
  },
  {
    id: 123,
    title: 'Símbolo do BTS',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineSimboloDoBtsAntebraco,
    alt: 'Tatuagem fine line com o símbolo do BTS em linha contínua no antebraço'
  },
  {
    id: 124,
    title: 'Runas',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineRunasPescoco,
    alt: 'Tatuagem fine line com runas nórdicas em traço fino no pescoço'
  },
  {
    id: 125,
    title: 'If Not Now, Then When',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringIfNotNowAntebraco,
    alt: 'Tatuagem fine line com o lettering If not now then when no antebraço'
  },
  {
    id: 126,
    title: 'América do Sul Invertida',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineAmericaDoSulInvertidaAntebraco,
    alt: 'Tatuagem fine line com o mapa da América do Sul invertido e lettering em espanhol, no antebraço'
  },
  {
    id: 127,
    title: 'Escrita Vertical na Coluna',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEscritaVerticalNaColunaCostas,
    alt: 'Tatuagem fine line com escrita vertical descendo pela coluna, nas costas'
  },
  {
    id: 128,
    title: 'Onda em Círculo',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineOndaEmCirculoBraco,
    alt: 'Tatuagem fine line de onda dentro de um círculo, em pontilhismo no braço'
  },
  {
    id: 129,
    title: 'Baleia',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBaleiaAntebraco,
    alt: 'Tatuagem fine line de baleia jubarte em pontilhismo no antebraço'
  },
  {
    id: 130,
    title: 'Kaizen',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringKaizenPescoco,
    alt: 'Tatuagem fine line com o lettering Kaizen na vertical, no pescoço'
  },
  {
    id: 131,
    title: 'Viagens',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineTatuagemDelicadaViagensAntebraco,
    alt: 'Tatuagem fine line delicada sobre viagens, com globo, avião e viajante de mochila, no antebraço'
  },
  {
    id: 132,
    title: 'Tenderness Is a Virtue',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringTendernessAntebraco,
    alt: 'Tatuagem fine line com o lettering tenderness is a virtue no antebraço'
  },
  {
    id: 133,
    title: 'Enjoy the Butterflies',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringEnjoyTheButterfliesBraco,
    alt: 'Tatuagem fine line com o lettering Enjoy the butterflies no braço'
  },
  {
    id: 134,
    title: 'Mãe e Bebê',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMaeEBebeAntebraco,
    alt: 'Tatuagem fine line de mãe com bebê, flores e dados de nascimento, no antebraço'
  },
  {
    id: 135,
    title: 'Obstinação',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringObstinacaoAntebraco,
    alt: 'Tatuagem fine line com o lettering Obstinação no antebraço'
  },
  {
    id: 136,
    title: 'Respeito',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringRespeitoAntebraco,
    alt: 'Tatuagem fine line com o lettering Respeito em cursiva, descendo o antebraço'
  },
  {
    id: 137,
    title: 'Resiliência',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringResilienciaAntebraco,
    alt: 'Tatuagem fine line com o lettering Resiliência na vertical, no antebraço'
  },
  {
    id: 138,
    title: 'Respira',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringRespiraPunho,
    alt: 'Tatuagem fine line com o lettering respira contornando o punho'
  },
  {
    id: 139,
    title: 'Pata e Mão',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelinePataEMaoAntebraco,
    alt: 'Tatuagem fine line de pata de cachorro e mão humana em traço contínuo, no antebraço'
  },
  {
    id: 140,
    title: 'Datas em Círculo',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineDatasEmCirculoAntebraco,
    alt: 'Tatuagem fine line com datas dispostas em círculo no antebraço'
  },
  {
    id: 141,
    title: 'Borboleta em Linha Contínua',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBorboletaEmLinhaContinuaBraco,
    alt: 'Tatuagem fine line de borboleta em linha contínua no braço'
  },
  {
    id: 142,
    title: 'Corações de Digitais',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCoracoesDeDigitaisBraco,
    alt: 'Tatuagem fine line de corações formados por digitais, no braço de duas pessoas'
  },
  {
    id: 143,
    title: 'Nome em Cursiva',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringNomeBraco,
    alt: 'Tatuagem fine line com um nome em cursiva contornando o braço'
  },
  {
    id: 144,
    title: 'Cachorro em Moldura',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCachorroEmMolduraBraco,
    alt: 'Tatuagem fine line de cachorro dentro de moldura oval, no braço'
  },
  {
    id: 145,
    title: 'Família e Datas',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineFamiliaEDatasAntebraco,
    alt: 'Tatuagem fine line com datas em círculo, coração, a palavra família e um terço, no antebraço'
  },
  {
    id: 146,
    title: 'Stitch',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineStitchAntebraco,
    alt: 'Tatuagem fine line do Stitch, de Lilo & Stitch, em pontilhismo no antebraço'
  },
  {
    id: 147,
    title: 'Liberté',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringLiberteAntebraco,
    alt: 'Tatuagem fine line com o lettering liberté no antebraço'
  },
  {
    id: 148,
    title: 'Eu Sou uma Longa História',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringLongaHistoriaAntebraco,
    alt: 'Tatuagem fine line com o lettering Eu sou uma longa história no antebraço'
  },
  {
    id: 149,
    title: 'Nossa Senhora Aparecida',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineNossaSenhoraAparecidaAntebraco,
    alt: 'Tatuagem fine line de Nossa Senhora Aparecida com a palavra família e um terço, no antebraço'
  },
  {
    id: 150,
    title: 'Família Ilustrada',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineFamiliaIlustradaPanturrilha,
    alt: 'Tatuagem fine line de família ilustrada com cachorros, da panturrilha ao tornozelo'
  },
  {
    id: 151,
    title: 'Reverdecer',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringReverdecerBraco,
    alt: 'Tatuagem fine line com o lettering Reverdecer em vermelho, ao lado de uma flor, no braço'
  },
  {
    id: 152,
    title: 'Patinha de Cachorro',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelinePatinhaDeCachorroAntebraco,
    alt: 'Tatuagem fine line com a impressão da patinha de um cachorro, no antebraço'
  },
  {
    id: 153,
    title: 'May the Force Be with You',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineStarWarsMayTheForceAntebraco,
    alt: 'Tatuagem fine line do símbolo da Aliança Rebelde, de Star Wars, com a frase May the force be with you, no antebraço'
  },
  {
    id: 154,
    title: 'Citação do Ferris Bueller',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCitacaoFerrisBuellerAntebraco,
    alt: 'Tatuagem fine line com uma citação do filme Curtindo a Vida Adoidado, no antebraço'
  },
  {
    id: 155,
    title: 'Vida Longa e Próspera',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineStarTrekVidaLongaEProsperaBraco,
    alt: 'Tatuagem fine line com a saudação vulcana de Star Trek e a frase Vida longa e próspera, no braço'
  },
  {
    id: 156,
    title: 'Nossa Senhora em Linha Contínua',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineNossaSenhoraEmLinhaContinuaAntebraco,
    alt: 'Tatuagem fine line de Nossa Senhora em rosto minimalista de linha contínua, no antebraço'
  },
  {
    id: 157,
    title: 'Bastão de Asclépio',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBastaoDeAsclepioAtrasDaOrelha,
    alt: 'Tatuagem fine line do bastão de Asclépio em pontilhismo, atrás da orelha'
  },
  {
    id: 158,
    title: 'Cruz',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCruzEmPretoSolidoBraco,
    alt: 'Tatuagem de cruz em traço pincelado e preto sólido, com referência bíblica, no braço'
  },
  {
    id: 159,
    title: 'Cacto',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCactoPunho,
    alt: 'Tatuagem fine line de cacto em pontilhismo no punho'
  },
  {
    id: 160,
    title: 'Tentar Sempre, Desistir Nunca',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringTentarSempreClavicula,
    alt: 'Tatuagem fine line com o lettering Tentar sempre, desistir nunca na clavícula'
  },
  {
    id: 161,
    title: 'Mulan',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMulanAntebraco,
    alt: 'Tatuagem fine line da Mulan dentro de círculo enso com ramo de cerejeira, no antebraço'
  },
  {
    id: 162,
    title: 'Lâmpada com Cérebro',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLampadaComCerebroAntebraco,
    alt: 'Tatuagem fine line de lâmpada com cérebro e geometria, no antebraço'
  },
  {
    id: 163,
    title: 'Baleia Jubarte',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBaleiaJubarteBraco,
    alt: 'Tatuagem fine line de baleia jubarte em pontilhismo no braço'
  },
  {
    id: 164,
    title: 'Still I Rise',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringStillIRisePeito,
    alt: 'Tatuagem fine line com o lettering Still I Rise e uma data em algarismos romanos, no peito'
  },
  {
    id: 165,
    title: 'Símbolo de Três Espirais',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineSimboloDeTresEspiraisAntebraco,
    alt: 'Tatuagem fine line de símbolo com três espirais dentro de um círculo, no antebraço'
  },
  {
    id: 166,
    title: 'Pássaros',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelinePassarosClavicula,
    alt: 'Tatuagem de pássaros em preto sólido na clavícula e no ombro'
  },
  {
    id: 167,
    title: 'Traveler, Not a Tourist',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineTravelerNotATouristBraco,
    alt: 'Tatuagem fine line com globo, bússola e a frase I am a traveler not a tourist, no braço'
  },
  {
    id: 168,
    title: 'Machados Cruzados',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMachadosCruzadosAntebraco,
    alt: 'Tatuagem fine line de dois machados cruzados em pontilhismo no antebraço'
  },
  {
    id: 169,
    title: 'Espada',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEspadaAntebraco,
    alt: 'Tatuagem fine line de espada em pontilhismo no antebraço'
  },
  {
    id: 170,
    title: 'Borboleta Monarca',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBorboletaMonarcaBraco,
    alt: 'Tatuagem fine line de borboleta com asas detalhadas no braço'
  },
  {
    id: 171,
    title: 'Espelho de Iemanjá',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEspelhoDeIemanjaAntebraco,
    alt: 'Tatuagem fine line do espelho de Iemanjá com lua crescente e estrela, no antebraço'
  },
  {
    id: 172,
    title: 'Chocalho Minimalista',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineChocalhoMinimalistaBraco,
    alt: 'Tatuagem fine line de chocalho em traço minimalista e pontilhismo, no braço'
  },
  {
    id: 173,
    title: 'Patinha em Contorno',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelinePatinhaEmContornoBraco,
    alt: 'Tatuagem fine line de patinha de cachorro só em contorno, no braço'
  },
  {
    id: 174,
    title: 'Amor Fati',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringAmorFatiCostas,
    alt: 'Tatuagem fine line com o lettering amor fati na lombar'
  },
  {
    id: 175,
    title: 'Fênix',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineFenixOmbro,
    alt: 'Tatuagem fine line de fênix em voo no ombro e nas costas'
  },
  {
    id: 176,
    title: 'Obstinado',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLetteringObstinadoPescoco,
    alt: 'Tatuagem fine line com o lettering Obstinado na vertical, no pescoço'
  },
  {
    id: 87,
    title: 'Uroboros e Bússola Nórdica',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkUroboros,
    alt: 'Tatuagem blackwork de uroboros envolvendo uma bússola nórdica, em preto sólido no peito'
  },
  {
    id: 88,
    title: 'Astronauta e Entropia',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkAstronautaEEntropiaAntebraco,
    alt: 'Tatuagem blackwork de astronauta com a palavra Entropy, DNA e geometria, em pontilhismo no antebraço'
  },
  {
    id: 89,
    title: 'Pomo de Ouro',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkPomoDeOuroNuca,
    alt: 'Tatuagem blackwork do pomo de ouro, de Harry Potter, em pontilhismo na nuca'
  },
  {
    id: 90,
    title: 'Lanterna e Mariposa',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkLanternaEMariposaPanturrilha,
    alt: 'Tatuagem blackwork de lanterna antiga com mariposa e folhas, em pontilhismo na panturrilha'
  },
  {
    id: 91,
    title: 'Capa de Álbum do Mac Miller',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMacMiller,
    alt: 'Tatuagem blackwork da capa de álbum do Mac Miller, em pontilhismo na panturrilha'
  },
  {
    id: 92,
    title: 'Atlas e Geometria',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkAtlasEGeometriaAntebraco,
    alt: 'Tatuagem blackwork de figura clássica erguendo uma esfera, com geometria sagrada, no antebraço'
  },
  {
    id: 93,
    title: 'Mulher e Planetas',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMulherComPlanetasAntebraco,
    alt: 'Tatuagem blackwork de mulher com cabelo de nuvens e planetas em pontilhismo no antebraço'
  },
  {
    id: 94,
    title: 'Samurai e Galhos',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkSamuraiEGalhosAntebraco,
    alt: 'Tatuagem blackwork de elmo de samurai entre galhos secos, em pontilhismo no antebraço'
  },
  {
    id: 95,
    title: 'Tea Rex',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkTeaRexBraco,
    alt: 'Tatuagem blackwork de T-Rex dentro de uma xícara de chá com a etiqueta Tea Rex, no braço, sobre o tríceps'
  },
  {
    id: 96,
    title: 'Galo de Barcelos',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkGaloDeBarcelos,
    alt: 'Tatuagem de galo de Barcelos com detalhes em cor e estrela amarela na coxa'
  },
  {
    id: 97,
    title: 'Carta de Tarô da Morte',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCartaMorte,
    alt: 'Tatuagem blackwork da carta de tarô da Morte com caveira encapuzada e teia de aranha, na coxa'
  },
  {
    id: 98,
    title: 'Carta de Tarô do Cupido',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCartaCupido,
    alt: 'Tatuagem blackwork da carta de tarô do Cupido com anjo e nuvens, na coxa'
  },
  {
    id: 99,
    title: 'Serpente',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkSerpentePerna,
    alt: 'Tatuagem de serpente em preto e cinza com escamas detalhadas na perna'
  },
  {
    id: 100,
    title: 'Capa de Álbum',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCapaDeAlbum,
    alt: 'Tatuagem blackwork de capa de álbum em traço de rabisco, no braço'
  },
  {
    id: 101,
    title: 'Capa de Álbum, de Frente',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCapaDeAlbumFrente,
    alt: 'Tatuagem blackwork de capa de álbum em traço de rabisco, no braço, vista de frente'
  },
  {
    id: 102,
    title: 'Símbolo do Linkin Park',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkLinkinPark,
    alt: 'Tatuagem blackwork do símbolo do Linkin Park com uma data, em pontilhismo na panturrilha'
  },
  {
    id: 103,
    title: 'Símbolo do Linkin Park, de Perto',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkLinkinParkPerto,
    alt: 'Tatuagem blackwork do símbolo do Linkin Park em pontilhismo na panturrilha, vista de perto'
  },
  {
    id: 104,
    title: 'Neotrad em Blackwork',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkNeotrad,
    alt: 'Tatuagem blackwork em neotrad de mulher com flores, chifres e felino em braço fechado'
  },
  {
    id: 105,
    title: 'Capacete do Ayrton Senna',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCapaceteDoAyrtonSennaBraco,
    alt: 'Tatuagem blackwork do capacete do Ayrton Senna com a assinatura dele, no braço, sobre o tríceps'
  },
  {
    id: 106,
    title: 'Johnny Cash',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkJohnnyCash,
    alt: 'Tatuagem blackwork do Johnny Cash em silhueta de preto sólido, no braço'
  },
  {
    id: 107,
    title: 'Coração Remendado',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCoracaoRemendadoAntebraco,
    alt: 'Tatuagem de coração anatômico com curativo e faixa azul no antebraço'
  },
  {
    id: 108,
    title: 'Fechamento com Polvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkFechamentoPolvo,
    alt: 'Tatuagem de polvo em preto e cinza em fechamento de perna, da coxa ao tornozelo'
  },
  {
    id: 109,
    title: 'Uai Mano',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMinasGeraisUaiManoPanturrilha,
    alt: 'Tatuagem em trash polka com o mapa de Minas Gerais e a inscrição Uai Mano, na panturrilha'
  },
  {
    id: 110,
    title: 'Mulher e Planetas, de Perto',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMulherComPlanetasAntebracoDePerto,
    alt: 'Tatuagem blackwork de mulher com cabelo de nuvens e planetas no antebraço, vista de perto'
  },
  {
    id: 111,
    title: 'She\'s Got a Big Heart',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkEsqueletoBigHeartAbdomen,
    alt: 'Tatuagem blackwork de esqueleto com a frase She\'s got a big heart, em traço fino no abdômen'
  },
  {
    id: 112,
    title: 'Yemanjá e Ogum',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkYemanjaEOgum,
    alt: 'Tatuagem blackwork de Yemanjá e Ogum em braço fechado, com traço ornamental'
  },
  {
    id: 113,
    title: 'As Duas Cartas de Tarô',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkCartasDeTaroNasDuasCoxas,
    alt: 'Tatuagem blackwork com as cartas de tarô The Cupid e Death, uma em cada coxa'
  },
  {
    id: 114,
    title: 'Divindade com Ankh',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkDivindadeComAnkhAntebraco,
    alt: 'Tatuagem blackwork de divindade com chifres e cajado ankh, em pontilhismo no antebraço'
  },
  {
    id: 67,
    title: 'Composição The Last of Us',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTheLastOfUsComposicao,
    alt: 'Tatuagem geek de The Last of Us com braço de violão e fita cassete, em blackwork na panturrilha'
  },
  {
    id: 68,
    title: 'Crossover Mewtwo e Law',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCrossoverMewtwoELaw,
    alt: 'Tatuagem geek em crossover de Mewtwo com Trafalgar Law, de One Piece, em cores no antebraço'
  },
  {
    id: 69,
    title: 'Braço Geek',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekVariasReferencias,
    alt: 'Tatuagem geek com várias referências pequenas em blackwork espalhadas pelo antebraço'
  },
  {
    id: 70,
    title: 'Jinx — Arcane',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekJinxArcane,
    alt: 'Tatuagem geek da Jinx, de Arcane, em aquarela colorida na panturrilha'
  },
  {
    id: 71,
    title: 'Zaraki Kenpachi — Bleach',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekZarakiKenpachi,
    alt: 'Tatuagem geek de Zaraki Kenpachi, de Bleach, em preto e cinza na panturrilha'
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
    title: 'Stitch e Coragem',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekStitchECoragem,
    alt: 'Tatuagem geek do Stitch e do Coragem, o Cão Covarde, em pontilhismo no antebraço'
  },
  {
    id: 74,
    title: 'Berserk — Marca',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBerserkMarcaNasMaos,
    alt: 'Tatuagem geek de Berserk com a marca em preto sólido nas mãos de duas pessoas'
  },
  {
    id: 75,
    title: 'Narsil — O Senhor dos Anéis',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekNarsil,
    alt: 'Tatuagem geek da espada Narsil, de O Senhor dos Anéis, em preto e cinza no antebraço'
  },
  {
    id: 76,
    title: 'Símbolo de Baldur’s Gate',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBaldursGate,
    alt: 'Tatuagem geek com o símbolo de Baldur’s Gate em preto sólido contornando o antebraço'
  },
  {
    id: 77,
    title: 'Fogueira — Dark Souls',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDarkSoulsFogueiraBraco,
    alt: 'Tatuagem geek de Dark Souls com espada cravada na fogueira, em preto e cinza no braço'
  },
  {
    id: 78,
    title: 'Volition — Disco Elysium',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDiscoElysiumVolition,
    alt: 'Tatuagem geek de Disco Elysium com o símbolo de Volition em blackwork na panturrilha'
  },
  {
    id: 79,
    title: 'Dead Cells',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDeadCells,
    alt: 'Tatuagem geek de Dead Cells em carta ilustrada, colorida na panturrilha'
  },
  {
    id: 80,
    title: 'King Dice — Cuphead',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekCupheadKingDice,
    alt: 'Tatuagem geek do King Dice, de Cuphead, colorido na panturrilha'
  },
  {
    id: 81,
    title: 'Marca de Caim — Supernatural',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekSupernaturalMarcaDeCaim,
    alt: 'Tatuagem geek de Supernatural com a Marca de Caim em vermelho sólido no antebraço'
  },
  {
    id: 82,
    title: 'Composição de D&D',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekDungeonsAndDragons,
    alt: 'Tatuagem geek de Dungeons & Dragons com dado d20 e a fita Roll Initiative, em blackwork no antebraço'
  },
  {
    id: 83,
    title: 'Mob Psycho',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekMobPsycho,
    alt: 'Tatuagem geek de Mob Psycho com dois personagens em traço fino na panturrilha'
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
    title: 'Clã Nara — Naruto',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekNarutoClaNara,
    alt: 'Tatuagem geek de Naruto com o símbolo do clã Nara em preto sólido no peito'
  },
  {
    id: 48,
    title: 'Tatuagem do Ace — One Piece',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePieceTatuagemDoAce,
    alt: 'Tatuagem geek de One Piece com a tatuagem do Ace e a inscrição 3D2Y no peito'
  },
  {
    id: 49,
    title: 'One Piece e Naruto',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePieceENaruto,
    alt: 'Tatuagem geek de One Piece e Naruto no peito, com o símbolo do clã Nara e lettering'
  },
  {
    id: 50,
    title: 'Personagens Azuis do Cinema',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekPersonagensAzuisDoCinema,
    alt: 'Tatuagem geek com personagens azuis de cinema em aquarela colorida na perna'
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
    title: 'Love, Death and Robots',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekLoveDeathAndRobots,
    alt: 'Tatuagem geek de Love, Death and Robots com robôs e eletrônicos, com detalhes coloridos no antebraço'
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
    title: 'Hanagami — Okami',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOkamiHanagami,
    alt: 'Tatuagem geek de Okami com os Hanagami em pontilhismo e respingos vermelhos no antebraço'
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
    title: 'Life is Strange',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekLifeIsStrangeBorboletaPanturrilha,
    alt: 'Tatuagem geek de Life is Strange com polaroid e borboleta azul em aquarela, na panturrilha'
  },
  {
    id: 64,
    title: 'Ace e Luffy — One Piece',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOnePieceAceELuffy,
    alt: 'Tatuagem geek de One Piece com Ace e Luffy em círculos de chamas vermelhas, na panturrilha'
  },
  {
    id: 65,
    title: 'Gandalf em Lego',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekGandalfEmLego,
    alt: 'Tatuagem geek do Gandalf em versão Lego, em blackwork com pontilhismo, na coxa'
  },
  {
    id: 66,
    title: 'Ellie — The Last of Us',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekTheLastOfUsEllie,
    alt: 'Tatuagem geek da Ellie, de The Last of Us, em moldura circular com blackwork na panturrilha'
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
  },
  {
    id: 8,
    destaque: true,
    title: 'Sempre-viva na Clavícula',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoSempreViva,
    alt: 'Tatuagem botânica de sempre-viva em traço fino sobre a clavícula',
  },
  {
    id: 9,
    destaque: true,
    title: 'Floral nas Costas',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFloresCostas,
    alt: 'Tatuagem botânica com flores e folhas atravessando as costas e o ombro',
  },
  {
    id: 10,
    title: 'Braçadeira Floral',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoBracadeira,
    alt: 'Tatuagem botânica em forma de braçadeira floral contornando o antebraço',
  },
  {
    id: 11,
    title: 'Folhas e Flores no Braço',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoFolhasFlores,
    alt: 'Tatuagem botânica de folhas e flores em traço fino no braço',
  },
  {
    id: 12,
    title: 'Girassol na Costela',
    category: 'botanico',
    categoryLabel: 'Botânico',
    image: botanicoGirassol,
    alt: 'Tatuagem de girassol com folhas na lateral da costela',
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
  /* ⚠️ As quatro abaixo são outros ângulos de peças que já aparecem acima.
     Não são duplicatas — não remova. */
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
  },
  {
    id: 14,
    destaque: true,
    title: 'Composição Alice no País das Maravilhas',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekAliceNoPais,
    alt: 'Tatuagem geek de Alice no País das Maravilhas com o Gato de Cheshire e xícaras nas costas',
  },
  {
    id: 15,
    destaque: true,
    title: 'Guts — Berserk',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBerserkGuts,
    alt: 'Tatuagem geek do Guts, de Berserk, em preto e cinza no braço',
  },
  {
    id: 16,
    title: 'Amaterasu — Okami',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekOkamiAmaterasu,
    alt: 'Tatuagem geek da Amaterasu, de Okami, com detalhes em vermelho no antebraço',
  },
  {
    id: 17,
    title: 'Árvore Branca no Ombro',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekArvore,
    alt: 'Tatuagem de árvore branca com espada e inscrições élficas no ombro',
  },
  {
    id: 18,
    title: 'Baraggan — Bleach',
    category: 'geek',
    categoryLabel: 'Geek & Animes',
    image: geekBaraggan,
    alt: 'Tatuagem geek do Baraggan, de Bleach, com caveira, asas e correntes no antebraço',
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
  },
  {
    id: 20,
    destaque: true,
    title: 'The Rind — Escher',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkEscher,
    alt: 'Tatuagem blackwork inspirada em The Rind, de Escher, com faixas em preto sólido envolvendo o antebraço',
  },
  {
    id: 21,
    destaque: true,
    title: 'Vegvisir e Corvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkVegvisir,
    alt: 'Tatuagem blackwork de bússola viking vegvisir com corvo em preto sólido no ombro',
  },
  {
    id: 22,
    title: 'Máscara Tribal',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkMascara,
    alt: 'Tatuagem blackwork de máscara tribal ocupando o braço inteiro',
  },
  {
    id: 23,
    title: 'Tucano em Losango',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkTucano,
    alt: 'Tatuagem blackwork de tucano e paisagem dentro de moldura em losango, no braço',
  },
  {
    id: 24,
    title: 'Navio e Polvo',
    category: 'blackwork',
    categoryLabel: 'Blackwork',
    image: blackworkNavio,
    alt: 'Tatuagem blackwork de navio, lanterna e polvo na coxa',
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
  },
  {
    id: 26,
    destaque: true,
    title: 'Medusa',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineMedusa,
    alt: 'Tatuagem fine line de Medusa com serpentes no abdômen',
  },
  {
    id: 27,
    destaque: true,
    title: 'Espelho e Tesoura',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineEspelho,
    alt: 'Tatuagem fine line de espelho de mão, tesoura e flores nas costas',
  },
  {
    id: 28,
    title: 'Livros e Cartola',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineLivros,
    alt: 'Tatuagem fine line de pilha de livros, cartola e cartas na coxa',
  },
  {
    id: 29,
    title: 'Borboleta',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineBorboleta,
    alt: 'Tatuagem fine line de borboleta com asas detalhadas no antebraço',
  },
  {
    id: 30,
    title: 'Cavalo',
    category: 'fineline',
    categoryLabel: 'Fine Line',
    image: finelineCavalo,
    alt: 'Tatuagem fine line de cabeça de cavalo em traço contínuo nas costas',
  }
];

/** A camada de destaque: 6 por categoria, o que a home mostra. */
export const itensDestaque: PortfolioItem[] = portfolioItems.filter((item) => item.destaque);

