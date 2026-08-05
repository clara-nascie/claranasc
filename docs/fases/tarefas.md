# Fases do Projeto

Histórico das fases de construção. **Tarefas em aberto ficam nas
[GitHub Issues](https://github.com/clara-nascie/claranasc/issues)**, não aqui —
este arquivo registra o que já foi percorrido.

## ✅ Configuração do ambiente
- [x] Projeto inicializado com **Astro**
- [x] **TypeScript** configurado _(ver ressalva abaixo)_
- [x] Integração **React** adicionada
- [x] Scripts de dev e build
- [x] `README.md` e `docs/` refletindo a arquitetura atual

## ✅ Migração de HTML/CSS monolítico para Astro/React
- [x] `index.html` migrado para `src/pages/index.astro`
- [x] `style.css` modularizado em `base/`, `components/` e `sections/`
- [x] Página dividida em componentes (Header, Hero, Portfolio, About, ContactForm, Footer)

## ✅ Interatividade
- [x] `Lightbox` como componente React
- [x] Animações de scroll com `IntersectionObserver`
- [x] Formulário de agendamento gerando mensagem para o WhatsApp
- [x] ~~Custom Cursor~~ — removido: o cursor nativo tem melhor performance, e o componente ficou órfão até a limpeza de 29/07/2026
- [x] Botão flutuante de agendamento (`FloatingCta.astro`), sem React

## ✅ SEO — fundação _(29/07/2026)_
- [x] Meta tags e description com foco em "Tatuadora em BH" e nos 5 nichos
- [x] Open Graph corrigido: `og:image` era relativo e **as prévias de link no WhatsApp não renderizavam**
- [x] `canonical`, `robots`, Twitter Card
- [x] `site` definido no `astro.config.mjs` (pré-requisito de URL absoluta)
- [x] Sitemap automático via `@astrojs/sitemap`
- [x] JSON-LD `TattooParlor` + `Person` + `WebSite`
- [x] `siteData.ts` como fonte única dos dados de negócio

## ✅ Qualidade e infraestrutura _(29/07/2026)_
- [x] Limpeza de código morto: `CustomCursor`, `cursor.css`, imagens pré-migração, `crop_icon.cjs`, token CSS não usado, estilos do header sticky abandonado
- [x] `public/` reduzido de 10,59 MB para 5,53 MB
- [x] Bug de hidratação do React corrigido na raiz ([#10](https://github.com/clara-nascie/claranasc/issues/10))
- [x] Verificação visual e de a11y via Playwright (`npm run verificar`)
- [x] GitHub Actions rodando a verificação a cada push
- [x] Backlog consolidado nas GitHub Issues

## ✅ Portfólio real e pipeline de imagem _(30/07/2026)_
- [x] Acervo de 181 fotos revisado; 13 descartadas por defeito (4 HEIC corrompidos, 9 duplicatas)
- [x] `Anúncios/` (~1,3 GB de originais) mantido fora do repositório
- [x] Imagens migradas de `public/` para `src/assets/`, entrando pelo `astro:assets`
- [x] `Hero` e `Portfolio` convertidos de React para `.astro` — uma hidratação a menos
- [x] 30 fotos reais no ar (6 por categoria), substituindo os placeholders
- [x] Nome de arquivo, `alt` e título escritos um a um, pensados para busca
- [x] Home: 4.296 KB → 70 KB no celular, 294 KB em desktop 2x
- [x] Bug do `IntersectionObserver` que deixava a galeria invisível no celular ([#12](https://github.com/clara-nascie/claranasc/issues/12))
- [x] `npm run verificar:galeria` cobrindo filtro, lightbox e visibilidade

## ✅ Identidade visual do hero _(31/07/2026)_
- [x] Vitrine de 3 fotos removida do hero ([#19](https://github.com/clara-nascie/claranasc/issues/19)) — anunciava duas categorias repetidas no desktop e uma no celular
- [x] Fundo deixou de ser creme chapado: degradê que termina na cor da galeria, mais textura de grão em SVG embutido (~350 bytes, nenhuma requisição)
- [x] Crisântemo em line art da Clara como fundo, espelhado e com máscara em degradê
- [x] Elemento LCP passou a ser o texto do H1 — não há mais imagem disputando
- [x] `--text-secondary` escurecido de 40% para 32%: passava na WCAG AA por 0,2 de margem, ou seja, margem nenhuma
- [x] Cabeçalho: fundo sólido e borda no hover; o traço da flor atravessava os rótulos
- [x] `npm run verificar:contraste` criado — o verificador existente é cego para imagem de fundo

## ✅ SEO local — dados reais _(31/07 a 01/08/2026)_
- [x] Imagem de compartilhamento deixou de ser uma tatuagem gerada por IA ([#5](https://github.com/clara-nascie/claranasc/issues/5) parcial); `hero-bg.webp` removido, 800 KB a menos
- [x] Instagram e TikTok no `sameAs` e no rodapé ([#3](https://github.com/clara-nascie/claranasc/issues/3))
- [x] Endereço, CEP e coordenadas do Iuna Tattoo ([#14](https://github.com/clara-nascie/claranasc/issues/14))
- [x] Horário de atendimento, incluindo feriados, via `PublicHolidays`
- [x] Nome do estúdio no hero com link para o Maps; endereço por extenso no rodapé
- [x] JSON-LD sem nenhum campo vazio
- [x] Indexação solicitada no Search Console e prévia de link raspada no Facebook

## ✅ Correções _(01/08/2026)_
- [x] Foto da artista invisível em toda tela até 992px ([#18](https://github.com/clara-nascie/claranasc/issues/18)) — `background-image` não tem tamanho intrínseco
- [x] `About` convertido para `.astro`; a foto entrou no pipeline responsivo (325 KB → 17 KB no celular)
- [x] `npm run verificar` passou a checar se a foto tem tamanho renderizado

## ✅ Páginas por nicho _(04/08/2026)_
- [x] Cinco URLs indexáveis a partir de uma rota dinâmica só ([#11](https://github.com/clara-nascie/claranasc/issues/11)) — o sitemap passou de 1 para 6 páginas
- [x] `BaseLayout.astro` e `GaleriaGrid.astro` extraídos: o `<head>`, o cabeçalho e a grade deixaram de ser copiados a cada página
- [x] Galeria em masonry (`columns` do CSS, sem JS) — cada foto na proporção em que foi tirada
- [x] `BreadcrumbList` e `FAQPage` em JSON-LD, ambos espelhando o que está visível
- [x] FAQ em accordion `<details>` nativo, 3 perguntas por nicho ([#13](https://github.com/clara-nascie/claranasc/issues/13) parcial)
- [x] Links do cabeçalho e do rodapé viraram `/#secao` — a âncora nua não fazia nada em 5 das 6 páginas
- [x] Botão flutuante passou a usar `data-cta-apos`; com id fixo ele cobria o texto no topo das páginas novas
- [x] `npm run verificar:nichos` — 29 checagens por página

## ✅ Acervo completo no site _(05/08/2026)_
- [x] As 176 fotos importadas; `inventario-fotos.mjs` reporta zero pendentes ([#16](https://github.com/clara-nascie/claranasc/issues/16), [#5](https://github.com/clara-nascie/claranasc/issues/5))
- [x] `scripts/inventario-fotos.mjs` e `scripts/importar-fotos.mjs` — conversão real para WebP, com conferência do formato gravado
- [x] Nome de arquivo, título e `alt` escritos um a um e revisados pela Clara; 176 de cada, todos únicos
- [x] Processo invertido na última categoria: **revisar antes de importar** levou o retrabalho de 30 renomeações para zero
- [x] Camada de destaque explícita (`destaque: true`), para a home não crescer junto com o acervo

## ✅ Home em carrosséis _(05/08/2026)_
- [x] Grade de 30 fotos substituída por 5 fileiras que rolam na horizontal, 3 fotos cada ([#21](https://github.com/clara-nascie/claranasc/issues/21))
- [x] Cada fileira termina num cartão com o link para o nicho e o total do acervo
- [x] `scroll-snap` em CSS puro — sem autoplay, sem bolinhas, sem JS
- [x] Altura no celular: 19.037px → 6.763px; 1.013 KB → 619 KB
- [x] Filtro mantido, agora escondendo fileiras inteiras

## ⏳ Em aberto

Ver as [issues](https://github.com/clara-nascie/claranasc/issues). Prioridade:

1. **Google Business Profile** — não é issue do repositório, e é o maior gargalo. O local pack é alimentado por ele, não pelo site; o JSON-LD confirma a entidade mas não cria presença no mapa. Antes de criar, decidir o nome (hoje são três: `Clara Nasc Tattoo`, `Iuna Tattoo`, `Clara Nascimento TATTOO`).
2. **Enviar o sitemap no Search Console** — as 5 URLs novas ainda não foram submetidas. É o que separa o Google achá-las em dias ou em semanas.
3. [#22](https://github.com/clara-nascie/claranasc/issues/22) — o sitemap não declara nenhuma das 176 fotos. Todo o trabalho de nomenclatura existiu para busca por imagem, e ela é provavelmente o maior canal de entrada de um portfólio visual.
4. [#20](https://github.com/clara-nascie/claranasc/issues/20) — páginas de nicho longas (Fine Line: 68 fotos, 41.909px). ⚠️ **Não é problema de desempenho**: a página baixa 464 KB inicialmente, menos que a home. É navegabilidade.
5. [#12](https://github.com/clara-nascie/claranasc/issues/12) — Core Web Vitals restantes (fontes bloqueantes; o LCP do hero deixou de ser imagem).
6. [#13](https://github.com/clara-nascie/claranasc/issues/13) — o guia de pós-tatuagem, que ficou de fora da parte já entregue.

⚠️ A [#8](https://github.com/clara-nascie/claranasc/issues/8) saiu da lista de prioridades: as três falhas de contraste que restam são todas do `--accent-gold`, e **a Clara decidiu em 31/07/2026 não alterar a cor da marca**. Estão declaradas como falha aceita nos dois verificadores. Não reabra a proposta.

---

## ⚠️ Ressalvas que não devem ser esquecidas

* **Não há verificação de tipos.** O `npm run build` só remove os tipos; não valida. A tarefa "testar a build para garantir que não há erros de TypeScript" que existia aqui era **impossível de cumprir** — o `typescript` não está instalado e o `@astrojs/check` é incompatível com TypeScript 7. Decidir entre fixar `typescript` em `^6` ou aguardar suporte é uma escolha em aberto.
* **Imagem nova entra por `src/assets/`, nunca por `public/`.** O que está em `public/` é copiado byte a byte para o build e não passa pelo `astro:assets` — a foto original inteira iria para o navegador. Foi o defeito que a fase de mídia de 30/07/2026 corrigiu, e é fácil de reintroduzir sem perceber. A exceção é arquivo que precisa de **URL fixa e previsível**: a imagem de Open Graph e o SVG decorativo do hero, que são referenciados de fora do pipeline.
* **Foto de conteúdo é `<img>`, nunca `background-image`.** Imagem de fundo não tem tamanho intrínseco e some sem erro quando o contêiner perde largura própria. Detalhe em `docs/arquitetura/arquitetura.md`.
* **O site não coloca o estúdio no mapa.** Refinar o JSON-LD melhora o sinal, mas o local pack depende do Google Business Profile, que não existe. Não trate as issues de SEO do repositório como caminho para o Maps.
* **A home mostra só a camada de destaque.** São 3 fotos por categoria, marcadas com `destaque: true` no `portfolioData.ts`. Sem essa marca ela cresceria junto com o acervo — num lote importado pulou de 30 para 36 fotos sozinha. `npm run verificar:galeria` exige 3 por categoria.
* **Não filtre o acervo por conta própria.** Ângulo diferente da mesma tatuagem **entra**: uma peça que dá a volta no braço não cabe em uma foto só. Marca d'água do estúdio antigo (`@tattookapala`) é irrelevante. Descarte só arquivo ilegível e duplicata byte-a-byte — o que o `inventario-fotos.mjs` já detecta sozinho.
* **Mostre os nomes das fotos à Clara antes de importar.** Medido: corrigir depois custou 30 renomeações em Geek; revisar antes custou zero em Fine Line. Ela conhece a sessão, o agente só vê a foto.
* **Lighthouse deve ser rodado contra `npm run preview`**, nunca contra o dev server — o dev server não é representativo do build de produção.
