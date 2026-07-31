# Tecnologias Utilizadas

Stack escolhida para mesclar performance de carregamento com manutenibilidade.
Como o objetivo do site é ranquear no Google para buscas de tatuagem em Belo
Horizonte, decisões de performance aqui são decisões de SEO.

## Núcleo

* **Astro** — motor do site. Roteamento, orquestração e compilação do estático final. Configurado com `site: 'https://claranasc.com'`, obrigatório para gerar URL absoluta em `canonical` e `og:image`.
* **React** — usado só nos componentes que exigem estado: `Header` (menu mobile), `ContactForm` (formulário) e `Lightbox` (galeria ampliada). Ver a nota sobre hidratação em `docs/arquitetura/arquitetura.md`.
  > `Hero` e `Portfolio` **eram** React e hoje são `.astro`. O `<Image>` do `astro:assets` só funciona em componente Astro, e nenhum dos dois precisava de estado — o filtro da galeria é `classList.toggle`. Antes de converter algo para React, verifique se realmente há estado envolvido.
* **`astro:assets`** — pipeline de imagem embutido no Astro. Gera as variantes responsivas em WebP no build, a partir das fotos importadas de `src/assets/`. Usa **sharp** por baixo, que já vem com o Astro e lê JPEG, WebP e HEIC **pelo conteúdo, não pela extensão** — útil porque o acervo tem arquivos com extensão errada.
* **TypeScript** — tipagem nos componentes e nos arquivos de dados (`siteData.ts`, `portfolioData.ts`).
  > ⚠️ **Não há verificação de tipos neste projeto.** O `npm run build` (Vite) apenas **remove** os tipos, não valida nada — um erro de tipo passa sem reclamar. O `typescript` não está instalado, e o `@astrojs/check` é incompatível com TypeScript 7. Não conte com o TS para pegar bugs aqui; ele serve como documentação e autocomplete no editor.
* **CSS3 vanilla** — sem framework utilitário. Design System *Premium Light Mode* (fundo creme, tons terrosos, acento marrom mel) em `src/styles/base/variables.css`. CSS modularizado em `base/`, `components/` e `sections/`, todos importados por `global.css`.
* **Node.js** (≥ 22.12.0) — só em desenvolvimento e na etapa de build. Não há servidor Node em runtime.

## Bibliotecas

* **`@astrojs/sitemap`** — gera `sitemap-index.xml` no build. Não crie `public/sitemap.xml` manual: ele seria servido por cima e ficaria obsoleto.
* **`lucide-react`** — ícones como componentes React, renderizados como SVG no HTML desde o servidor.
  > ⚠️ Dois detalhes que não devem ser esquecidos:
  > 1. O pacote **não declara campo `exports`**, só `main` (CJS) e `module` (ESM). O Node ignora `module` e resolve para CJS, onde imports nomeados quebram no SSR. Existe um alias em `astro.config.mjs` apontando para `dist/esm/lucide-react.mjs` — **não remova**.
  > 2. O Lucide **removeu ícones de marca** por questão de trademark. `Instagram` não existe no pacote. Ícones de marca ficam locais, em `src/components/ui/` — ver `InstagramIcon.tsx`.

## Desenvolvimento

* **Playwright** (devDependency) — sobe um Chromium headless para `npm run verificar` (scroll, console, contraste) e `npm run verificar:galeria` (filtro, lightbox e se a grade fica visível). Sendo devDependency, não vai para o site publicado.
* **GitHub Actions** — `.github/workflows/verificar.yml` roda build e verificação a cada push e pull request.
* **`gh` CLI** — o backlog do projeto vive nas GitHub Issues, não em arquivos markdown.

## Decisões deliberadas

* **Sem framework CSS utilitário.** O design é autoral e o site é pequeno; um design system em variáveis CSS dá conta.
* **Ícones nunca via script que muta o DOM.** O projeto usava `<i data-lucide>` + CDN, e o script substituía os `<i>` por `<svg>` após o carregamento — o que quebrava a hidratação do React. Ícones devem estar no HTML desde a renderização. Ver [issue #10](https://github.com/clara-nascie/claranasc/issues/10).
* **Uma fonte de verdade para dados de negócio.** WhatsApp, endereço, horários e redes sociais só em `src/data/siteData.ts`. Antes o WhatsApp estava duplicado em dois componentes.
