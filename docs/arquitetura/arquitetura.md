# Arquitetura do Site

O site usa **Islands Architecture**, do Astro: a página entrega HTML estático por
padrão (SSG) e carrega JavaScript só nos fragmentos que precisam de
interatividade — as "ilhas".

## Estrutura

```
src/
├── assets/
│   ├── portfolio/   Fotos do portfolio (entram pelo pipeline de imagem)
│   └── about-artist.webp
├── components/
│   ├── layout/      AppLayout (wrapper estatico)
│   ├── portfolio/   GaleriaGrid.astro (grade + lightbox, compartilhada)
│   ├── seo/         Seo.astro, LocalBusinessSchema.astro,
│   │                BreadcrumbSchema.astro, FaqSchema.astro
│   ├── sections/    Header.tsx, ContactForm.tsx, Footer.tsx
│   │                Hero.astro, Portfolio.astro, About.astro
│   ├── ui/          Primitivos: Button, Input, Select, Textarea
│   │                Marca: InstagramIcon, TiktokIcon
│   ├── FloatingCta.astro
│   └── Lightbox.tsx
├── data/            siteData.ts (negocio), portfolioData.ts (galeria),
│                    nichosData.ts (texto das paginas por nicho)
├── layouts/         BaseLayout.astro (head + header + rodape + reveal)
├── pages/           index.astro
│                    tatuagem/[categoria].astro  -> 5 paginas
└── styles/          base/ + components/ + sections/, agregados por global.css
```

`assets/` (raiz) guarda arte original e **não é servida**. `public/` é servido
literalmente — tudo que está lá é peso baixável, referenciado ou não, e **não
passa pelo pipeline de imagem** (ver a seção abaixo).

`Anúncios/` (raiz) é o acervo de fotos originais, ~1,3 GB, fora do repositório
via `.gitignore`. O que vai ao ar são as cópias processadas em `src/assets/`.

## As seis páginas

