# Issues / Próximas Tarefas 🚀

Este documento lista as tarefas pendentes que devem ser iniciadas na próxima sessão de desenvolvimento, focadas principalmente na **Fase de Mídia, SEO e Acessibilidade**.

## 📝 Lista de Issues (Backlog)

- [x] **Issue 1: Otimização de Imagens e Estruturação de Portfólio (Mídia)**
  - [x] Criar estrutura de dados tipada (`src/data/portfolioData.ts`) e pasta de mídias (`public/portfolio/`).
  - [x] Otimizar imagens demonstrativas (formato WebP leve).
  - [x] Aplicar `loading="lazy"` e `decoding="async"` para performance máxima no Google.

- [x] **Issue 2: SEO Básico e Meta Tags Avançadas** _(concluída em 29/07/2026)_
  - [x] Título e description reescritos com foco em "Tatuadora em BH" + os 5 nichos. Removida a `meta keywords` (ignorada pelo Google desde 2009 e continha `tatuagem sp`, cidade errada).
  - [x] Open Graph corrigido: `og:image` agora é **URL absoluta** — era caminho relativo, o que quebrava a prévia de link no WhatsApp/Instagram/Facebook. Adicionados `og:site_name`, `og:locale`, dimensões, alt e Twitter Card.
  - [x] `site: 'https://claranasc.com'` no `astro.config.mjs` (pré-requisito para URL absoluta e sitemap).
  - [x] `<link rel="canonical">` e `robots: index, follow, max-image-preview:large`.
  - [x] `@astrojs/sitemap` instalado — sitemap gerado no build. `sitemap.xml` manual removido e `robots.txt` apontando para `/sitemap-index.xml`.
  - [x] **JSON-LD `TattooParlor` + `Person` + `WebSite`** com `areaServed` (BH e região) e os 5 nichos como `Service`. Campos sem dado real são omitidos, não emitidos vazios.
  - [x] Criado `src/data/siteData.ts` como fonte única (WhatsApp estava duplicado em 2 componentes) e `src/components/seo/` reaproveitável pelas futuras páginas por nicho.
  - [x] Corrigido: `select` do formulário estava desalinhado dos nichos oficiais (tinha "Ornamental", faltavam Botânico, Geek e Coberturas).
  - [x] Corrigido: mensagem do WhatsApp interpolava input da cliente sem encode — `&` ou `#` na descrição truncavam a mensagem.

- [ ] **Issue 2.1: Preencher os dados reais do negócio** ⚠️ _bloqueia o local pack_
  - Em `src/data/siteData.ts`, há `TODO(clara)` em: `LOCATION.streetAddress`, `postalCode`, `geo` (lat/long), `OPENING_HOURS` e `SOCIAL.instagram`.
  - Sem endereço e coordenadas, o schema funciona mas **não gera pino no Google Maps** — que é o principal canal de busca local.
  - Criar/verificar o **Google Business Profile** e o **Google Search Console** (peso maior que o próprio site para "tatuagem bh").

