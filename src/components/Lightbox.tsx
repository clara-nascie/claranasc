import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgData, setImgData] = useState({ src: '', title: '', category: '' });

  /* Espiada é a ampliação que dura o gesto: abre na pressão e fecha ao soltar.
     Ela some sozinha, então o X não tem função nenhuma ali e fica escondido.

     Vale nos dois lugares porque os dois leem em momentos diferentes: o estado
     desenha a tela, e o ref é o que os ouvintes registrados uma vez só
     conseguem consultar — pelo estado, eles leriam sempre o valor da primeira
     renderização. */
  const [espiando, setEspiando] = useState(false);
  const espiandoRef = useRef(false);

  const marcarEspiada = useCallback((valor: boolean) => {
    espiandoRef.current = valor;
    setEspiando(valor);
  }, []);

  useEffect(() => {
    // Listen to custom event instead of hardcoded DOM nodes
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setImgData({
        src: customEvent.detail.src,
        title: customEvent.detail.title,
        category: customEvent.detail.category
      });
      const eEspiada = Boolean(customEvent.detail.espiada);
      setIsOpen(true);
      marcarEspiada(eEspiada);

      /* A espiada não trava a rolagem por aqui. Mexer em `overflow` com o dedo
         ainda na tela faz o navegador cancelar o ponteiro, e a foto voltava
         sozinha antes de a pessoa soltar. Quem segura a rolagem durante o
         gesto é o `touchmove` da galeria. */
      if (!eEspiada) document.body.style.overflow = 'hidden';

      /* Entrada de histórico descartável. Sem ela o "voltar" do celular não tem
         o que desfazer na página e sai dela — quem abria uma foto na página de
         nicho voltava para a home.

         A espiada fica de fora: ela nasce e morre no mesmo gesto, e empurrar
         uma entrada por foto espiada esbarraria no limite de `pushState` que o
         Safari impõe por janela de tempo. */
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

  /* Fechar pelo X ou pelo Esc desfaz a entrada empurrada na abertura, em vez de
     fechar direto: todos os caminhos passam pelo `popstate` e o histórico não
     acumula entradas mortas. O `else` cobre a entrada já ter sido consumida. */
  const closeLightbox = useCallback(() => {
    marcarEspiada(false);
    if (history.state?.lightbox) {
      history.back();
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  }, [marcarEspiada]);

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
      className={`lightbox-modal active${espiando ? ' lightbox-modal--espiada' : ''}`}
      id="lightbox-modal"
    >
      {!espiando && (
        <button className="lightbox-close" id="lightbox-close" aria-label="Fechar Galeria" onClick={closeLightbox}>
          <X aria-hidden="true" />
        </button>
      )}
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
