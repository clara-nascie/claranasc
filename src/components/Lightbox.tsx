import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/** Ampliação de foto. Ver `docs/arquitetura/gestos-da-galeria.md`. */
export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgData, setImgData] = useState({ src: '', previa: '', title: '', category: '' });
  const [grandePronta, setGrandePronta] = useState(false);
  const [ativo, setAtivo] = useState(false);

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
      setImgData({
        src: customEvent.detail.src,
        previa: customEvent.detail.previa ?? '',
        title: customEvent.detail.title,
        category: customEvent.detail.category
      });
      setGrandePronta(false);
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

  useEffect(() => {
    if (!isOpen || !imgData.src) return;

    const grande = new Image();
    grande.onload = () => setGrandePronta(true);
    grande.src = imgData.src;
    // Já em cache: o `onload` de uma imagem completa pode não disparar.
    if (grande.complete) setGrandePronta(true);

    return () => {
      grande.onload = null;
    };
  }, [isOpen, imgData.src]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePop = () => {
      marcarEspiada(false);
      setIsOpen(false);
      document.body.style.overflow = '';
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, closeLightbox, marcarEspiada]);

  if (!isOpen) return null;

  return (
    <div
      className={`lightbox-modal${ativo ? ' active' : ''}${espiando ? ' lightbox-modal--espiada' : ''}`}
      id="lightbox-modal"
    >
      {!espiando && (
        <button className="lightbox-close" id="lightbox-close" aria-label="Fechar Galeria" onClick={closeLightbox}>
          <X aria-hidden="true" />
        </button>
      )}
      <div className="lightbox-content">
        <img
          src={grandePronta || !imgData.previa ? imgData.src : imgData.previa}
          alt={imgData.title}
          id="lightbox-img"
        />
        <div className="lightbox-caption">
          <span className="lightbox-category" id="lightbox-category">{imgData.category}</span>
          <h3 className="lightbox-title" id="lightbox-title">{imgData.title}</h3>
        </div>
      </div>
    </div>
  );
};
