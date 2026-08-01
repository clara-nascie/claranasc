# assets/ — arte original (não é servida na web)

Esta pasta guarda **arquivos-fonte** em resolução alta. Nada aqui é publicado:
o Astro só serve o conteúdo de `public/` e o que é importado por `src/`.

Manter a arte original fora de `public/` é intencional — antes desta separação,
`site-icon.png` (5 MB) era enviado a cada visitante do site sem nunca ser exibido.

## Arquivos

- **`site-icon.png`** — logo original em alta resolução. É a fonte de
  `public/favicon.png`, usado como ícone da aba e como logo no cabeçalho.

- **`hero-crisantemo-original.svg`** — crisântemo em line art, entregue pela
  Clara em 31/07/2026. É a fonte de `public/assets/hero-crisantemo.svg`, o
  fundo do hero. Veja a receita abaixo antes de trocar o arquivo.

## Como `public/favicon.png` foi gerado

O script `crop_icon.cjs` fazia isso e foi removido: era de uso único e dependia
do pacote `jimp`, que nem consta no `package.json` (ou seja, já não rodava).
A receita, se precisar refazer:

1. Recortar `site-icon.png` em quadrado, a partir do centro.
2. Redimensionar para 512x512.
3. Aplicar máscara circular (fora do círculo fica transparente).
4. Salvar como `public/favicon.png`.

⚠️ O `favicon.png` atual tem **339 KB**, grande demais para um ícone. Ao refazer,
gere em 512x512 e passe por um otimizador de PNG. Ver Issue 2.2 em
`docs/fluxos/issues.md`.

## Como `public/assets/hero-crisantemo.svg` foi gerado

Três mudanças no original, nenhuma delas mexe em traço:

1. **`viewBox` apertado até a caixa real do desenho**: de `0 0 1614 2283` para
   `202 421 1089 1137`. No original quase metade da área era margem vazia, e
   assimétrica — 31,8% embaixo contra 18,5% em cima. Sem apertar, qualquer
   `top`/`right` no CSS posiciona a *caixa* e não a *flor*, e o ajuste vira
   número mágico. O `width`/`height` acompanham a nova caixa.
2. **`fill` de `#000000` para `#2c2421`**, o mesmo valor do `--text-primary`.
   Como o SVG entra por `background-image`, não dá para recolorir por CSS — a
   cor precisa vir de dentro do arquivo. O preto puro destoava do creme quente.
3. **Espelhado na horizontal**, para o miolo da flor ficar virado ao texto.
   Feito com um `<g transform="translate(1493,0) scale(-1,1)">` envolvendo todo
   o conteúdo (1493 = `2 × 202 + 1089`, ou seja, o eixo do próprio `viewBox`).

   ⚠️ O espelho é feito **no arquivo, não com `scaleX(-1)` no CSS**, de
   propósito: no CSS ele inverteria junto a `mask-image` da `.hero-flor`, e o
   degradê que desbota a flor sob o texto passaria a desbotar o lado errado.

Para medir a caixa de um SVG novo: abra no navegador e chame `getBBox()` no
elemento `<svg>` (nele, não no `<g>` — o `<g>` tem um `transform` de escala
negativa e devolve coordenadas internas, não as do `viewBox`).

⚠️ São 165 KB (55 KB comprimido), pesado para um elemento decorativo. Passar
por um otimizador de SVG (SVGO) cortaria bastante, reduzindo a precisão dos
830 `path`. Não foi feito para não adicionar dependência ao projeto.
