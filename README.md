# Clara Nasc | Tattoo Portfolio

Este repositório contém o código-fonte do portfólio pessoal e profissional de **Clara Nasc**, tatuadora em Belo Horizonte. A especialidade é **Blackwork**, e o portfólio cobre cinco nichos — Blackwork, Fine Line, Botânico, Geek & Animes e Coberturas — apresentados em pé de igualdade, porque o objetivo comercial é ampliar público, não estreitar o posicionamento.

O projeto adota uma estética *Premium Light Mode* — fundo creme, tons terrosos e acentos em marrom mel — priorizando desempenho de carregamento, SEO local em Belo Horizonte e agendamento direto via WhatsApp.

---

## 📂 Estrutura de Pastas

```text
claranasc/
├── assets/                     # Arte original em alta resolucao (NAO e servida na web)
│   ├── site-icon.png           # Logo original; fonte do favicon
│   └── hero-crisantemo-original.svg  # Fonte do fundo do hero
├── public/                     # Servido literalmente; NAO passa pelo pipeline de imagem
│   ├── assets/
│   │   ├── hero-crisantemo.svg # Fundo do hero (decorativo)
│   │   └── og-clara-nasc.jpg   # Imagem de compartilhamento (1200x630)
│   ├── favicon.png
│   └── robots.txt
├── scripts/                    # Verificacao via Playwright (ver secao abaixo)
│   ├── verificar-visual.mjs
│   ├── verificar-galeria.mjs
│   └── verificar-contraste-fundo.mjs
├── src/
│   ├── assets/                 # Imagens que ENTRAM pelo astro:assets
│   │   ├── portfolio/          # Fotos do portfolio
│   │   └── about-artist.webp   # Foto da artista
│   ├── components/
│   │   ├── layout/             # AppLayout
│   │   ├── seo/                # Seo.astro e LocalBusinessSchema.astro (JSON-LD)
│   │   ├── sections/           # Header.tsx, ContactForm.tsx, Footer.tsx
│   │   │                       # Hero.astro, Portfolio.astro, About.astro
│   │   ├── ui/                 # Primitivos: Button, Input, Select, Textarea
│   │   │                       # Marca: InstagramIcon, TiktokIcon
│   │   ├── FloatingCta.astro   # Botao flutuante de agendamento
│   │   └── Lightbox.tsx        # Galeria ampliada
│   ├── data/
│   │   ├── portfolioData.ts    # Itens e categorias do portfolio
│   │   └── siteData.ts         # Fonte unica: contato, localizacao, redes sociais
│   ├── pages/
│   │   └── index.astro         # Home
│   └── styles/                 # CSS modular (base, components, sections)
├── docs/                       # Issues, fases, arquitetura e stack
├── astro.config.mjs            # site canonico + integracoes (React, sitemap)
└── wrangler.jsonc              # Deploy na Cloudflare
```

> **`assets/`, `public/` e `src/assets/` têm papéis distintos.** `assets/` na raiz
> guarda arte original e não é servida. `public/` é servido byte a byte e **não
> passa pelo pipeline de imagem** — só entra ali o que precisa de URL fixa e
> previsível. **Foto do site vai em `src/assets/`**, para o `astro:assets` gerar
> as variantes responsivas. Ver `assets/README.md`.

---

## 🛠️ Stack Tecnológico

O site é construído com Astro para gerar arquivos estáticos super otimizados:
* **Astro**: Framework principal para renderização (SSG) e estruturação do site.
* **React & TypeScript**: Usados para componentes complexos e interativos com tipagem forte.
* **CSS3 Vanilla**: Layout responsivo com Flexbox, CSS Grid e variáveis customizadas.
* **Lucide Icons & Google Fonts**: Tipografia com as fontes *Syne* e *Inter*.

Para mais detalhes sobre as tecnologias, consulte a [Documentação de Stack](docs/tecnologias/tecnologias.md) e [Arquitetura](docs/arquitetura/arquitetura.md).

---

## 💻 Como Executar Localmente

