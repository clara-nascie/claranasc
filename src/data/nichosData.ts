import {
  PORTFOLIO_CATEGORIES,
  portfolioItems,
  type PortfolioItem,
} from "./portfolioData";


export interface Nicho {
  /** Vira a URL: /tatuagem/{slug}. ⚠️ Não troque depois que a página tiver tráfego. */
  slug: string;
  /** `id` em PORTFOLIO_CATEGORIES — é o que filtra as fotos. */
  categoriaId: string;
  /** Termo de busca alvo. Só documentação: não vai para a tela. */
  termoPrincipal: string;
  /** Título azul no Google. Até 60 caracteres. */
  seoTitle: string;
  /** Parágrafo cinza no Google. Entre 100 e 160 caracteres. */
  seoDescription: string;
  /** O título grande da página. */
  h1: string;
  /** A frase única abaixo do título. Até 120 caracteres. */
  chamada: string;
  /** Escreva a pergunta como a pessoa digita no Google. Resposta de 2 a 4 frases. */
  faq: PerguntaFrequente[];
  /** Já vem digitada no WhatsApp de quem sai desta página. */
  mensagemWhatsapp: string;
}

export interface PerguntaFrequente {
  pergunta: string;
  resposta: string;
}

export const NICHOS: Nicho[] = [
  {
    slug: "coberturas",
    categoriaId: "coberturas",
    termoPrincipal: "cobertura de tatuagem bh",
    seoTitle: "Cobertura de Tatuagem em BH | Clara Nasc",
    seoDescription:
      "Cobertura de tatuagem em Belo Horizonte: veja trabalhos reais de cover-up e descubra se a sua tatuagem antiga pode ser coberta. Mande uma foto pelo WhatsApp.",
    h1: "Cobertura de tatuagem em Belo Horizonte",

    chamada:
      "Cobertura boa é quando você sai do studio sem nem lembrar do que existia por baixo da tatto nova.",
    faq: [
      {
        pergunta: "Qualquer tatuagem pode ser coberta?",
        resposta:
          "O que decide não é o quanto você gosta menos dela: é o quanto de preto ela tem. Traço fino e cinza claro dão mais liberdade, e cabe quase qualquer desenho novo em cima. Preto sólido e áreas muito saturadas exigem um estudo de caso maior — por isso, na maioria das vezes, é necessária uma visita ao studio, para que eu possa avaliar pessoalmente e propor tipo de trabalho que vão entregar um resultado satisfatório.",
      },
      {
        pergunta: "A cobertura sai em uma sessão só?",
        resposta:
          "Nem sempre. A peça nova costuma pedir mais espaço que a antiga, porque as bordas precisam de área para se resolver, e isso já aumenta o tempo. Quando a tatuagem antiga é muito escura, o caminho mais honesto é clarear antes com algumas sessões de laser e cobrir depois — o resultado é outro patamar, e eu prefiro dizer isso antes de começar.",
      },
      {
        pergunta: "Como faço para saber se a minha cobre?",
        resposta:
          "Me manda uma foto da tatuagem atual pelo WhatsApp, com luz natural e sem filtro — é o que mostra a saturação de verdade. Eu respondo com o que dá para fazer, o tamanho que a peça nova precisa ter e quantas sessões seriam.",
      },
    ],
    mensagemWhatsapp:
      "Olá Clara! Vim pela página de coberturas do site e gostaria de saber se a minha tatuagem tem cobertura.",
  },
  {
    slug: "botanico",
    categoriaId: "botanico",
    termoPrincipal: "tatuagem botânica bh",
    seoTitle: "Tatuagem Botânica em BH | Flores e Folhas | Clara Nasc",
    seoDescription:
      "Tatuagem botânica em Belo Horizonte: flores, folhas e ramos em traço fino e pontilhismo. Veja o portfólio autoral e solicite seu orçamento pelo WhatsApp.",
    h1: "Tatuagem botânica em Belo Horizonte",
    chamada:
      "Flores, folhas e ramos desenhados para acompanhar o corpo — não para serem colados nele.",
    faq: [
      {
        pergunta: "Tatuagem botânica em traço fino dura?",
        resposta:
          "Dura, se for desenhada contando com o tempo. Traço muito fino e muito junto se fecha: a tinta espalha alguns décimos de milímetro dentro da pele ao longo dos anos, e o que era um vão vira mancha. Nos meus botânicos isso aparece como decisão de espaçamento — sementes de dente-de-leão em pontos separados, folhagem com sombreado só nas bordas, e preenchimento sólido reservado para o que precisa ancorar o desenho.",
      },
      {
        pergunta: "Você faz desenho de catálogo ou é tudo autoral?",
        resposta:
          "Autoral, e não por preciosismo. Desenho botânico é composição antes de ser ilustração: um ramo no ombro funciona quando acompanha a curva do deltoide em vez de disputar com ela, e uma braçadeira fecha a volta do antebraço sem virar faixa cheia. O mesmo galho fica certo na costela e errado nas costas.",
      },
      {
        pergunta: "Que referência eu levo?",
        resposta:
          "Foto da planta de verdade — a planta, não a tatuagem de outra pessoa. É de foto de planta que saem os desenhos que ninguém mais tem. Se você já sabe a região do corpo, manda junto: é o que define o formato da composição.",
      },
    ],
    mensagemWhatsapp:
      "Olá Clara! Vim pela página de tatuagem botânica do site e gostaria de fazer um orçamento.",
  },
  {
    slug: "geek",
    categoriaId: "geek",
    termoPrincipal: "tatuagem geek bh / tatuagem anime bh",
    seoTitle: "Tatuagem Geek e de Anime em BH | Clara Nasc",
    seoDescription:
      "Tatuagem geek e de anime em Belo Horizonte: personagens, cenas e símbolos em preto e cinza. Veja o portfólio autoral e faça seu orçamento pelo WhatsApp.",
    h1: "Tatuagem geek e de anime em Belo Horizonte",
    chamada:
      "Personagens, cenas e símbolos de anime, quadrinho, jogo e livro — redesenhados do zero.",
    faq: [
      {
        pergunta: "Dá para tatuar qualquer personagem?",
        resposta:
          "Quase sempre, mas nem sempre no tamanho que a pessoa imaginou. A tela tem cor e resolução infinitas; a pele não. O que sustenta um desenho por vinte anos é contraste, não detalhe — então um personagem cheio de detalhe miúdo ou cresce, ou é simplificado. Eu digo qual dos dois antes de fechar o orçamento.",
      },
      {
        pergunta: "Você copia uma tatuagem que eu vi na internet?",
        resposta:
          "Não copio arte de outro tatuador. Se você trouxer uma referência que já é tatuagem, eu uso como direção — o estilo, o enquadramento, a densidade — e desenho a cena de novo, medida para o seu corpo. Referência de anime, quadrinho, jogo ou livro é ponto de partida; tatuagem de outra pessoa é ponto de partida também, nunca de chegada.",
      },
      {
        pergunta: "Precisa ser colorida?",
        resposta:
          "Não, e na maioria das vezes é melhor que não seja. Preto e cinza com bom contraste continua legível de longe e envelhece por igual. Quando entra cor, ela funciona melhor em pontos: o dragão do antebraço da galeria tem vermelho em três lugares só, porque cor demais compete com o preto e some primeiro.",
      },
    ],
    mensagemWhatsapp:
      "Olá Clara! Vim pela página de tatuagem geek e anime do site e gostaria de fazer um orçamento.",
  },
  {
    slug: "blackwork",
    categoriaId: "blackwork",
    termoPrincipal: "blackwork bh",
    seoTitle: "Tatuagem Blackwork em BH | Clara Nasc",
    seoDescription:
      "Tatuagem blackwork em Belo Horizonte: preto sólido, pontilhismo, geometria e negativo. Veja o portfólio da tatuadora Clara Nasc e agende pelo WhatsApp.",
    h1: "Tatuagem blackwork em Belo Horizonte",
    chamada:
      "Preto sólido, pontilhismo e geometria — onde o vazio da pele também é desenho.",
    faq: [
      {
        pergunta: "Quanto tempo leva um braço fechado em blackwork?",
        resposta:
          "Mais de uma sessão, sempre. Preto sólido é a técnica menos perdoadora que existe: uma área chapada mostra qualquer falha de profundidade, e se a tinta não entrou parelha isso aparece meses depois como um clarão no meio do preto, sem retoque discreto possível. É trabalho lento, feito em passadas — um braço fechado não sai em uma tarde.",
      },
      {
        pergunta: "Preto sólido desbota?",
        resposta:
          "Clareia, mas por igual — e é justamente por isso que blackwork é o estilo que melhor envelhece. Pigmento colorido desbota mudando de tom; o preto não vira outra cor. Uma peça pensada com vão suficiente entre as massas continua legível vinte anos depois, que é o oposto do que acontece com detalhe fino demais.",
      },
      {
        pergunta: "Blackwork serve para cobrir uma tatuagem antiga?",
        resposta:
          "Serve, e é uma das formas mais eficazes — massa escura é o que resolve as áreas mais saturadas de um trabalho anterior. Na página de Coberturas, aqui do site, tem exemplos de cover-up resolvidos em preto.",
      },
    ],
    mensagemWhatsapp:
      "Olá Clara! Vim pela página de blackwork do site e gostaria de fazer um orçamento.",
  },
  {
    slug: "fine-line",
    categoriaId: "fineline",
    termoPrincipal: "tatuagem fine line bh",
    seoTitle: "Tatuagem Fine Line em BH | Traço Fino | Clara Nasc",
    seoDescription:
      "Tatuagem fine line em Belo Horizonte: traço fino feito para durar. Veja o portfólio, entenda onde o fine line funciona melhor e agende pelo WhatsApp.",
    h1: "Tatuagem fine line em Belo Horizonte",
    chamada:
      "Traço fino, pouco preenchimento — desenhado contando com o que o tempo faz com a linha.",
    faq: [
      {
        pergunta: "Fine line dura? Vou precisar retocar?",
        resposta:
          "Traço fino espalha — a tinta migra alguns décimos de milímetro dentro da pele ao longo dos anos. Em uma linha grossa isso não se nota; em uma linha de meio milímetro, é a diferença entre duas linhas separadas e uma mancha só. Não é defeito de execução, é como a pele funciona. O que dá para fazer é desenhar contando com isso: espaço entre as linhas, menos detalhe por centímetro, e sombreado interno onde o volume precisa vir sem engrossar o contorno.",
      },
      {
        pergunta: "Onde no corpo o fine line funciona melhor?",
        resposta:
          "Antebraço, costas, coxa e clavícula seguram traço fino muito bem. Mão, dedo, pé e costela são pele fina, com muito movimento ou muita renovação — ali o fine line pede retoque mais cedo. Eu prefiro combinar isso antes, e não depois.",
      },
      {
        pergunta: "Dá para fazer bem pequenininho?",
        resposta:
          "Dá, até certo ponto. O limite não é o tamanho em si, é quanto detalhe você quer dentro dele: linhas próximas demais se encontram com o tempo, e aí o desenho fecha. Se a ideia não couber no tamanho que você imaginou, eu digo o que muda — normalmente é crescer um pouco ou tirar detalhe, e as duas saídas envelhecem melhor que insistir.",
      },
    ],
    mensagemWhatsapp:
      "Olá Clara! Vim pela página de fine line do site e gostaria de fazer um orçamento.",
  },
];

/** Rótulo vem do portfolioData, nunca repetido aqui — ele tem um dono só. */
export function rotuloDoNicho(nicho: Nicho): string {
  return (
    PORTFOLIO_CATEGORIES.find((cat) => cat.id === nicho.categoriaId)?.label ??
    nicho.h1
  );
}

/** As fotos da categoria, na ordem em que estão no portfólio. */
export function fotosDoNicho(nicho: Nicho): PortfolioItem[] {
  return portfolioItems.filter((item) => item.category === nicho.categoriaId);
}

/** Caminho da página, para os links internos. Um lugar só monta a URL. */
export function caminhoDoNicho(nicho: Nicho): string {
  return `/tatuagem/${nicho.slug}`;
}

/** `undefined` quando a categoria não tem página — é o caso do filtro "Todos". */
export function nichoDaCategoria(categoriaId: string): Nicho | undefined {
  return NICHOS.find((nicho) => nicho.categoriaId === categoriaId);
}
