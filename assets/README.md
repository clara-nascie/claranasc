# assets/ — arte original (não é servida na web)

Esta pasta guarda **arquivos-fonte** em resolução alta. Nada aqui é publicado:
o Astro só serve o conteúdo de `public/` e o que é importado por `src/`.

Manter a arte original fora de `public/` é intencional — antes desta separação,
`site-icon.png` (5 MB) era enviado a cada visitante do site sem nunca ser exibido.

## Arquivos

- **`site-icon.png`** — logo original em alta resolução. É a fonte de
  `public/favicon.png`, usado como ícone da aba e como logo no cabeçalho.

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
