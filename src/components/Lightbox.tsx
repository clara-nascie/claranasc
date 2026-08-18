import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Foto {
  src: string;
  previa: string;
  title: string;
  category: string;
}

const REPOUSO = -100;
const LIMIAR_ARRASTO = 0.18;
const RESISTENCIA_BORDA = 3;
const FOLGA_PX = 8;

/** Ampliação de foto. Ver `docs/arquitetura/gestos-da-galeria.md`. */
export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [indice, setIndice] = useState(0);
  const [prontas, setProntas] = useState<ReadonlySet<string>>(new Set());
  const [ativo, setAtivo] = useState(false);

  const [posicao, setPosicao] = useState(REPOUSO);
  const [animando, setAnimando] = useState(false);
  const [viaComando, setViaComando] = useState(false);
  const [pendente, setPendente] = useState(0);
  const trilhoRef = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ x: number; y: number; largura: number; decidido: boolean } | null>(null);

  /* O ref existe além do estado porque os dois são lidos em momentos
     diferentes: o estado desenha a tela, e o ref é o que os ouvintes
     registrados uma vez só conseguem consultar — pelo estado eles leriam para
     sempre o valor da primeira renderização. */
  const [espiando, setEspiando] = useState(false);
  const espiandoRef = useRef(false);

  const marcarEspiada = useCallback((valor: boolean) => {
    espiandoRef.current = valor;
    setEspiando(valor);
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setFotos(customEvent.detail.fotos ?? []);
      setIndice(customEvent.detail.indice ?? 0);
      setPosicao(REPOUSO);
      setAnimando(false);
      setPendente(0);
      arrasto.current = null;
      const eEspiada = Boolean(customEvent.detail.espiada);
      setIsOpen(true);
      marcarEspiada(eEspiada);

      /* ⚠️ A espiada não pode mexer em `overflow`: alterar a rolagem com um
         toque em curso faz o navegador cancelar o ponteiro. Quem segura a
         rolagem durante o gesto é o `touchmove` da galeria. */
      if (!eEspiada) document.body.style.overflow = 'hidden';

      /* Entrada descartável para o "voltar" do celular consumir. A espiada fica
         de fora: uma entrada por foto espiada esbarraria no limite de
         `pushState` do Safari. */
      if (!espiandoRef.current && !history.state?.lightbox) {
        history.pushState({ lightbox: true }, '');
      }
    };

    const handleClose = () => {
      if (!espiandoRef.current) return;
      marcarEspiada(false);
      setIsOpen(false);
      document.body.style.overflow = '';
    };

    window.addEventListener('open-lightbox', handleOpen);
    window.addEventListener('close-lightbox', handleClose);

    return () => {
      window.removeEventListener('open-lightbox', handleOpen);
      window.removeEventListener('close-lightbox', handleClose);
    };
  }, [marcarEspiada]);

  /* Desfaz a entrada de histórico em vez de fechar direto, para os dois
     caminhos terminarem no `popstate`. O `else` cobre a entrada já consumida. */
  const closeLightbox = useCallback(() => {
    marcarEspiada(false);
    if (history.state?.lightbox) {
      history.back();
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  }, [marcarEspiada]);

  /* ⚠️ `active` só no quadro seguinte à montagem: aplicada junto, não há estado
     anterior de onde animar e as transições de CSS não rodam. */
  useEffect(() => {
    if (!isOpen) {
      setAtivo(false);
      return;
    }
    const quadro = requestAnimationFrame(() => setAtivo(true));
    return () => cancelAnimationFrame(quadro);
  }, [isOpen]);

  /* Baixa as três lâminas do trilho, e não só a do meio: a vizinha aparece
     durante o deslize, antes de virar a foto atual. */
  const pedidas = useRef(new Set<string>());
  useEffect(() => {
    if (!isOpen) return;

    for (const foto of [fotos[indice - 1], fotos[indice], fotos[indice + 1]]) {
      if (!foto?.src || pedidas.current.has(foto.src)) continue;
      pedidas.current.add(foto.src);

      const marcar = () => setProntas((antes) => new Set(antes).add(foto.src));
      const grande = new Image();
      grande.onload = marcar;
      grande.src = foto.src;
      // Já em cache: o `onload` de uma imagem completa pode não disparar.
      if (grande.complete) marcar();
    }
  }, [isOpen, fotos, indice]);

  const navegar = useCallback(
    (direcao: number) => {
      if (pendente) return;
      const alvo = indice + direcao;
      if (alvo < 0 || alvo >= fotos.length) return;
      setPendente(direcao);
      setViaComando(true);
      setAnimando(true);
      setPosicao(REPOUSO - direcao * 100);
    },
    [pendente, indice, fotos.length]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePop = () => {
      marcarEspiada(false);
      setIsOpen(false);
      document.body.style.overflow = '';
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (espiandoRef.current) return;
      if (e.key === 'ArrowLeft') navegar(-1);
      if (e.key === 'ArrowRight') navegar(1);
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, closeLightbox, marcarEspiada, navegar]);

  /* O índice só troca no fim da animação, e junto com a volta ao repouso: como
     o React aplica os dois na mesma renderização, a lâmina que entrou continua
     exatamente onde a animação a deixou. */
  const aoTerminarTransicao = (e: React.TransitionEvent) => {
    if (e.target !== trilhoRef.current || e.propertyName !== 'transform') return;
    setAnimando(false);
    setPosicao(REPOUSO);
    if (pendente) {
      setIndice((atual) => atual + pendente);
      setPendente(0);
    }
  };

  /* Arrasto só de toque: no desktop o gesto do mouse é a seta, e capturá-lo
     aqui impediria de selecionar a legenda. */
  const aoPressionar = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || pendente || fotos.length < 2) return;
    arrasto.current = { x: e.clientX, y: e.clientY, largura: e.currentTarget.clientWidth, decidido: false };
    setViaComando(false);
    setAnimando(false);
  };

  const aoMover = (e: React.PointerEvent) => {
    const gesto = arrasto.current;
    if (!gesto) return;

    const dx = e.clientX - gesto.x;
    if (!gesto.decidido) {
      const dy = e.clientY - gesto.y;
      if (Math.hypot(dx, dy) < FOLGA_PX) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        arrasto.current = null;
        return;
      }
      gesto.decidido = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const naBorda = (dx > 0 && indice === 0) || (dx < 0 && indice === fotos.length - 1);
    const avanco = naBorda ? dx / RESISTENCIA_BORDA : dx;
    setPosicao(REPOUSO + (avanco / gesto.largura) * 100);
  };

  const aoSoltar = (e: React.PointerEvent) => {
    const gesto = arrasto.current;
    if (!gesto) return;
    arrasto.current = null;

    const dx = e.clientX - gesto.x;
    const direcao = dx < 0 ? 1 : -1;
    const alvo = indice + direcao;
    setAnimando(true);

    if (Math.abs(dx) > gesto.largura * LIMIAR_ARRASTO && alvo >= 0 && alvo < fotos.length) {
      setPendente(direcao);
      setPosicao(REPOUSO - direcao * 100);
    } else {
      setPosicao(REPOUSO);
    }
  };

  const aoCancelar = () => {
    if (!arrasto.current) return;
    arrasto.current = null;
    setAnimando(true);
    setPosicao(REPOUSO);
  };

  if (!isOpen) return null;

  const varias = fotos.length > 1;

  return (
    <div
      className={`lightbox-modal${ativo ? ' active' : ''}${espiando ? ' lightbox-modal--espiada' : ''}`}
      id="lightbox-modal"
    >
      <div
        className="lightbox-visor"
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoCancelar}
      >
        <div
          className={`lightbox-trilho${animando ? ' lightbox-trilho--animando' : ''}${
            animando && viaComando ? ' lightbox-trilho--comando' : ''
          }`}
          ref={trilhoRef}
          style={{ transform: `translate3d(${posicao}%, 0, 0)` }}
          onTransitionEnd={aoTerminarTransicao}
        >
          {[-1, 0, 1].map((deslocamento) => {
            const foto = fotos[indice + deslocamento];
            const atual = deslocamento === 0;

            return (
              <div className="lightbox-slide" key={indice + deslocamento} aria-hidden={!atual}>
                {foto && (
                  <div className="lightbox-content">
                    <img
                      src={prontas.has(foto.src) || !foto.previa ? foto.src : foto.previa}
                      alt={foto.title}
                      id={atual ? 'lightbox-img' : undefined}
                      fetchPriority={atual ? 'high' : 'low'}
                    />
                    <div className="lightbox-caption">
                      <span className="lightbox-category" id={atual ? 'lightbox-category' : undefined}>
                        {foto.category}
                      </span>
                      <h3 className="lightbox-title" id={atual ? 'lightbox-title' : undefined}>
                        {foto.title}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!espiando && (
        <button className="lightbox-close" id="lightbox-close" aria-label="Fechar Galeria" onClick={closeLightbox}>
          <X aria-hidden="true" />
        </button>
      )}

      {!espiando && varias && (
        <>
          <button
            className="lightbox-nav lightbox-nav--anterior"
            id="lightbox-anterior"
            aria-label="Foto anterior"
            disabled={indice === 0}
            onClick={() => navegar(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            className="lightbox-nav lightbox-nav--proxima"
            id="lightbox-proxima"
            aria-label="Próxima foto"
            disabled={indice === fotos.length - 1}
            onClick={() => navegar(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <p className="lightbox-contador" id="lightbox-contador" aria-live="polite">
            {indice + 1} / {fotos.length}
          </p>
        </>
      )}
    </div>
  );
};