O site deixou de ter uma página só em 04/08/2026, com a
[#11](https://github.com/clara-nascie/claranasc/issues/11).

| URL | Papel |
| --- | --- |
| `/` | home: hero, galeria com filtro, bio, formulário |
| `/tatuagem/coberturas` | cobertura de tatuagem bh |
| `/tatuagem/botanico` | tatuagem botânica bh |
| `/tatuagem/geek` | tatuagem geek bh / anime bh |
| `/tatuagem/blackwork` | blackwork bh |
| `/tatuagem/fine-line` | tatuagem fine line bh |

O motivo é de SEO, não de organização: **uma página ranqueia realisticamente
para um cluster de busca**. A home tentando cobrir cinco nichos vira a segunda
melhor resposta para cinco buscas em vez da melhor para uma.

As cinco vêm de uma rota dinâmica só, `pages/tatuagem/[categoria].astro`, com
`getStaticPaths` sobre `NICHOS`. Cinco arquivos iguais divergiriam na primeira
correção feita em quatro deles. O que muda entre as páginas é **dado**, e dado
mora em `data/nichosData.ts`.

> ⚠️ O `slug` da URL nem sempre é o `id` da categoria: `fineline` no código,
> `fine-line` na URL, porque é assim que se busca. Mudar um slug depois que a
> página tiver tráfego quebra o link e zera o histórico da URL no Google —
> exige redirecionamento.

**Uma linha de texto por página, não parágrafos.** A primeira versão trouxe as
200-300 palavras que a issue #11 pedia. A Clara cortou tudo em 04/08/2026 — "as
pessoas não leem" —, e o que ficou é uma frase de contraste abaixo do H1.

O texto voltou no mesmo dia, em outro formato: **FAQ em accordion**, 3 perguntas
por nicho, fechadas por padrão (a outra metade da
[#13](https://github.com/clara-nascie/claranasc/issues/13)). Três linhas na
tela; quem só quer ver foto rola e ignora, quem está decidindo clica e lê. As
respostas são o texto cortado, reaproveitado.

A pergunta é conteúdo de SEO tanto quanto a resposta: escrita como a pessoa
digita ("*fine line dura?*"), ela faz a página poder responder buscas em forma
de pergunta, e não só "tatuagem fine line bh".

### ⚠️ Accordion fechado **não** é conteúdo oculto

A distinção que o Google faz não é "aparece de primeira?", é **"a pessoa
consegue ver?"**.

| | Texto oculto | Accordion |
| --- | --- | --- |
| Está no HTML | sim | sim |
| A pessoa consegue abrir | **nunca** | sim, um clique |
| Robô e visitante recebem o mesmo | sim | sim |
| Permitido | ❌ infração | ✅ |

Duas coisas que o projeto **não** pode fazer, e que têm nome: *hidden text*
(texto que ninguém consegue ver — branco no branco, `font-size: 0`, fora da
tela) e *cloaking* (servir conteúdo diferente para o Googlebot). A penalidade
não é ranquear menos, é ação manual.

> Vale registrar que aqui **nem seria possível**: o site é estático. O build
> gera arquivos `.html` na borda da Cloudflare, e o Googlebot baixa exatamente
> o mesmo arquivo que a visitante. Não existe código no servidor para decidir
> "para este aqui eu mando texto a mais".

O accordion é `<details>`/`<summary>` nativo, **sem JavaScript**. Não é
economia: o elemento já traz abrir/fechar, foco por teclado, `Enter`/`Espaço` e
`aria-expanded` correto — tudo que um accordion de `<div>` + script precisaria
reimplementar, e costuma errar.

`FaqSchema.astro` emite `FAQPage`. **Não conte com o resultado expandido**: em
2023 o Google restringiu esse rich result a sites de governo e saúde, então para
um estúdio de tatuagem ele não aparece. O schema fica porque custa zero e
continua descrevendo a estrutura da página; o ganho real está no texto existir
no HTML.

> `npm run verificar:nichos` compara **toda pergunta e resposta do JSON-LD com
> o texto renderizado da página**. É a checagem que impede o schema e a tela de
> divergirem — validada injetando uma pergunta fantasma no schema e confirmando
> que as 5 páginas reprovam.

**Portfólio em duas camadas.** A home mostra 6 fotos por categoria, igual para
todas, para nenhuma pesar mais que outra no que se vê primeiro. As páginas por
nicho recebem o volume, sem cota — é o que dissolve o conflito entre "equilibrar
as categorias" e "mostrar quantidade de trabalho". Hoje elas ainda mostram as
mesmas 6, porque as outras 138 fotos dependem do texto da
[#16](https://github.com/clara-nascie/claranasc/issues/16).

**Masonry, e não a grade da home.** A grade recorta tudo em `4/5` porque o
filtro esconde e mostra itens, e altura uniforme evita que a página salte a cada
clique. Nas páginas por nicho não há filtro, e o acervo mistura costas,
antebraço e costela — recortar todas na mesma proporção corta desenho no meio.
O masonry é `columns` do CSS, sem JS: a alternativa nativa
(`grid-template-rows: masonry`) ainda não saiu de flag experimental, e
biblioteca de masonry mede as fotos no cliente, ou seja, só acerta o layout
depois que elas carregam, com salto visível.

## Ilhas de interatividade

Três componentes hidratam hoje, todos com `client:load`:

| Componente | Por que hidrata |
| --- | --- |
| `Header` | abre/fecha o menu mobile |
| `ContactForm` | estado do formulário e montagem da mensagem do WhatsApp |
| `Lightbox` | galeria ampliada |

O resto — `Hero`, `Portfolio`, `About`, `Footer`, `AppLayout`, `FloatingCta` —
é HTML estático, sem JavaScript de componente.

`Hero`, `Portfolio` e `About` são `.astro`, não React. Dois motivos: o `<Image>`
do `astro:assets` só existe em componente Astro, e o filtro da galeria é mostrar
e esconder elemento — `classList.toggle`, não estado de framework. O componente
tem um `<script>` próprio para isso e dispara o mesmo `CustomEvent` que o
Lightbox já escutava.

> Converter React para `.astro` é seguro quando o componente **não tem `client:`
> em `index.astro`** — nesse caso ele já era renderizado estático e nada de
> interatividade se perde. Foi o critério nas três conversões. Componente Astro
> continua podendo usar ícone do `lucide-react`: ele renderiza no build.

> Há espaço para melhorar: `Header` poderia ser CSS + script mínimo, e
> `ContactForm`/`Lightbox` poderiam ser `client:visible` em vez de `client:load`.
> Rastreado em [#12](https://github.com/clara-nascie/claranasc/issues/12).

## ⚠️ Hidratação: a regra que não pode ser quebrada

Quando o React hidrata uma ilha, ele compara o HTML que o servidor gerou com o
que ele mesmo produziria. **Se não baterem, ele descarta a árvore do servidor e
recria tudo no cliente** — e qualquer `IntersectionObserver`, `addEventListener`
ou referência a esses nós, criada antes da hidratação, é perdida silenciosamente.

Foi exatamente o que acontecia com os ícones via CDN do Lucide, que substituíam
`<i data-lucide>` por `<svg>` depois do carregamento. Diagnóstico completo em
[#10](https://github.com/clara-nascie/claranasc/issues/10).

**Regra**: nada pode mutar o DOM depois da renderização. Ícones e conteúdo devem
estar no HTML desde o início.

Consequência prática ao escrever scripts: `#home`, `#portfolio` e
`.main-footer` são estáveis (não hidratam). `#contato` ainda é uma ilha, mas
não é mais substituído porque a causa foi corrigida — se alguém reintroduzir
mutação de DOM, volta a ser trocado. `npm run verificar` detecta isso.

## Pipeline de imagem

Toda foto do site entra por `import` de dentro de `src/`, nunca por caminho de
texto para `public/`. **Só o que é importado passa pelo `astro:assets`**, que no
build gera as variantes responsivas em WebP e monta o `srcset`. Arquivo em
`public/` é copiado byte a byte — a foto original inteira chegaria ao navegador
da visitante.

* `portfolioData.ts` importa cada imagem e expõe `image: ImageMetadata`.
* `Hero.astro` e `Portfolio.astro` usam `<Image>` com `widths` e `sizes`
  derivados do layout real (grade de 3 colunas de ~380px; vitrine do hero de
  ~340px e ~250px), mais o dobro para telas 2x.
* O lightbox precisa de uma versão maior que a miniatura: `getImage()` gera uma
  variante de 1400px no build e a URL vai num `data-` do botão.
* Os arquivos em `src/assets/portfolio/` já vêm reduzidos para 1600px — o
  suficiente para a maior variante pedida. Guardar o original de 9000px só
  incharia o repositório.
* Nome de arquivo é conteúdo, não identificador: `cobertura-girassol-ombro.webp`
  descreve a foto para busca por imagem. Ao trocar uma foto, troque o nome.

Efeito medido na home: 4.296 KB antes, 70 KB no celular e 294 KB em desktop 2x.

### ⚠️ Foto de conteúdo é `<img>`, nunca `background-image`

**Imagem de fundo não tem tamanho intrínseco.** Se o contêiner perder a largura
própria, a foto some sem erro nenhum.

Foi o que aconteceu com a foto da artista, invisível em produção em **toda tela
até 992px** ([#18](https://github.com/clara-nascie/claranasc/issues/18)): abaixo
de 992px o `.about-grid` vira coluna única e o item ganha `margin: 0 auto` —
**margem automática em item de grid cancela o `stretch` padrão**, e o item passa
a se ajustar ao conteúdo. O conteúdo era uma `<div>` vazia, então sobraram 2px
de borda.

A exceção legítima é decoração pura: o crisântemo do hero (`.hero-flor`) é
`background-image` com `aria-hidden`, `width` e `aspect-ratio` explícitos. A
regra vale para foto que carrega informação.

> ⚠️ Ao importar imagem de `src/assets/` para dentro do JSON-LD, **confira o
> resultado em `dist/`, não no dev server**. No dev o `.src` resolve para
> `/@fs/C:/Users/...` — um caminho da máquina local. No build resolve certo,
> para `/_astro/nome.<hash>.webp`.

## Scripts no cliente

* `BaseLayout.astro` tem um único `<script>` (módulo, portanto deferido) com um `IntersectionObserver` que adiciona `.active` para as animações de entrada, e dá `unobserve` após revelar cada elemento. Morava em `index.astro` até as seis páginas existirem.
* `Portfolio.astro` tem o script do filtro de categoria — só a home filtra; as páginas por nicho já chegam filtradas pela URL.
* `GaleriaGrid.astro` tem a delegação de clique que abre o lightbox. O seletor é `[data-galeria]`, e não um id fixo, porque o componente agora aparece em seis páginas.
* `FloatingCta.astro` tem o próprio script, que observa `[data-cta-apos]` para aparecer e `#contato`/`.main-footer` para se esconder.

> ⚠️ O gatilho do `FloatingCta` era `#home`, o hero — o que dava no mesmo
> enquanto só existia a home. Nas páginas por nicho não há `#home`, e o fallback
> do componente ligava o botão já no topo, por cima do primeiro parágrafo do
> texto (medido a 390px de largura). Hoje cada página **declara** seu bloco de
> entrada com `data-cta-apos`: o hero na home, o `.nicho-intro` nas outras.
> Coberto por `npm run verificar:nichos`.
* Todos usam `IntersectionObserver` em vez de listener de `scroll`: o navegador reporta o cruzamento em vez de executar código a cada pixel rolado, o que mantém a main thread livre.

> ⚠️ **Não use `threshold` por fração de área em elemento que pode crescer.**
> `threshold: 0.15` exige que 15% da área do elemento esteja na tela, e essa
> fração fica inalcançável quando o elemento é muito mais alto que a viewport —
> a galeria com 30 fotos mede 14.000px no celular contra 844px de tela, ou seja,
> no máximo 6% aparece de uma vez. O observador nunca dispara e a seção fica em
> `opacity: 0` para sempre. Use `rootMargin`, que não depende da altura.
> Coberto por `npm run verificar:galeria`.

## SEO

* `Seo.astro` centraliza title, description, canonical, Open Graph e Twitter Card. Páginas novas devem reusá-lo — o `BaseLayout` já faz isso, então basta passar `title` e `description`.
* `BreadcrumbSchema.astro` emite o `BreadcrumbList` das páginas por nicho. É o que troca a URL crua no resultado do Google pela trilha legível (`Clara Nasc › Portfólio › Fine Line`). A trilha visível e a do JSON-LD saem da **mesma lista** na página: schema que descreve navegação inexistente conta como divergência.
* O `LocalBusinessSchema` vai em **todas** as páginas, não só na home. Todos os blocos usam o mesmo `@id`, então o Google lê o mesmo estúdio descrito seis vezes, e não seis estúdios. A página por nicho é justamente a que pode ser a porta de entrada de quem busca "cobertura de tatuagem bh", e precisa carregar endereço e telefone junto.
* **Links recíprocos**: a home linka as cinco páginas (bloco "Ver por estilo", abaixo da grade) e cada nicho linka os outros quatro e a home. Página órfã o Google demora muito mais para descobrir e trata como menos importante.
* Links do cabeçalho e do rodapé são `/#secao`, e **não** `#secao`. A âncora nua só funciona na página que tem a seção; em cinco das seis URLs ela não fazia nada.
* `LocalBusinessSchema.astro` emite JSON-LD com `TattooParlor` + `Person` + `WebSite`, ligados por `@id`. Campos sem dado real são **omitidos**, nunca vazios — campo ausente é lido como "não informado", campo errado como informação falsa.
* URLs absolutas dependem de `site` estar definido em `astro.config.mjs`.
* Desde 01/08/2026 **nenhum campo está vazio**: endereço, CEP, coordenadas, horários, telefone, imagem e `sameAs` (Instagram e TikTok) têm dado real. Tudo sai de `siteData.ts`.
* A imagem de compartilhamento é `public/assets/og-clara-nasc.jpg`, recorte 1200x630 de uma foto real. É **JPEG e não WebP** de propósito: alguns raspadores de link ainda tropeçam em WebP, e essa é a imagem que precisa abrir em qualquer lugar. Receita em `assets/README.md`.
* O `image` do negócio lê `OG_IMAGE.path` em vez de repetir o caminho. Foi a duplicação que deixou um placeholder gerado por IA sobreviver ali: ele sumiu da tela e ninguém lembrou que havia uma segunda referência mandando-o para o Google.

### ⚠️ O que o site **não** resolve sozinho

O JSON-LD confirma e conecta a entidade, mas **não coloca o estúdio no mapa**. O
bloco de três resultados com mapa é alimentado pelo **Google Business Profile**,
que ainda não existe. Refinar o schema não substitui criar a ficha.

Antes de criar, há um nome a decidir: hoje são três — `Clara Nasc Tattoo`
(`SITE.businessName`), `Iuna Tattoo` (o estúdio) e `Clara Nascimento TATTOO`
(o Instagram). O Google usa consistência de nome para concluir que registros
são a mesma entidade.

## Hospedagem e deploy

* **Cloudflare Pages**, build a cada push na `main`. O push publica direto em produção, sem etapa de aprovação.
* Configuração: build command `npm run build`, output `dist`.
* Sem servidor Node em runtime — só arquivos estáticos na edge.

## Verificação

Quatro scripts, todos com Chromium headless (Playwright):

| Comando | Cobre |
| --- | --- |
| `npm run verificar` | botão flutuante por scroll, erros de console, requisições falhas, contraste computado a partir das cores renderizadas e **se a foto da artista tem tamanho de verdade** |
| `npm run verificar:galeria` | filtro por categoria, abertura e fechamento do lightbox, e se a grade **fica de fato visível** |
| `npm run verificar:nichos` | as 5 páginas por nicho: H1 único, limites de title/description, canonical vs. sitemap, tamanho da chamada, masonry em 3 colunas, proporção das fotos, `BreadcrumbList` vs. trilha da tela, **`FAQPage` vs. texto visível**, links internos sem 404 e o botão flutuante |
| `npm run verificar:contraste` | contraste de cada texto do hero e do cabeçalho contra o fundo **renderizado**, pixel a pixel, em 8 larguras |

> ⚠️ Rode o `verificar:nichos` contra `npm run preview`, não contra
> `npm run dev`. Duas razões, ambas descobertas rodando errado: o Playwright
> **atravessa shadow DOM aberto**, e a barra de ferramentas do Astro no dev é um
> web component cheio de `<h1>` — a checagem de "um H1 por página" acusava
> quatro numa página que tem um só. E o sitemap só existe no build, então a
> comparação entre canonical e sitemap não roda no dev (o script avisa quando
> pula).

O tema comum aos três: **existir no DOM não é aparecer.** Cada um nasceu de um
bug que sobreviveu em produção porque nada olhava aquilo.

* A galeria teve os 30 itens presentes e corretamente filtrados, e invisível no
  celular — `.reveal` começa em `opacity: 0`.
* A foto da artista ficou colapsada em 2x3 pixels em toda tela até 992px.
* O `verificar-visual.mjs` mede contraste procurando `background-color` nos
  ancestrais, e por isso é **cego para imagem de fundo**: aprovou 12/14 enquanto
  o subtítulo do hero media 2,10:1 sobre o crisântemo. Daí o terceiro script,
  que pinta o texto de transparente, captura só o fundo e lê o pixel mais
  escuro sob cada trecho.

> Ao adicionar checagem nova, **valide-a contra o bug**: injete o defeito e
> confirme que ela reprova. Checagem que nunca falhou não prova nada.

Duas lições que custaram falsos negativos no `verificar:nichos`:

* **Ancore em elemento, nunca em pixel.** Um `scrollTo(0, 2000)` passou enquanto
  as páginas tinham 300 palavras e reprovou quatro das cinco assim que o texto
  foi cortado — as páginas encolheram e o rodapé passou a estar visível naquela
  altura, onde esconder o botão flutuante é o comportamento *correto*. Rolar até
  `.portfolio-grid--masonry` mede a intenção; rolar até `y=2000` mede o layout
  de ontem.
* **Meça a propriedade, não o sintoma.** A checagem de masonry contou primeiro
  "posições de topo distintas", que reprovava Blackwork porque suas seis fotos
  têm só duas proporções e as colunas se alinham sozinhas — sem defeito algum. O
  que o layout precisa ter é altura vinda da própria foto.

Falhas conhecidas e já rastreadas estão declaradas em `FALHAS_ACEITAS`, presente
nos dois scripts de contraste: aparecem como aviso e não reprovam. Ao corrigir
uma, remova a entrada. Hoje são as três do `--accent-gold`, que a Clara decidiu
não alterar por ser cor de marca.

⚠️ O CI (`.github/workflows/verificar.yml`) roda `verificar`,
`verificar:galeria` e `verificar:nichos`, os três contra o `preview` do build.
O `verificar:contraste` é manual por enquanto.
