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

## ⏳ Em aberto

Ver as [issues](https://github.com/clara-nascie/claranasc/issues). Prioridade:

1. [#14](https://github.com/clara-nascie/claranasc/issues/14) — dados reais do estúdio (destrava o Google Maps)
2. [#8](https://github.com/clara-nascie/claranasc/issues/8) — contraste dos botões do hero (falha visível para clientes)
3. [#11](https://github.com/clara-nascie/claranasc/issues/11) — páginas por nicho. É o que destrava as 138 fotos restantes, que não cabem na home
4. [#5](https://github.com/clara-nascie/claranasc/issues/5) — o resto do portfólio. 30 das 168 estão no ar; as demais dependem de #11 e de escrever `alt` e título de cada uma
5. [#12](https://github.com/clara-nascie/claranasc/issues/12) — Core Web Vitals restantes (fontes bloqueantes; as hidratações caíram de 4 para 3)
6. [#13](https://github.com/clara-nascie/claranasc/issues/13) — conteúdo (FAQ, guia de cuidados)

[#6](https://github.com/clara-nascie/claranasc/issues/6) (otimização de imagens) foi concluída em 30/07/2026 e pode ser fechada.

---

## ⚠️ Ressalvas que não devem ser esquecidas

* **Não há verificação de tipos.** O `npm run build` só remove os tipos; não valida. A tarefa "testar a build para garantir que não há erros de TypeScript" que existia aqui era **impossível de cumprir** — o `typescript` não está instalado e o `@astrojs/check` é incompatível com TypeScript 7. Decidir entre fixar `typescript` em `^6` ou aguardar suporte é uma escolha em aberto.
* **Imagem nova entra por `src/assets/`, nunca por `public/`.** O que está em `public/` é copiado byte a byte para o build e não passa pelo `astro:assets` — a foto original inteira iria para o navegador. Foi o defeito que a fase de mídia de 30/07/2026 corrigiu, e é fácil de reintroduzir sem perceber.
* **A home ainda carrega a galeria inteira numa grade só.** Com 30 fotos está de bom tamanho; as outras 138 do acervo dependem das páginas por nicho ([#11](https://github.com/clara-nascie/claranasc/issues/11)) para não inchar o DOM da home.
* **Lighthouse deve ser rodado contra `npm run preview`**, nunca contra o dev server — o dev server não é representativo do build de produção.
