import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

// ⚠️ Links são `/#secao`, não `#secao`: o cabeçalho aparece em seis páginas e
// cinco não têm essas seções. Na home o navegador rola sem recarregar.
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="main-header" id="main-header">
        <div className="header-container">
          <a href="/" className="logo-link" id="logo">
            <img src="/favicon.png" alt="Ícone Clara Nasc" className="logo-icon" />
            <span className="logo-text">CLARA<span>NASC</span></span>
          </a>
          <nav className="nav-menu" id="nav-menu">
            <ul>
              <li><a href="/#portfolio" className="nav-link" id="nav-link-portfolio">Portfólio</a></li>
              <li><a href="/#sobre" className="nav-link" id="nav-link-sobre">A Artista</a></li>
              <li><Button as="a" href="/#contato" className="nav-link btn-header-cta" id="nav-link-contato">Agendar Sessão</Button></li>
            </ul>
          </nav>
          <button className="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Abrir Menu" onClick={toggleMenu}>
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} id="mobile-overlay" style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}>
        <button className="mobile-menu-close" id="mobile-menu-close" aria-label="Fechar Menu" onClick={closeMenu}>
          <X aria-hidden="true" />
        </button>
        <nav className="mobile-nav">
          <ul>
            <li><a href="/#portfolio" className="mobile-nav-link" id="mob-link-portfolio" onClick={closeMenu}>Portfólio</a></li>
            <li><a href="/#sobre" className="mobile-nav-link" id="mob-link-sobre" onClick={closeMenu}>A Artista</a></li>
            <li><Button as="a" href="/#contato" className="mobile-nav-link btn-mobile-cta" id="mob-link-contato" onClick={closeMenu}>Agendar Sessão</Button></li>
          </ul>
        </nav>
      </div>
    </>
  );
};
