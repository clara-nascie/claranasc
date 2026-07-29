import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { heroShowcase } from '../../data/portfolioData';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        <div className="hero-content">
          <span className="hero-tagline fade-in">Blackwork, Fine Line, Botânico, Geek &amp; Coberturas</span>
          {/*
            O H1 carrega o nome e o termo de busca. O nome fica no tamanho grande
            e "Tatuadora em Belo Horizonte" entra como linha secundária dentro do
            mesmo H1 — para o Google, o H1 inteiro conta como um só título.
          */}
          <h1 className="hero-title fade-in-delay-1">
            <span className="hero-title-name">Clara Nasc</span>
            <span className="hero-title-role">Tatuadora em Belo Horizonte</span>
          </h1>
          <p className="hero-subtitle fade-in-delay-2">
            A resposta para a vida, o universo e tudo mais é sempre uma tatuagem nova!
          </p>
          <div className="hero-actions fade-in-delay-3">
            <Button as="a" href="#contato" className="btn-primary" id="hero-cta-btn">
              <span>Orçamento &amp; Agendamento</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button as="a" href="#portfolio" className="btn-secondary" id="hero-secondary-btn">
              Ver Portfólio
            </Button>
          </div>
        </div>

        {/*
          Vitrine sem overlay escurecedor: a primeira imagem é grande o suficiente
          para o traço ser avaliado de perto, e as duas menores comunicam leque de
          estilos sem virar miniatura ilegível.

          A primeira imagem é o elemento LCP, por isso `loading="eager"` e
          `fetchPriority="high"` — o oposto do resto do site, que é lazy.
        */}
        <div className="hero-showcase">
          {heroShowcase.map((item, indice) => (
            <figure key={item.id} className={`hero-showcase-item hero-showcase-item--${indice === 0 ? 'principal' : 'secundaria'}`}>
              <img
                src={item.image}
                alt={item.alt}
                width={indice === 0 ? 760 : 380}
                height={indice === 0 ? 950 : 475}
                loading={indice === 0 ? 'eager' : 'lazy'}
                fetchPriority={indice === 0 ? 'high' : 'auto'}
                decoding={indice === 0 ? 'sync' : 'async'}
              />
              <figcaption className="hero-showcase-label">{item.categoryLabel}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
