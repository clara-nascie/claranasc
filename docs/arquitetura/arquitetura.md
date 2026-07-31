# Arquitetura do Site

O site usa **Islands Architecture**, do Astro: a página entrega HTML estático por
padrão (SSG) e carrega JavaScript só nos fragmentos que precisam de
interatividade — as "ilhas".

## Estrutura

```
src/
├── assets/
│   └── portfolio/   Fotos do portfolio (entram pelo pipeline de imagem)
├── components/
│   ├── layout/      AppLayout (wrapper estatico)
│   ├── seo/         Seo.astro + LocalBusinessSchema.astro
│   ├── sections/    Header.tsx, About.tsx, ContactForm.tsx, Footer.tsx
│   │                Hero.astro, Portfolio.astro
│   ├── ui/          Primitivos: Button, Input, Select, Textarea, InstagramIcon
│   ├── FloatingCta.astro
│   └── Lightbox.tsx
├── data/            siteData.ts (negocio) e portfolioData.ts (galeria)
├── pages/           index.astro
└── styles/          base/ + components/ + sections/, agregados por global.css
```

`assets/` (raiz) guarda arte original e **não é servida**. `public/` é servido
literalmente — tudo que está lá é peso baixável, referenciado ou não, e **não
passa pelo pipeline de imagem** (ver a seção abaixo).

`Anúncios/` (raiz) é o acervo de fotos originais, ~1,3 GB, fora do repositório
via `.gitignore`. O que vai ao ar são as cópias processadas em `src/assets/`.

## Ilhas de interatividade

Três componentes hidratam hoje, todos com `client:load`:

| Componente | Por que hidrata |
| --- | --- |
| `Header` | abre/fecha o menu mobile |
| `ContactForm` | estado do formulário e montagem da mensagem do WhatsApp |
| `Lightbox` | galeria ampliada |

O resto — `Hero`, `Portfolio`, `About`, `Footer`, `AppLayout`, `FloatingCta` —
é HTML estático, sem JavaScript de componente.

`Hero` e `Portfolio` são `.astro`, não React. Dois motivos: o `<Image>` do
`astro:assets` só existe em componente Astro, e o filtro da galeria é mostrar e
esconder elemento — `classList.toggle`, não estado de framework. O componente
tem um `<script>` próprio para isso e dispara o mesmo `CustomEvent` que o
Lightbox já escutava.

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

## Scripts no cliente

* `index.astro` tem um único `<script>` (módulo, portanto deferido) com um `IntersectionObserver` que adiciona `.active` para as animações de entrada, e dá `unobserve` após revelar cada elemento.
* `Portfolio.astro` tem o script do filtro de categoria e a delegação de clique que abre o lightbox.
* `FloatingCta.astro` tem o próprio script, que observa `#home` para aparecer e `#contato`/`.main-footer` para se esconder.
* Todos usam `IntersectionObserver` em vez de listener de `scroll`: o navegador reporta o cruzamento em vez de executar código a cada pixel rolado, o que mantém a main thread livre.

> ⚠️ **Não use `threshold` por fração de área em elemento que pode crescer.**
> `threshold: 0.15` exige que 15% da área do elemento esteja na tela, e essa
> fração fica inalcançável quando o elemento é muito mais alto que a viewport —
> a galeria com 30 fotos mede 14.000px no celular contra 844px de tela, ou seja,
> no máximo 6% aparece de uma vez. O observador nunca dispara e a seção fica em
> `opacity: 0` para sempre. Use `rootMargin`, que não depende da altura.
> Coberto por `npm run verificar:galeria`.

## SEO

* `Seo.astro` centraliza title, description, canonical, Open Graph e Twitter Card. Páginas novas devem reusá-lo.
* `LocalBusinessSchema.astro` emite JSON-LD com `TattooParlor` + `Person` + `WebSite`, ligados por `@id`. Campos sem dado real são **omitidos**, nunca vazios — campo ausente é lido como "não informado", campo errado como informação falsa.
* URLs absolutas dependem de `site` estar definido em `astro.config.mjs`.

## Hospedagem e deploy

* **Cloudflare Pages**, build a cada push na `main`. O push publica direto em produção, sem etapa de aprovação.
* Configuração: build command `npm run build`, output `dist`.
* Sem servidor Node em runtime — só arquivos estáticos na edge.

## Verificação

Dois scripts, ambos com Chromium headless (Playwright) e ambos no CI a cada push:

| Comando | Cobre |
| --- | --- |
| `npm run verificar` | botão flutuante por scroll, erros de console, requisições falhas e contraste computado a partir das cores renderizadas |
| `npm run verificar:galeria` | filtro por categoria, abertura e fechamento do lightbox, e se a grade **fica de fato visível** |

A checagem de opacidade da galeria parece redundante e não é. Contar itens no
DOM não prova que a visitante os vê: `.reveal` começa em `opacity: 0` e depende
do `IntersectionObserver`. Já houve um caso com os 30 itens presentes,
corretamente filtrados, e a galeria invisível no celular sem nenhuma outra
verificação reclamar.

Falhas conhecidas e já rastreadas estão declaradas em `FALHAS_ACEITAS`, dentro do
`verificar-visual.mjs`: aparecem como aviso e não reprovam. Ao corrigir uma,
remova a entrada.
