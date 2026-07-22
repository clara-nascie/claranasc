import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="about-section" id="sobre">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-column reveal">
            <div className="about-image-wrapper">
              <div className="about-image-placeholder" style={{ backgroundImage: "url('assets/hero-bg.png')" }}></div>
              <div className="about-image-frame"></div>
            </div>
          </div>
          <div className="about-content-column reveal">
            <span className="section-tag">A Artista</span>
            <h2 className="section-title text-left">Clara Nasc</h2>
            <div className="header-divider left"></div>
            <p className="about-text highlight">
              Especialista em eternizar histórias e conceitos através de traços finos meticulosos e contrastes marcantes.
            </p>
            <p className="about-text">
              Com mais de 5 anos de experiência e um espaço privativo focado em conforto e biossegurança, meu propósito é traduzir sentimentos em desenhos autorais e únicos. Acredito que cada tatuagem é um ritual de expressão individual e respeito ao corpo.
            </p>
            <div className="about-details">
              <div className="detail-item">
                <i data-lucide="shield-check"></i>
                <div>
                  <h4>Materiais Descartáveis</h4>
                  <p>Segurança total e assepsia rigorosa.</p>
                </div>
              </div>
              <div className="detail-item">
                <i data-lucide="pencil"></i>
                <div>
                  <h4>Arte 100% Autoral</h4>
                  <p>Desenhos criados exclusivamente para você.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
