# Decisões visuais

Por que o visual é o que é. O CSS diz **o que** acontece; aqui fica o **porquê**,
para o raciocínio não virar comentário dentro dos arquivos.

## Hero

### 85vh, não 100vh

Um hero de viewport inteira cria a *ilusão de completude*: a tela parece um
conteúdo fechado e a visitante não imagina que existe mais abaixo. Com 85vh o
topo da galeria aparece sem rolar, que é o sinal visual mais eficaz para
convidar ao scroll. O `min-height` impede que ele fique apertado em telas
baixas.

### Fundo em três camadas

De baixo para cima:

| Camada | z-index | O que é |
|---|---|---|
| `.hero-flor` | 0 | O crisântemo em line art |
| `.hero-section::after` | 1 | O grão |
| `.hero-content` | 2 | O texto |

O grão vem **por cima** da flor de propósito: assim as duas leem como uma
superfície só, em vez de um desenho colado sobre um fundo texturizado.

O crisântemo é `background-image` num elemento vazio com `aria-hidden`. É a
exceção legítima à regra de que foto é `<img>` — ele não carrega informação, não
deve aparecer para leitor de tela nem competir com o H1. Ver
[arquitetura](../arquitetura/arquitetura.md#-foto-de-conteúdo-é-img-nunca-background-image).

A vitrine de 3 fotos que existia aqui foi removida em 31/07/2026
([#19](https://github.com/clara-nascie/claranasc/issues/19)): anunciava leque de
estilos, mas mostrava duas categorias repetidas no desktop e uma só no celular,
com miniaturas pequenas demais para avaliar traço. Sem imagem no hero, o
elemento LCP passou a ser o texto do H1.

### A máscara sobre a flor

A flor é larga o bastante para passar por trás do texto — e é para passar mesmo,
foi pedido. Mas o subtítulo usa `--text-secondary`, que sobre o creme suporta no
máximo ~7% de tinta no fundo antes de furar os 4,5:1 da WCAG AA. A flor está a
55%: traço cheio atrás do subtítulo mediria perto de 2:1.

A máscara não move nem encolhe a flor. Ela reduz o desenho a um fantasma na
faixa da esquerda, onde o texto está, e o devolve inteiro à direita.

São muitos pontos de parada de propósito. Com três, a máscara ia do piso a 100%
em 26% da largura e a rampa aparecia como uma linha divisória no meio do
desenho. Os pontos intermediários espalham a transição por quase toda a flor e
desenham uma curva no lugar de uma reta.

> ⚠️ Ao mudar o piso, **reescalone os sete valores** em vez de só levantar o
> primeiro — senão a curva perde o formato e o cotovelo volta.

> ⚠️ **A máscara e o `--text-secondary` andam juntos.** O que chega ao texto é
> `opacity × piso da máscara`: hoje 0.85 × 0.13 ≈ 11% de tinta efetiva. Isso é
> mais do que o token original suportava, e foi o que obrigou a escurecê-lo para
> 32%. Clarear o token sem baixar a máscara reprova o hero.

Verifique com `node scripts/verificar-contraste-fundo.mjs`. O
`verificar-visual.mjs` **não enxerga esta flor**: ele mede contraste procurando
`background-color` nos ancestrais, e aqui o fundo é `background-image` num
elemento à parte.

### O grão

SVG de ruído embutido como data URI, não arquivo: ~350 bytes dentro do próprio
CSS, sem requisição a mais nem disputa pelo LCP. `fractalNoise` gera o grão e
`feColorMatrix saturate=0` o deixa cinza, para o ruído não puxar cor e sujar o
creme.

A opacidade foi medida: 0.05 e 0.10 são imperceptíveis mesmo ampliando 3x, e
0.24 puxa o creme para um cinza sujo. 0.16 é onde se lê como papel. Ao mexer,
compare capturas ampliadas — em tamanho real qualquer valor entre 0.05 e 0.24
parece igual.

### No celular a flor entra no fluxo

Empilhado não há "ao lado", então ela sai do posicionamento absoluto e entra no
fluxo, depois do texto. É o que torna a sobreposição impossível por construção:
nenhuma altura de hero, número de linhas ou largura de tela consegue fazê-la
subir.

A tentativa anterior mantinha o absoluto e empurrava para o rodapé com um
deslocamento fixo. Media 2,10:1 entre 600px e 992px — ali o texto ocupa menos
linhas, o hero encolhe e a flor alcançava o subtítulo. Não havia deslocamento
que servisse para todas as larguras.

Sem máscara nesse caso: ela existe para desbotar a flor sob o texto, e no
empilhado não há texto sobre ela. A margem negativa deixa o `overflow: hidden`
cortar a base, para a flor florescer para dentro da galeria em vez de terminar
numa borda reta.

### O degradê e o `background-color` embaixo dele

O degradê começa em `--bg-hero-top` e termina em `--bg-secondary`, a cor da
galeria, para as duas seções se encontrarem sem linha de emenda. O
`--bg-primary` sozinho lia como branco.

⚠️ **O `background-color` continua ali mesmo 100% coberto pelo degradê.** Ele é
o fallback se o gradiente não renderizar, e é o que o `verificar-visual.mjs` lê
ao medir contraste — o script procura o primeiro ancestral com
`background-color` opaco. Sem ele a medição cairia no `body` e usaria um creme
mais claro que o real. Usa o tom mais escuro do degradê de propósito: mede o
pior caso para o texto escuro.

## Cabeçalho

### `absolute`, não `fixed`

Ele rola junto e sai da tela. Quem assume a navegação a partir daí é o botão
flutuante (`FloatingCta`). É decisão fechada — não vale repropor fixá-lo.

### Fundo sólido nos links

Não é estética: o cabeçalho flutua sobre o hero e o crisântemo passa atrás dos
links em força quase cheia, porque o topo direito é justamente onde a máscara do
degradê não apaga nada. Sem fundo, o traço da flor atravessava os rótulos.

A cor é `--bg-hero-top`, e não um cinza qualquer, porque o degradê do hero
começa nela — na altura do cabeçalho essa é literalmente a cor que está atrás do
botão. O retângulo desaparece no fundo em vez de se anunciar como caixa, e ainda
assim recorta a flor.

⚠️ **Isto acopla o cabeçalho ao hero.** Nas páginas por nicho o mesmo tom abre o
degradê (`nicho.css`) exatamente por isso. Se o cabeçalho passar a flutuar sobre
uma seção com outro fundo, esta cor deixa de casar.

## Tipografia das páginas por nicho

O título fica dois passos acima da chamada numa escala de 1,25 — de 1,2rem para
1,875rem. A 2,9rem ele competia com o próprio conteúdo.

Os dois usam `clamp` em vez de media query: o título mais longo tem 42
caracteres e precisa encolher de forma contínua, não em degraus. E a chamada é
fluida junto com ele — travada em 1,2rem, a razão entre os dois caía de 1,56x
para 1,25x no celular e eles passavam a ter quase o mesmo peso.

A medida de linha usa `ch`, não pixel: acompanha o tamanho da fonte em vez de
ser um número fixo.

## Tokens de cor

### `--text-secondary` a 32% de luminosidade

Foi escurecido duas vezes em 31/07/2026, de 40% para 36% e depois para 32%.

| Situação | Contraste |
|---|---|
| 40% sobre `--bg-primary` | 4,71:1 — passava na AA por 0,2 de margem |
| 40% sobre o fundo escuro do hero | 4,33:1 — reprovava |
| 36%, com o crisântemo a 0.85 | 4,15:1 — reprovava de novo |
| **32%, pior caso do hero** | **~4,9:1** |

É o token que paga o custo do desenho de fundo.

### `--accent-gold`

⚠️ **Fica como está, por decisão da Clara.** Reprova a WCAG AA em três lugares,
sendo o mais visível o botão "Orçamento & Agendamento", a 3,78:1. É falha
conhecida e aceita — o `npm run verificar` a reporta como AVISO, não como
reprovação, para não mascarar falhas novas.

## Ícones de marca

`InstagramIcon` e `TiktokIcon` não vêm do `lucide-react`: o Lucide removeu
ícones de marca do pacote por questões de trademark e não há substituto
equivalente. Os paths vêm do [Simple Icons](https://simpleicons.org), cujos SVGs
são CC0. As marcas seguem pertencendo aos respectivos donos — o uso aqui é para
linkar os próprios perfis.

Eles são preenchidos (`fill`) e não traçados (`stroke`) como os do Lucide, então
parecem um pouco mais cheios ao lado dos demais. É o custo de usar um glifo de
marca reconhecível.
