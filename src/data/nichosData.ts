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
      "Cobertura boa é quando você sai do estúdio sem nem lembrar do que existia por baixo da tatuagem nova.",
    faq: [
      {
        pergunta: "Qualquer tatuagem pode ser coberta?",
        resposta:
          "O que decide não é o quanto você gosta menos dela: é o quanto de preto ela tem. Traço fino e cinza claro dão mais liberdade, e cabe quase qualquer desenho novo em cima. Preto sólido e áreas muito saturadas exigem um estudo maior de caso — por isso, na maioria das vezes, é necessária uma visita ao estúdio, para que eu possa avaliar pessoalmente e propor tipos de trabalhos que irão entregar um resultado satisfatório.",
      },
      {
        pergunta: "A cobertura sai em uma sessão só?",
        resposta:
          "Varia muito em cada caso, mas não é impossível. Coberturas exigem um processo completamente diferente de uma tattoo que é feita do zero, aumentando bastante o nível de complexidade. Quando a tatuagem antiga é muito escura, o caminho mais honesto é clarear antes com algumas sessões de laser e cobrir depois — o resultado é outro patamar, e eu prefiro dizer isso antes de começar.",
      },
      {
        pergunta: "Como faço para saber se a minha cobre?",
        resposta:
          "Me manda uma foto da tatuagem atual pelo WhatsApp, com luz natural e sem filtro — é o que mostra a saturação de verdade. Eu respondo com o que dá para fazer, o tamanho que a peça nova precisa ter e quantas sessões em média seriam necessárias para o trabalho ser finalizado.",
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
          "Dura, se for desenhada contando com o tempo. Traço muito fino e muito junto se fecha, já que a expansão do traço é um processo natural que acontece na nossa pele ao longo dos anos. É importante saber criar uma arte que saiba equilibrar detalhes com clareza, e que consequentemente, envelheça bem.",
      },
      {
        pergunta: "Você faz desenho de catálogo ou é tudo autoral?",
        resposta:
          "Autoral, e não por preciosismo! Desenho botânico é composição antes de ser ilustração: um ramo no ombro funciona quando acompanha a curva do corpo em vez de disputar com ele. É sempre importante levar em consideração o tamanho e o local que a tatuagem será realizada para que ela orne no corpo da forma mais orgânica possível.",
      },
      {
        pergunta: "Que referência eu levo?",
        resposta:
          "Toda referência é válida! De outra tatuagem, desenhos, flores reais ou um esboço que você mesmo fez. O importante é eu conseguir entender sua ideia pra assim, construir uma arte do jeitinho que você imaginou.",
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
      "De uma nerd para o outro(a): traz a referência que eu transformo em tatuagem!",
    faq: [
      {
        pergunta: "Dá para tatuar qualquer personagem?",
        resposta:
          "Sim! Porém desenho na pele tem limitações. O que sustenta um desenho por vinte anos é contraste, não detalhe — então um personagem cheio de detalhes pequenos ou cresce, ou é simplificado. Eu sempre explico o que funciona ou não como tatuagem, pra chegarmos em um consenso que atenda tanto a sua ideia, quanto te entregue um trabalho que vai envelhecer bem.",
      },
      {
        pergunta: "Você copia uma tatuagem que eu vi na internet?",
        resposta:
          "Não copio arte de outro tatuador. Se você trouxer uma referência que já é tatuagem, eu uso como direção — o estilo, o enquadramento, a densidade — e desenho a cena de novo, medida para o seu corpo. Referência de anime, quadrinho, jogo ou livro é ponto de partida; tatuagem de outra pessoa é ponto de partida também, nunca de chegada (além de ser muito mais legal ter algo que é só seu <3).",
      },
      {
        pergunta: "Precisa ser colorida?",
        resposta:
          "Não, tattoo geek funciona de várias formas! É só adaptarmos sua ideia pro estilo de tatuagem que você mais se identifica.",
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
          "O número de sessões depende de vários fatores, como resistência do próprio cliente, horas de sessão, complexidade do desenho, entre outros. Portanto, é algo bem imprevisível, mas durante o orçamento eu sempre dou uma estimativa do quanto vamos gastar de acordo com o trabalho.",
      },
      {
        pergunta: "Preto sólido desbota?",
        resposta:
          "Toda tatuagem desbota, esse é um processo natural da nossa pele que está sempre em constante renovação. Porém, o que faz uma tatuagem legível depois de anos é a habilidade e técnica da tatuadora no momento da aplicação. Durante o orçamento eu sempre deixo claro o que funciona ou não ao longo prazo e os caminhos que podemos seguir pra termos o melhor trabalho possível.",
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
      "Pra quem gosta de tattoos com traços finos e delicados.",
    faq: [
      {
        pergunta: "Fine line dura? Vou precisar retocar?",
        resposta:
          "Sim, e nem sempre a tatuagem vai precisar de retoque. Após o período de cicatrização, eu sempre peço foto da tatuagem para avaliar se será preciso ou não uma nova aplicação.",
      },
      {
        pergunta: "Onde no corpo o fine line funciona melhor?",
        resposta:
          "Qualquer região do corpo. Entretanto, regiões com pele mais fina como, mão, dedos, pé e costela, com muito movimento ou muita renovação — pedem retoque mais cedo. Eu sempre deixo claro os riscos de desbotamento dependendo da área do corpo escolhida.",
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
