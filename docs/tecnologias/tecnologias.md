# Tecnologias Utilizadas

A stack principal foi escolhida pensando em mesclar excelente performance de carregamento com manutenibilidade a longo prazo.

* **Astro**: Motor principal do site. Responsável pelo roteamento, orquestração e compilação do site estático final com zero JS excedente.
* **React**: Utilizado pontualmente como integração do Astro para construir componentes de interface que exigem estado ou alta interatividade (ex: Galeria Lightbox, Animações complexas, Cursor Customizado, Integração com WhatsApp).
* **TypeScript**: Camada de tipagem em cima do JavaScript/React. Evita bugs em tempo de desenvolvimento exigindo consistência nos dados (especialmente na formatação das mensagens dinâmicas para o WhatsApp).
* **CSS3 (Vanilla)**: Toda a camada visual e o Design System (*Dark Luxury*) são mantidos puros, aproveitando Flexbox, CSS Grid e variáveis globais (`:root`).
* **Node.js**: Age exclusivamente no ambiente de desenvolvimento local (para rodar `npm run dev`) e na etapa de build do Cloudflare. Não existe servidor Node rodando em tempo real (runtime) para o cliente.
