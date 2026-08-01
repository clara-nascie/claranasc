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

## ⏳ Em aberto

Ver as [issues](https://github.com/clara-nascie/claranasc/issues). Prioridade:

1. **Google Business Profile** — não é issue do repositório, e é o maior gargalo. O local pack é alimentado por ele, não pelo site; o JSON-LD confirma a entidade mas não cria presença no mapa. Antes de criar, decidir o nome (hoje são três: `Clara Nasc Tattoo`, `Iuna Tattoo`, `Clara Nascimento TATTOO`).
2. [#11](https://github.com/clara-nascie/claranasc/issues/11) — páginas por nicho. O sitemap tem **uma URL só**; são elas que multiplicam as portas de entrada e destravam as 138 fotos restantes.
3. [#17](https://github.com/clara-nascie/claranasc/issues/17) — tagline do hero. Virou o único sinal de leque acima da dobra depois que a vitrine saiu.
4. [#5](https://github.com/clara-nascie/claranasc/issues/5) / [#16](https://github.com/clara-nascie/claranasc/issues/16) — o resto do portfólio. O gargalo não é técnico, é escrever `alt` e título de 138 fotos.
5. [#12](https://github.com/clara-nascie/claranasc/issues/12) — Core Web Vitals restantes (fontes bloqueantes; o LCP do hero deixou de ser imagem).
6. [#13](https://github.com/clara-nascie/claranasc/issues/13) — conteúdo (FAQ, guia de cuidados).

[#6](https://github.com/clara-nascie/claranasc/issues/6) (otimização de imagens) foi concluída em 30/07/2026 e pode ser fechada. A [#19](https://github.com/clara-nascie/claranasc/issues/19) está resolvida em produção e segue aberta só à espera do comentário que registra a decisão tomada.

⚠️ A [#8](https://github.com/clara-nascie/claranasc/issues/8) saiu da lista de prioridades: as três falhas de contraste que restam são todas do `--accent-gold`, e **a Clara decidiu em 31/07/2026 não alterar a cor da marca**. Estão declaradas como falha aceita nos dois verificadores. Não reabra a proposta.

---

## ⚠️ Ressalvas que não devem ser esquecidas

* **Não há verificação de tipos.** O `npm run build` só remove os tipos; não valida. A tarefa "testar a build para garantir que não há erros de TypeScript" que existia aqui era **impossível de cumprir** — o `typescript` não está instalado e o `@astrojs/check` é incompatível com TypeScript 7. Decidir entre fixar `typescript` em `^6` ou aguardar suporte é uma escolha em aberto.
* **Imagem nova entra por `src/assets/`, nunca por `public/`.** O que está em `public/` é copiado byte a byte para o build e não passa pelo `astro:assets` — a foto original inteira iria para o navegador. Foi o defeito que a fase de mídia de 30/07/2026 corrigiu, e é fácil de reintroduzir sem perceber. A exceção é arquivo que precisa de **URL fixa e previsível**: a imagem de Open Graph e o SVG decorativo do hero, que são referenciados de fora do pipeline.
* **Foto de conteúdo é `<img>`, nunca `background-image`.** Imagem de fundo não tem tamanho intrínseco e some sem erro quando o contêiner perde largura própria. Detalhe em `docs/arquitetura/arquitetura.md`.
* **O site não coloca o estúdio no mapa.** Refinar o JSON-LD melhora o sinal, mas o local pack depende do Google Business Profile, que não existe. Não trate as issues de SEO do repositório como caminho para o Maps.
* **A home ainda carrega a galeria inteira numa grade só.** Com 30 fotos está de bom tamanho; as outras 138 do acervo dependem das páginas por nicho ([#11](https://github.com/clara-nascie/claranasc/issues/11)) para não inchar o DOM da home.
* **Lighthouse deve ser rodado contra `npm run preview`**, nunca contra o dev server — o dev server não é representativo do build de produção.
