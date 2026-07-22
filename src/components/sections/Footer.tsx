import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">CLARA<span>NASC</span></span>
            <p>Tatuadora profissional especializada em Fine Line e designs autorais exclusivos.</p>
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
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link">
                <i data-lucide="instagram"></i>
              </a>
              <a href="https://wa.me/5531983529270" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-link">
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
