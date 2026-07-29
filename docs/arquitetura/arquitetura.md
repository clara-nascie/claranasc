# Arquitetura do Site

O site usa **Islands Architecture**, do Astro: a página entrega HTML estático por
padrão (SSG) e carrega JavaScript só nos fragmentos que precisam de
interatividade — as "ilhas".

## Estrutura

```
src/
├── components/
│   ├── layout/      AppLayout (wrapper estatico)
│   ├── seo/         Seo.astro + LocalBusinessSchema.astro
│   ├── sections/    Header, Hero, Portfolio, About, ContactForm, Footer
│   ├── ui/          Primitivos: Button, Input, Select, Textarea, InstagramIcon
│   ├── FloatingCta.astro
│   └── Lightbox.tsx
├── data/            siteData.ts (negocio) e portfolioData.ts (galeria)
├── pages/           index.astro
└── styles/          base/ + components/ + sections/, agregados por global.css
```

`assets/` (raiz) guarda arte original e **não é servida**. `public/` é servido
literalmente — tudo que está lá é peso baixável, referenciado ou não.

## Ilhas de interatividade

Quatro componentes hidratam hoje, todos com `client:load`:

| Componente | Por que hidrata |
| --- | --- |
| `Header` | abre/fecha o menu mobile |
| `Portfolio` | filtros por categoria |
| `ContactForm` | estado do formulário e montagem da mensagem do WhatsApp |
| `Lightbox` | galeria ampliada |

O resto — `Hero`, `About`, `Footer`, `AppLayout`, `FloatingCta` — é HTML estático,
sem JavaScript de componente.

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

Consequência prática ao escrever scripts: `#home` e `.main-footer` são estáveis
(não hidratam), mas `#portfolio` e `#contato` **eram** substituídos. Hoje estão
estáveis porque a causa foi corrigida — mas se alguém reintroduzir mutação de
DOM, voltam a ser trocados. `npm run verificar` detecta isso.

## Scripts no cliente

* `index.astro` tem um único `<script>` (módulo, portanto deferido) com um `IntersectionObserver` que adiciona `.active` para as animações de entrada, e dá `unobserve` após revelar cada elemento.
* `FloatingCta.astro` tem o próprio script, que observa `#home` para aparecer e `#contato`/`.main-footer` para se esconder.
* Ambos usam `IntersectionObserver` em vez de listener de `scroll`: o navegador reporta o cruzamento em vez de executar código a cada pixel rolado, o que mantém a main thread livre.

## SEO

* `Seo.astro` centraliza title, description, canonical, Open Graph e Twitter Card. Páginas novas devem reusá-lo.
* `LocalBusinessSchema.astro` emite JSON-LD com `TattooParlor` + `Person` + `WebSite`, ligados por `@id`. Campos sem dado real são **omitidos**, nunca vazios — campo ausente é lido como "não informado", campo errado como informação falsa.
* URLs absolutas dependem de `site` estar definido em `astro.config.mjs`.

## Hospedagem e deploy

* **Cloudflare Pages**, build a cada push na `main`. O push publica direto em produção, sem etapa de aprovação.
* Configuração: build command `npm run build`, output `dist`.
* Sem servidor Node em runtime — só arquivos estáticos na edge.

## Verificação

`npm run verificar` sobe um Chromium headless (Playwright) e checa o que análise
estática não alcança: comportamento por scroll, erros de console e contraste
computado a partir das cores renderizadas. Roda também no CI a cada push.

Falhas conhecidas e já rastreadas estão declaradas em `FALHAS_ACEITAS`, dentro do
script: aparecem como aviso e não reprovam. Ao corrigir uma, remova a entrada.