- [ ] **Issue 2.2: Imagens não são WebP de verdade** 🔴 _achado em 29/07/2026_
  - Todos os arquivos `.webp` em `public/` **são JPEG renomeados** — a conversão da Issue 1 nunca aconteceu, só a extensão mudou. Os navegadores renderizam (fazem sniffing do magic byte), por isso passou despercebido, mas **zero ganho de compressão foi obtido**.
  - **10,59 MB de imagens** no total. `hero-bg` (elemento LCP) tem 800 KB; `favicon.png` tem 339 KB; `site-icon.png` tem **5,1 MB** e parece não ser referenciado em lugar nenhum.
  - **3 pares são byte-a-byte idênticos**: `hero-bg` == `tattoo2`, `tattoo1` == `tattoo5`, `tattoo3` == `tattoo6`. Existem só **4 fotos distintas para 6 itens** de portfólio — ou seja, a mesma foto aparece sob títulos e categorias diferentes (ex: a "Fine Line Floral Lavender" e a "Botânico Orquídeas" são a mesma imagem), com `alt` descrevendo algo que não está na foto.
  - 🔴 **Confirmado visualmente em 29/07/2026** (captura via Playwright): os rótulos não descrevem as fotos.
    - Itens 1 e 2 exibem **a mesma foto de lavanda**, mas o item 2 é rotulado "Botânico / Orquídeas" com `alt` mencionando orquídea — flor que não está na imagem.
    - O item 4, rotulado "Geek & Animes" com `alt` "estilo Geek e Anime", exibe uma **borboleta monarca colorida**. Nada de geek ou anime.
    - Itens 5 e 6 exibem **a mesma mandala**, rotulados como "Cobertura" e "Fine Line" respectivamente.
    - Impacto duplo: `alt` que não corresponde à imagem é sinal negativo para o Google (e inútil para leitores de tela), e uma cliente que procura tatuagem geek não vê nenhum exemplo real.
  - Ação: converter de verdade para WebP/AVIF, substituir as duplicatas por fotos reais de cada nicho, remover `site-icon.png` se for órfão, gerar favicon pequeno.

- [ ] **Issue 3: Acessibilidade (a11y)**
  - Adicionar atributos `alt` descritivos em todas as imagens (especialmente as do portfólio e ícones).
  - Adicionar `aria-labels` em botões que contêm apenas ícones (como botões de fechar menu, filtros de galeria, etc).
  - Garantir contraste adequado nos textos secundários e dicas de usabilidade para leitores de tela.
  - 🔴 **Contraste dos dois botões do hero falha na WCAG AA** _(medido em 29/07/2026 com `npm run verificar`)_:
    - `.btn-secondary` ("Ver Portfólio"): **1,30:1** — `color: var(--text-primary)` é quase preto sobre o `.hero-overlay`, que é `rgba(10,10,10,0.6→0.95)`. Fica visivelmente ilegível. A classe foi escrita para o fundo creme do resto da página, onde funciona; no hero escuro, não.
    - `.btn-primary` ("Orçamento & Agendamento"): **3,78:1** — creme sobre marrom mel.
    - AA exige 4,5:1 para texto deste tamanho (0.9rem). Correção sugerida: variante clara escopada em `.hero-actions .btn-secondary`, sem mexer na classe base. Clarear o `.hero-overlay` **não** serve: pioraria o contraste do título e do subtítulo, que são claros.

- [ ] **Issue 4: Refinamentos Finais de UI/UX**
  - Checar responsividade geral em telas muito pequenas ou tablets (após as últimas alterações de layout).
  - Validar funcionamento dos links de contato (WhatsApp).
  
- [ ] **Issue 5: Páginas dedicadas por nicho** 🎯 _maior teto de ranqueamento_
  - Uma página única ranqueia realisticamente para **um** cluster de busca. Para capturar `tatuagem fine line bh`, `cobertura de tatuagem bh`, `tatuagem geek bh`, `tatuagem botânica bh` e `blackwork bh`, cada nicho precisa da própria URL.
  - Rota dinâmica `src/pages/tatuagem/[categoria].astro` sobre o `portfolioData.ts` que já existe, com title/H1/description próprios, galeria filtrada, breadcrumb e 200-300 palavras de texto autoral por nicho.
  - Depende de conteúdo escrito (Google precisa de texto para ranquear em termo disputado).

