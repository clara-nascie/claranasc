import React from 'react';
import { Phone } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { TiktokIcon } from '../ui/TiktokIcon';
import { whatsappUrl, SOCIAL, LOCATION, mapsUrl, LICENCIAMENTO } from '../../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">CLARA<span>NASC</span></span>
            <p>Tatuadora em Belo Horizonte especializada em Blackwork, Fine Line, Botânico, Geek &amp; Animes e Coberturas.</p>
          </div>
          {/* `/#secao` e não `#secao` — mesma razão do Header.tsx. */}
          <div className="footer-links">
            <h3>Navegação</h3>
            <ul>
              <li><a href="/">Início</a></li>
              <li><a href="/#portfolio">Portfólio</a></li>
              <li><a href="/#sobre">A Artista</a></li>
              <li><a href="/#contato">Agendar</a></li>
              {/* Sem este link a página de licenciamento fica órfã: existiria só
                  no sitemap e no `license` dos dados estruturados. */}
              <li><a href={LICENCIAMENTO.caminho}>Uso das imagens</a></li>
            </ul>
          </div>
          {/* ⚠️ Sai de `LOCATION`, nunca escrito à mão: o Google cruza esta
              grafia com a do Business Profile, e duas versões do mesmo
              endereço enfraquecem a associação. */}
          <div className="footer-studio">
            <h3>Estúdio</h3>
            <address className="footer-endereco">
              <strong>{LOCATION.studioName}</strong>
              <span>{LOCATION.streetAddress}</span>
              <span>{LOCATION.neighborhood}, {LOCATION.city} — {LOCATION.region}</span>
              <span>CEP {LOCATION.postalCode}</span>
              <a href={mapsUrl()} target="_blank" rel="noopener">Ver no mapa</a>
            </address>
          </div>
          <div className="footer-social">
            <h3>Redes Sociais</h3>
            <div className="social-icons">
              {/* Só renderiza com o handle preenchido: link para o domínio da
                  rede sem perfil conta como link quebrado. */}
              {SOCIAL.instagram && (
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Perfil de Clara Nasc no Instagram" className="social-link">
                  <InstagramIcon size={22} />
                </a>
              )}
              {SOCIAL.tiktok && (
                <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer" aria-label="Perfil de Clara Nasc no TikTok" className="social-link">
                  <TiktokIcon size={20} />
                </a>
              )}
              <a href={whatsappUrl('Olá Clara! Vim pelo site e gostaria de saber mais sobre suas tatuagens.')} target="_blank" rel="noreferrer" aria-label="Conversar com Clara Nasc no WhatsApp" className="social-link">
                <Phone aria-hidden="true" />
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
