import React, { useState } from 'react';

const portfolioItems = [
  { id: 1, category: 'fineline', title: 'Floral Lavender', img: 'assets/tattoo1.png', alt: 'Tatuagem floral em traço fino (Fine Line)' },
  { id: 2, category: 'blackwork', title: 'Shadow Serpent', img: 'assets/tattoo2.png', alt: 'Tatuagem de serpente detalhada em Blackwork' },
  { id: 3, category: 'ornamental', title: 'Sacred Mandala', img: 'assets/tattoo3.png', alt: 'Tatuagem geométrica e ornamental simétrica' },
  { id: 4, category: 'fineline', title: 'Monarch Detail', img: 'assets/tattoo4.png', alt: 'Tatuagem de borboleta em micro-realismo' }
];

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Galeria</span>
          <h2 className="section-title">Trabalhos Recentes</h2>
          <div className="header-divider"></div>
        </div>

        <div className="portfolio-filters reveal">
          <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Todos</button>
          <button className={`filter-btn ${activeFilter === 'fineline' ? 'active' : ''}`} onClick={() => setActiveFilter('fineline')}>Fine Line</button>
          <button className={`filter-btn ${activeFilter === 'blackwork' ? 'active' : ''}`} onClick={() => setActiveFilter('blackwork')}>Blackwork</button>
          <button className={`filter-btn ${activeFilter === 'ornamental' ? 'active' : ''}`} onClick={() => setActiveFilter('ornamental')}>Ornamental</button>
        </div>

        <div className="portfolio-grid reveal">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio-item" data-category={item.category}>
              <div className="portfolio-img-wrapper">
                <img src={item.img} alt={item.alt} loading="lazy" />
                <div className="portfolio-hover">
                  <span className="item-category">{item.category === 'fineline' ? 'Fine Line' : item.category === 'blackwork' ? 'Blackwork' : 'Ornamental'}</span>
                  <h3 className="item-title">{item.title}</h3>
                  <button 
                    className="btn-zoom lightbox-trigger" 
                    aria-label="Ampliar Imagem" 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-lightbox', { detail: { src: item.img, title: item.title, category: item.category } }))}
                  >
                    <i data-lucide="maximize-2"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
