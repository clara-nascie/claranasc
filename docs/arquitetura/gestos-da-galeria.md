# Gestos da galeria

Como uma foto é ampliada, e por que o código de gesto é do jeito que é.

O `GaleriaGrid.astro` detecta os gestos e dispara eventos na janela; o
`Lightbox.tsx` escuta e desenha. Os dois não se conhecem — a galeria é estática
e o lightbox é a única ilha envolvida.

| Evento | Quem dispara | O que faz |
|---|---|---|
| `open-lightbox` | `GaleriaGrid` | Abre. `detail.espiada` distingue os dois modos |
| `close-lightbox` | `GaleriaGrid` | Encerra a espiada ao soltar o dedo |

O `detail` do `open-lightbox` leva a galeria inteira (`fotos`) e o `indice` da
foto tocada, não os dados de uma foto só — é o que permite passar para a
próxima sem fechar.

## Dois modos de ampliar

**Pela lupa.** Fica aberta até fechar no X, no Esc ou no voltar do navegador.

**Pela espiada.** Pressionar a foto por 250ms amplia; soltar volta ao normal.
É o gesto de *peek* do Instagram.

Os dois limiares da espiada não são preciosismo:

- **250ms de pressão.** Abaixo disso o gesto é um toque. Sem a espera, encostar
  numa foto para rolar a página já a abriria.
- **10px de tolerância.** Todo arrasto começa com o dedo em cima de uma foto.
  Passou daqui, a pessoa está rolando a página ou o carrossel.

## Passar de foto sem fechar

Com a ampliação aberta, deslizar o dedo para o lado troca de foto. Antes era
preciso fechar e abrir a próxima uma a uma.

### O recorte é a galeria de origem

Uma página de nicho é uma galeria só: dá para percorrer as 30 e tantas fotos do
estilo de ponta a ponta. Na home cada fileira é uma galeria, então o deslize
anda dentro da categoria e para no fim dela.

O recorte não é arbitrário: a legenda mostra a categoria da foto, e um deslize
que saltasse de Blackwork para Fine Line no meio do gesto desmentiria a própria
legenda. Também é o que o Instagram faz — deslizar percorre o álbum, não o
feed inteiro.

### Três lâminas, não a galeria inteira

O trilho monta só a anterior, a atual e a próxima, e desliza em `transform`.

Montar as 34 fotos de uma página de nicho colocaria 34 `<img>` no DOM, e o
navegador baixaria todas — a ampliação pesa 1400px de largura. Com a janela de
três, a vizinha já chega baixada antes de o dedo pedir por ela, e o custo fica
em duas fotos adiantadas, não trinta e quatro.

O índice só troca **no fim** da animação, junto com a volta do trilho ao
repouso. Como o React aplica as duas mudanças na mesma renderização, a lâmina
que entrou fica exatamente onde a animação a deixou — separadas, haveria um
quadro em que a foto pula.

### Os limiares do deslize

- **18% da largura da tela.** Abaixo disso o trilho volta sozinho. É o ponto em
  que o gesto deixa de ser hesitação e vira intenção.
- **8px antes de decidir a direção.** Enquanto o dedo não passa disso, o gesto
  ainda pode virar qualquer coisa; passou, vale o eixo dominante. Deslize mais
  vertical que horizontal é descartado.
- **Arrasto dividido por 3 na borda.** Na primeira e na última foto o trilho
  ainda cede um pouco e volta. É a resposta que diz "acabou" sem travar seco.

### Dois tempos, porque são dois movimentos

| Origem | Duração | Curva |
|---|---|---|
| Solta do dedo | 0.38s | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Seta ou teclado | 0.55s | `cubic-bezier(0.4, 0, 0.2, 1)` |

Não é preciosismo: são percursos diferentes. Quando o dedo solta, o trilho já
andou quase toda a distância e a animação só completa o resto — a curva não
freia no começo, para emendar no movimento que já vinha. A seta parte do
repouso e percorre a tela inteira, então precisa de mais tempo e de aceleração
nas duas pontas; com o tempo do deslize, a foto trocava de estalo.

### O mouse não arrasta

No desktop o deslize é seta na tela (`@media (hover: hover) and (pointer: fine)`)
ou seta do teclado. Capturar o arrasto do mouse impediria de selecionar a
legenda — que na ampliação fixa é selecionável de propósito.

⚠️ O `touch-action: none` do visor não é enfeite: sem ele o navegador assume o
arrasto horizontal como gesto próprio e os `pointermove` param de chegar no meio
do deslize.

### A lâmina reserva as faixas dos controles

A foto tinha altura fixa (`70vh`) e o conjunto foto + legenda era centralizado
na tela **inteira**, como se ela estivesse vazia. Não está: em cima moram o X e
o contador, embaixo o botão flutuante de WhatsApp. Numa foto em pé com legenda
de duas linhas o conjunto ficava alto demais e invadia as duas pontas — o X
encostava no topo da foto e a segunda linha da legenda sumia atrás do botão.

