import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { portfolioItems, PORTFOLIO_CATEGORIES } from '../../data/portfolioData';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const handleOpenLightbox = (src: string, title: string, categoryLabel: string) => {
    window.dispatchEvent(
      new CustomEvent('open-lightbox', {
        detail: { src, title, category: categoryLabel }
      })
    );
  };

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Galeria</span>
          <h2 className="section-title">Trabalhos Recentes</h2>
          <div className="header-divider"></div>
        </div>

        <div className="portfolio-filters reveal" role="tablist" aria-label="Filtros de categoria do portfólio">
          {PORTFOLIO_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeFilter === cat.id}
              className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid reveal">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio-item" data-category={item.category}>
              <div className="portfolio-img-wrapper">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="750"
                />
                <div className="portfolio-hover">
                  <span className="item-category">{item.categoryLabel}</span>
                  <h3 className="item-title">{item.title}</h3>
                  <button 
                    className="btn-zoom lightbox-trigger" 
                    aria-label={`Ampliar imagem de ${item.title}`} 
                    onClick={() => handleOpenLightbox(item.image, item.title, item.categoryLabel)}
                  >
                    <Maximize2 aria-hidden="true" />
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
