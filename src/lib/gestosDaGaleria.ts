/* Gestos de ampliação. Ver `docs/arquitetura/gestos-da-galeria.md`.
   Vale para toda grade marcada com `[data-galeria]`. */

const PRESSAO_MS = 250;
const TOLERANCIA_PX = 10;

function dadosDaFoto(gatilho: HTMLElement) {
  const item = gatilho.closest<HTMLElement>('.portfolio-item');
  return {
    src: gatilho.dataset.src,
    // Miniatura já pintada: primeiro quadro da ampliação, sem requisição.
    previa: item?.querySelector('img')?.currentSrc,
    title: gatilho.dataset.title,
    category: gatilho.dataset.category
  };
}

/* A ampliação recebe a fileira inteira, não uma foto: é o que permite passar
   para a próxima sem fechar. O recorte é a galeria de origem. */
function galeriaDaFoto(gatilho: HTMLElement) {
  const grade = gatilho.closest<HTMLElement>('[data-galeria]');
  const gatilhos = [...(grade?.querySelectorAll<HTMLElement>('.lightbox-trigger') ?? [])];
  return {
    fotos: gatilhos.map(dadosDaFoto),
    indice: Math.max(0, gatilhos.indexOf(gatilho))
  };
}

function adiantarAmpliada(gatilho: HTMLElement) {
  if (!gatilho.dataset.src) return;
  const adiantada = new Image();
  adiantada.src = gatilho.dataset.src;
}

// Um dedo e uma ampliação por página: estado e ouvintes ficam fora do laço.
let temporizador: number | null = null;
let espiando = false;
let inicio = { x: 0, y: 0 };

const cancelarEspera = () => {
  if (temporizador === null) return;
  clearTimeout(temporizador);
  temporizador = null;
};

const encerrarEspiada = () => {
  cancelarEspera();
  if (!espiando) return;
  espiando = false;
  window.dispatchEvent(new CustomEvent('close-lightbox'));
};

for (const grade of document.querySelectorAll<HTMLElement>('[data-galeria]')) {
  grade.addEventListener('pointerdown', (evento) => {
    const item = (evento.target as HTMLElement).closest<HTMLElement>('.portfolio-item');
    const gatilho = item?.querySelector<HTMLElement>('.lightbox-trigger');
    if (!gatilho) return;

    inicio = { x: evento.clientX, y: evento.clientY };
    adiantarAmpliada(gatilho);
    temporizador = window.setTimeout(() => {
      temporizador = null;
      espiando = true;
      window.dispatchEvent(
        new CustomEvent('open-lightbox', {
          detail: { ...galeriaDaFoto(gatilho), espiada: true }
        })
      );
    }, PRESSAO_MS);
  });

  grade.addEventListener('click', (evento) => {
    const gatilho = (evento.target as HTMLElement).closest<HTMLElement>('.lightbox-trigger');
    if (!gatilho) return;

    window.dispatchEvent(
      new CustomEvent('open-lightbox', { detail: galeriaDaFoto(gatilho) })
    );
  });
}

/* ⚠️ A soltura é escutada na janela: com a ampliação aberta o dedo levanta
   sobre o modal, e na grade o evento não chegaria. */
window.addEventListener('pointerup', encerrarEspiada);
window.addEventListener('mouseup', encerrarEspiada);
window.addEventListener('touchend', encerrarEspiada);

/* ⚠️ `pointercancel` não encerra a espiada. Ele significa "o sistema assumiu
   esse toque", e o celular dispara isso com o dedo ainda na tela. */
window.addEventListener('pointercancel', cancelarEspera);

window.addEventListener('pointermove', (evento) => {
  if (temporizador === null) return;
  const dx = evento.clientX - inicio.x;
  const dy = evento.clientY - inicio.y;
  if (Math.hypot(dx, dy) > TOLERANCIA_PX) cancelarEspera();
});

/* ⚠️ A rolagem é travada aqui, e não com `overflow`: alterá-la com um toque
   em curso faz o navegador cancelar o ponteiro. */
window.addEventListener(
  'touchmove',
  (evento) => {
    if (espiando) evento.preventDefault();
  },
  { passive: false }
);

/* No documento, e não na galeria: antes de a espiada abrir o dedo está sobre
   a miniatura, e depois sobre a ampliação, que vive fora da galeria. */
document.addEventListener(
  'contextmenu',
  (evento) => {
    if (espiando || (evento.target as HTMLElement).closest('.portfolio-item')) {
      evento.preventDefault();
    }
  },
  true
);