Agora a lâmina reserva as faixas (`padding: 96px 0 104px`) e **quem cede altura
é a foto**, nunca a legenda.

⚠️ O `min-height: 0` na foto é o que faz isso funcionar. Em flexbox um item não
encolhe abaixo do próprio conteúdo sem ele, e uma imagem "cabe" no tamanho que
pedir — sem esse zero, era a legenda que era empurrada para fora da tela.

A espiada é isenta: ela não mostra X nem contador, então não há faixa a
reservar e a foto usa a tela toda.

### O contador fica no topo

`1 / 34` no canto superior esquerdo, espelhando o X. No rodapé ele dividiria a
faixa com o botão flutuante de WhatsApp. Ele também ensina o gesto: sem o
número, nada na tela diz que existe uma próxima foto.

## O voltar do celular precisa ter o que desfazer

A ampliação pela lupa empurra uma entrada descartável no histórico
(`history.pushState({ lightbox: true })`).

Sem ela o navegador não registra que algo aconteceu, e o botão "voltar" faz o
que sempre faz: sai da página. Quem ampliava uma foto numa página por nicho caía
na home, porque foi de lá que veio.

Fechar pelo X ou pelo Esc **desfaz** essa entrada em vez de fechar direto, para
todos os caminhos passarem pelo `popstate` e o histórico não acumular entradas
mortas — senão quem abrisse e fechasse cinco fotos precisaria de cinco "voltar"
para sair da página.

⚠️ **A espiada fica fora do histórico.** Ela nasce e morre no mesmo gesto, e uma
entrada por foto espiada esbarraria no limite de `pushState` que o Safari impõe
por janela de tempo.

## Os gestos nativos que a espiada disputa

Pressionar e segurar já significa quatro coisas para o celular. Cada uma rouba o
gesto de um jeito diferente, e **cada uma só apareceu depois que a anterior foi
resolvida** — uma escondia a outra.

| Gesto nativo | Sintoma | Como é contido |
|---|---|---|
| Menu de salvar imagem | A espiada nunca abria | `contextmenu` cancelado no documento |
| Cancelamento de ponteiro | A foto voltava sozinha em menos de 1s | `pointercancel` não encerra a espiada |
| Seleção de texto | O menu de copiar prendia a ampliação aberta | `user-select: none` na galeria e na espiada |
| Menu de ações de imagem | Baixar/copiar/Lens sobre a foto ampliada | A espiada não é alvo de toque |

### `pointercancel` não significa "soltou"

Significa "o sistema assumiu esse toque". O celular dispara isso **com o dedo
ainda na tela**, por volta dos 500ms, ao reconhecer a pressão longa. Quem
encerra a espiada é a soltura de verdade: `pointerup`, `touchend` ou `mouseup`.

A soltura é escutada na **janela**, não na galeria: com a ampliação aberta o
dedo levanta sobre o modal, e na grade o evento não chegaria.

### A rolagem é travada pelo `touchmove`, não por `overflow`

Mexer em `overflow` com um toque em curso é, por si só, motivo para o navegador
cancelar o ponteiro — ou seja, a trava provocava o defeito acima. Só a ampliação
que fica aberta usa `overflow: hidden`.

### A espiada não é alvo de toque

`pointer-events: none` enquanto ela está aberta. Nada nela precisa ser tocado, e
sem isso o dedo passa a mirar a foto ampliada — que vive fora da galeria, onde o
bloqueio de menu não alcançava.

## Suavidade da abertura

Dois detalhes que valem para os dois modos:

**A classe `active` entra no quadro seguinte à montagem.** Aplicada junto, o
navegador não tem estado anterior de onde animar e as transições de CSS
simplesmente não rodam — a ampliação aparecia de um corte só.

**A ampliação sobe com a miniatura que já está pintada** (`previa` no evento) e
troca pelo arquivo grande quando ele chega. O arquivo grande é outro: medido em
4G, ele demorava 465ms, e nesse intervalo a ampliação era um retângulo preto. O
download começa no `pointerdown`, não na abertura, o que dá os 250ms da pressão
de vantagem.

A espiada anima mais rápido que a ampliação fixa e dispensa o `backdrop-filter`:
borrar a tela inteira custa caro justamente no quadro em que ela está subindo, e
sob um fundo 95% opaco o borrão quase não aparece.

## ⚠️ Emulação não reproduz isto

Chrome emulando celular reproduz a geometria do toque, **não o reconhecedor de
gestos do sistema operacional**. Os quatro defeitos da tabela acima passaram por
toda a bateria automatizada e só apareceram no aparelho.

As checagens em `scripts/verificar-galeria.mjs` disparam `pointercancel` e
`contextmenu` explicitamente, do jeito que o celular dispara. Elas servem para
**impedir a volta** do defeito, não para descobri-lo — recurso de toque se testa
no aparelho.
