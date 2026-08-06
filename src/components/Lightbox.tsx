import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgData, setImgData] = useState({ src: '', title: '', category: '' });

  /* Espiada é a ampliação que dura o gesto: abre na pressão e fecha ao soltar.
     Fica num ref porque nada na tela depende dela — só o comportamento de
     fechamento muda. */
  const espiando = useRef(false);

  useEffect(() => {
    // Listen to custom event instead of hardcoded DOM nodes
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setImgData({
        src: customEvent.detail.src,
        title: customEvent.detail.title,
        category: customEvent.detail.category
      });
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      espiando.current = Boolean(customEvent.detail.espiada);

      /* Entrada de histórico descartável. Sem ela o "voltar" do celular não tem
         o que desfazer na página e sai dela — quem abria uma foto na página de
         nicho voltava para a home.

         A espiada fica de fora: ela nasce e morre no mesmo gesto, e empurrar
         uma entrada por foto espiada esbarraria no limite de `pushState` que o
         Safari impõe por janela de tempo. */
      if (!espiando.current && !history.state?.lightbox) {
        history.pushState({ lightbox: true }, '');
      }
    };

    const handleClose = () => {
      if (!espiando.current) return;
      espiando.current = false;
      setIsOpen(false);
      document.body.style.overflow = '';
    };

    window.addEventListener('open-lightbox', handleOpen);
    window.addEventListener('close-lightbox', handleClose);

    return () => {
      window.removeEventListener('open-lightbox', handleOpen);
      window.removeEventListener('close-lightbox', handleClose);
    };
  }, []);

  /* Fechar pelo X ou pelo Esc desfaz a entrada empurrada na abertura, em vez de
     fechar direto: todos os caminhos passam pelo `popstate` e o histórico não
     acumula entradas mortas. O `else` cobre a entrada já ter sido consumida. */
  const closeLightbox = useCallback(() => {
    espiando.current = false;
    if (history.state?.lightbox) {
      history.back();
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePop = () => {
      espiando.current = false;
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
  }, [isOpen, closeLightbox]);

  if (!isOpen) return null;

  return (
    <div className="lightbox-modal active" id="lightbox-modal">
      <button className="lightbox-close" id="lightbox-close" aria-label="Fechar Galeria" onClick={closeLightbox}>
        <X aria-hidden="true" />
      </button>
      <div className="lightbox-content">
        <img src={imgData.src} alt={imgData.title} id="lightbox-img" />
        <div className="lightbox-caption">
          {/* `category` já chega como rótulo pronto (ex: 'Blackwork'), enviado pelo
              Portfolio via `item.categoryLabel`. O mapeamento que existia aqui
              comparava contra ids ('blackwork'), nunca casava, e caía sempre no
              fallback — toda tatuagem ampliada aparecia como "Ornamental". */}
          <span className="lightbox-category" id="lightbox-category">{imgData.category}</span>
          <h3 className="lightbox-title" id="lightbox-title">{imgData.title}</h3>
        </div>
      </div>
    </div>
  );
};
