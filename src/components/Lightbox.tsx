import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgData, setImgData] = useState({ src: '', title: '', category: '' });

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
    };

    window.addEventListener('open-lightbox', handleOpen);

    return () => {
      window.removeEventListener('open-lightbox', handleOpen);
    };
  }, []);

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  if (!isOpen) return null;

  return (
    <div className="lightbox-modal active" id="lightbox-modal">
      <button className="lightbox-close" id="lightbox-close" aria-label="Fechar Galeria" onClick={closeLightbox}>
        <X aria-hidden="true" />
      </button>
      <div className="lightbox-content">
        <img src={imgData.src} alt={imgData.title} id="lightbox-img" />
        <div className="lightbox-caption">
          <span className="lightbox-category" id="lightbox-category">{imgData.category === 'fineline' ? 'Fine Line' : imgData.category === 'blackwork' ? 'Blackwork' : 'Ornamental'}</span>
          <h3 className="lightbox-title" id="lightbox-title">{imgData.title}</h3>
        </div>
      </div>
    </div>
  );
};