O projeto utiliza Node.js e Astro para gerenciamento de dependências e servidor local.

1. Clone o repositório para sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/claranasc.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```
   Depois acesse `http://localhost:4321` no navegador.

4. Gere a build de produção (saída em `dist/`):
   ```bash
   npm run build
   ```

---

## 🔍 Verificação Visual e de Acessibilidade

O projeto inclui três scripts que sobem um Chromium headless (Playwright),
navegam pelo site como uma visitante e checam o que análise de código não
alcança.

```bash
npm run dev                  # em um terminal
npm run verificar            # em outro
npm run verificar:galeria
npm run verificar:contraste
```

| Script | Cobre |
| --- | --- |
| `verificar` | comportamento por scroll, erros de console, requisições falhas, contraste computado e se a foto da artista tem tamanho de verdade |
| `verificar:galeria` | filtro por categoria, lightbox e se a grade fica visível |
| `verificar:contraste` | contraste pixel a pixel contra o fundo **renderizado**, em 8 larguras |

Sai um relatório de PASSOU/FALHOU no terminal e capturas em `.playwright/`
(desktop 1280px e mobile 390px). Os scripts encerram com código de saída 1
quando alguma verificação falha, então servem em CI — o workflow roda os dois
primeiros.

> O que os três têm em comum: **existir no DOM não é aparecer**. Cada um nasceu
> de um bug que sobreviveu em produção porque nada olhava aquilo — a galeria
> invisível no celular, a foto da artista colapsada em 2x3 pixels, e o texto do
> hero em 2,10:1 sobre a imagem de fundo que o verificador antigo não enxergava.
>
> Ao adicionar checagem nova, **valide-a contra o bug**: injete o defeito e
> confirme que ela reprova. Checagem que nunca falhou não prova nada.

---

## 🚀 Deploy (Cloudflare Workers)

O deploy é **automático a cada push na branch `main`**. Um push publica direto
em produção, sem etapa de aprovação.

O site roda como um **Worker servindo assets estáticos**, e não no Cloudflare
Pages. Quem manda na configuração é o [`wrangler.jsonc`](wrangler.jsonc) na
raiz — não o painel:

| Campo | Valor | Significa |
| --- | --- | --- |
| `name` | `claranasc` | nome do Worker |
| `assets.directory` | `dist` | a pasta publicada, saída do `npm run build` |
| `observability.enabled` | `true` | liga os logs do Worker no painel |

A build roda do lado da Cloudflare, pela integração com o GitHub: `wrangler`
não é dependência do projeto e não há workflow de deploy no repositório.
Publicar é dar push.

### Ver os acessos

`npm run analytics` puxa tráfego e Core Web Vitals pela API da Cloudflare.
Precisa de um token em `.env` — ver [`.env.example`](.env.example).

> ⚠️ **Não rode `npm run build` com o `npm run dev` no ar.** Os dois usam o
> mesmo cache de dependências do Vite (`node_modules/.vite/`), e o build o
> reescreve por baixo do servidor vivo. O dev passa a servir arquivos que já
> não existem, os componentes React param de hidratar e o console enche de
> `504 (Outdated Optimize Dep)`. Reiniciar o dev server resolve.

---

## ⚖️ Licença

Este repositório é licenciado em duas camadas, porque código e conteúdo têm
propósitos diferentes aqui.

| O quê | Licença | Onde |
| --- | --- | --- |
| **Código-fonte** — componentes, estilos, scripts, configuração | MIT | [`LICENSE`](LICENSE) |
| **Conteúdo** — fotografias, textos, identidade visual, marca | Todos os direitos reservados | [`LICENSE-CONTEUDO.md`](LICENSE-CONTEUDO.md) |

Em resumo: **a estrutura pode ser reaproveitada, o conteúdo não.** Clone,
estude, adapte e publique o seu site com as suas fotos e os seus textos — mas
as fotografias de tatuagem e os textos deste repositório são de Clara
Nascimento e não acompanham a licença do código.

As fotos têm ainda a camada de direito de imagem das pessoas retratadas, que
não é da autora renunciar.
