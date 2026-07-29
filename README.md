# Clara Nasc | Tattoo Portfolio

Este repositório contém o código-fonte do portfólio pessoal e profissional de **Clara Nasc**, tatuadora especializada em traços finos (Fine Line) e trabalhos autorais contrastantes (Blackwork / Ornamental). 

O projeto adota uma estética *Premium Light Mode* — fundo creme, tons terrosos e acentos em marrom mel — priorizando desempenho de carregamento, SEO local em Belo Horizonte e agendamento direto via WhatsApp.

---

## 📂 Estrutura de Pastas

```text
claranasc/
├── assets/                     # Arte original em alta resolucao (NAO e servida na web)
│   └── site-icon.png           # Logo original; fonte do favicon
├── public/                     # Servido literalmente na raiz do site
│   ├── assets/                 # Imagens institucionais (hero, foto da artista)
│   ├── portfolio/              # Fotos do portfolio
│   ├── favicon.png
│   └── robots.txt
├── scripts/
│   └── verificar-visual.mjs    # Verificacao visual e de a11y via Playwright
├── src/
│   ├── components/
│   │   ├── layout/             # AppLayout
│   │   ├── seo/                # Seo.astro e LocalBusinessSchema.astro (JSON-LD)
│   │   ├── sections/           # Header, Hero, Portfolio, About, ContactForm, Footer
│   │   ├── ui/                 # Primitivos: Button, Input, Select, Textarea
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

> `assets/` e `public/` têm papéis distintos e não devem ser confundidos: só o
> conteúdo de `public/` é enviado ao visitante. Ver `assets/README.md`.

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

O projeto inclui um script que sobe um Chromium headless (Playwright), navega
pelo site como uma visitante e checa o que análise de código não alcança:
comportamento dependente de scroll, erros de JavaScript no console e razão de
contraste calculada a partir das cores efetivamente renderizadas.

```bash
npm run dev          # em um terminal
npm run verificar    # em outro
```

Sai um relatório de PASSOU/FALHOU no terminal e capturas em `.playwright/`
(desktop 1280px e mobile 390px). O script encerra com código de saída 1 quando
alguma verificação falha, então serve em CI.

---

## 🚀 Deploy (Cloudflare Pages)

O deploy é **automático a cada push na branch `main`**. Um push publica direto
em produção, sem etapa de aprovação.

Configuração de build no painel da Cloudflare (**Workers & Pages** > **Pages**):

| Campo | Valor |
| --- | --- |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22.12.0` ou superior |