- [ ] **Issue 6: Core Web Vitals + quebra de hidratação do React** _(parte da hidratação **resolvida** em 29/07/2026)_
  - [x] ✅ **Hidratação corrigida.** `<i data-lucide>` + CDN do Lucide substituídos por `lucide-react` nos componentes React e SVG inline no `FloatingCta.astro`. Resultados medidos com `npm run verificar`:
    - Erro de hidratação no console: **eliminado** (desktop e mobile).
    - `#portfolio` e `#contato` agora **sobrevivem** à hidratação — antes eram destruídos e recriados.
    - Botão flutuante passou a funcionar: as 3 checagens de comportamento passam nos 2 tamanhos de tela.
    - Requisição bloqueante ao `unpkg.com` no `<head>`: **removida**.
    - Os dois `MutationObserver` que reobservavam `document.body` a cada mutação: **removidos**. Sobrou um único `IntersectionObserver` que dá `unobserve` após revelar cada elemento.
    - Verificações totais: de 6/14 para **10/14** (as 4 restantes são os contrastes da Issue 3).
  - Dois detalhes descobertos e que não devem ser esquecidos:
    - `lucide-react` não declara campo `exports`, só `main` (CJS) e `module` (ESM). O Node resolve para CJS e os imports nomeados quebram no SSR. Há um alias em `astro.config.mjs` apontando para `dist/esm/lucide-react.mjs` — **não remover**.
    - O Lucide **removeu ícones de marca**. `Instagram` não existe no pacote (provavelmente o ícone do rodapé já vinha vazio com o CDN). Está agora em `src/components/ui/InstagramIcon.tsx`, com path do Simple Icons (CC0).
  - **Ainda pendente nesta issue**: fontes do Google como stylesheet bloqueante; hero como `background-image` (LCP invisível ao preload scanner); imagens em `public/` sem `srcset`/AVIF; reduzir as 4 hidratações `client:load`.
  - _Histórico do diagnóstico, para referência:_
  - **O Lucide via CDN quebrava a hidratação do React.** Diagnosticado com Playwright, não por suspeita. Cadeia causal:
    1. O script do Lucide roda no `DOMContentLoaded` e **substitui** cada `<i data-lucide="...">` por um `<svg>`.
    2. O React então hidrata e encontra `<svg>` onde o HTML do servidor tinha `<i>` → *hydration mismatch* (erro real no console, em desktop e mobile).
    3. O React **descarta a árvore renderizada no servidor e recria tudo no cliente**.
  - Consequência medida: os nós `#portfolio` e `#contato` (os dois `client:load`) são **destruídos e recriados**. `#home` e `.main-footer`, que não hidratam, sobrevivem. Qualquer `IntersectionObserver`, `addEventListener` ou referência a esses nós criada antes da hidratação **é perdida silenciosamente**.
  - Foi isso que quebrou o botão flutuante de agendamento (ele observa `#contato` para se esconder). O `MutationObserver` que existe hoje no `index.astro` é uma tentativa anterior de contornar esse mesmo sintoma — ver commit `fix: resolve loop infinito no lucide icons e corrige problema de hidratação`.
  - **Correção de raiz**: trocar `<i data-lucide>` por SVG inline (ou `astro-icon`), eliminando a mutação de DOM. Isso resolve de uma vez: o erro de hidratação, o botão flutuante, o `MutationObserver` auto-realimentado e a requisição bloqueante ao unpkg.
  - Os dois `MutationObserver` em `index.astro` se auto-realimentam: observam `document.body` inteiro e, a cada mutação, chamam `createIcons()` / `observeElements()` e voltam a observar — trabalho contínuo na main thread.
  - Google Fonts como stylesheet bloqueante → self-host + preload.
  - Hero é `background-image` CSS → o elemento LCP fica invisível ao preload scanner.
  - Imagens em `public/` não passam pelo `<Image>` do Astro → sem `srcset`/AVIF (ver Issue 2.2).
  - 4 hidratações `client:load`; Header e ContactForm não precisam ser eager.

- [ ] **Issue 7: Conteúdo (o Google precisa de texto)**
  - Hoje a home tem ~2 parágrafos. Faltam: FAQ (preço, dói, duração, cuidados) com schema `FAQPage`, e um guia de pós-tatuagem — este último costuma trazer muito tráfego long-tail.

---
**Nota para a próxima sessão:**
A fundação de SEO (Issue 2) está fechada. O caminho de maior impacto agora é, nesta ordem: **Issue 2.1** (dados reais — desbloqueia o local pack), **Issue 2.2** (imagens, que é bug real e não polimento), depois **Issue 5** (páginas por nicho).
