import React from 'react';
import { whatsappUrl, SOCIAL } from '../../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">CLARA<span>NASC</span></span>
            <p>Tatuadora em Belo Horizonte especializada em Fine Line, Botânico, Blackwork, Geek &amp; Animes e Coberturas.</p>
          </div>
          <div className="footer-links">
            <h3>Navegação</h3>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#portfolio">Portfólio</a></li>
              <li><a href="#sobre">A Artista</a></li>
              <li><a href="#contato">Agendar</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Redes Sociais</h3>
            <div className="social-icons">
              {/* Só renderiza quando o handle estiver preenchido em siteData.ts — link
                  para instagram.com/ sem perfil é link quebrado aos olhos do Google. */}
              {SOCIAL.instagram && (
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Perfil de Clara Nasc no Instagram" className="social-link">
                  <i data-lucide="instagram"></i>
                </a>
              )}
              <a href={whatsappUrl('Olá Clara! Vim pelo site e gostaria de saber mais sobre suas tatuagens.')} target="_blank" rel="noreferrer" aria-label="Conversar com Clara Nasc no WhatsApp" className="social-link">
                <i data-lucide="phone"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Clara Nasc. Todos os direitos reservados. Feito com amor.</p>
        </div>
      </div>
    </footer>
  );
};
