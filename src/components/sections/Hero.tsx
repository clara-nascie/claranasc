import React from 'react';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-background" style={{ backgroundImage: "url('/assets/hero-bg.webp')" }}></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-tagline fade-in">Fine Line, Geek, Cobertura & Blackwork</span>
        <h1 className="hero-title fade-in-delay-1">Clara Nasc</h1>
        <p className="hero-subtitle fade-in-delay-2">A resposta para a vida, o universo e tudo mais é sempre uma tatuagem nova!</p>
        <div className="hero-actions fade-in-delay-3">
          <Button as="a" href="#contato" className="btn-primary" id="hero-cta-btn">
            <span>Orçamento & Agendamento</span>
            <i data-lucide="arrow-right"></i>
          </Button>
          <Button as="a" href="#portfolio" className="btn-secondary" id="hero-secondary-btn">Ver Portfólio</Button>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span className="scroll-text">Role para explorar</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};
