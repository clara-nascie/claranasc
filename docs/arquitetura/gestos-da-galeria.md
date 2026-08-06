# Gestos da galeria

Como uma foto é ampliada, e por que o código de gesto é do jeito que é.

O `GaleriaGrid.astro` detecta os gestos e dispara eventos na janela; o
`Lightbox.tsx` escuta e desenha. Os dois não se conhecem — a galeria é estática
e o lightbox é a única ilha envolvida.

| Evento | Quem dispara | O que faz |
|---|---|---|
| `open-lightbox` | `GaleriaGrid` | Abre. `detail.espiada` distingue os dois modos |
| `close-lightbox` | `GaleriaGrid` | Encerra a espiada ao soltar o dedo |

## Dois modos de ampliar

**Pela lupa.** Fica aberta até fechar no X, no Esc ou no voltar do navegador.

**Pela espiada.** Pressionar a foto por 250ms amplia; soltar volta ao normal.
É o gesto de *peek* do Instagram.

Os dois limiares da espiada não são preciosismo:

- **250ms de pressão.** Abaixo disso o gesto é um toque. Sem a espera, encostar
  numa foto para rolar a página já a abriria.
- **10px de tolerância.** Todo arrasto começa com o dedo em cima de uma foto.
  Passou daqui, a pessoa está rolando a página ou o carrossel.

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
