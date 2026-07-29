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

## ⏳ Em aberto

Ver as [issues](https://github.com/clara-nascie/claranasc/issues). Prioridade:

1. [#14](https://github.com/clara-nascie/claranasc/issues/14) — dados reais do estúdio (destrava o Google Maps)
2. [#8](https://github.com/clara-nascie/claranasc/issues/8) — contraste dos botões do hero (falha visível para clientes)
3. [#5](https://github.com/clara-nascie/claranasc/issues/5) / [#6](https://github.com/clara-nascie/claranasc/issues/6) — fotos reais do portfólio e otimização de imagens
4. [#11](https://github.com/clara-nascie/claranasc/issues/11) — páginas por nicho
5. [#12](https://github.com/clara-nascie/claranasc/issues/12) — Core Web Vitals restantes
6. [#13](https://github.com/clara-nascie/claranasc/issues/13) — conteúdo (FAQ, guia de cuidados)

---

## ⚠️ Ressalvas que não devem ser esquecidas

* **Não há verificação de tipos.** O `npm run build` só remove os tipos; não valida. A tarefa "testar a build para garantir que não há erros de TypeScript" que existia aqui era **impossível de cumprir** — o `typescript` não está instalado e o `@astrojs/check` é incompatível com TypeScript 7. Decidir entre fixar `typescript` em `^6` ou aguardar suporte é uma escolha em aberto.
* **As imagens não estão otimizadas**, apesar de a fase de mídia constar como concluída no passado. Os `.webp` são JPEG renomeados. Ver [#6](https://github.com/clara-nascie/claranasc/issues/6).
* **Lighthouse deve ser rodado contra `npm run preview`**, nunca contra o dev server — o dev server não é representativo do build de produção.
