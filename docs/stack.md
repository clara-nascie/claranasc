# Stack Tecnológico

Este site foi projetado focando em **máxima performance**, **acessibilidade** e **experiência do usuário (UX) premium**. Optamos por uma arquitetura estática leve e moderna, ideal para hospedagem em redes de distribuição de conteúdo (CDNs) globais, como o Cloudflare Pages.

---

## 🛠️ Tecnologias Principais

### 1. HTML5 (Semântico)
* **Função**: Estruturação de todo o conteúdo da página.
* **Diferenciais**:
  * Uso de tags semânticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) para otimização de SEO e melhor leitura por leitores de tela.
  * Otimizações de metatags de SEO (OpenGraph, descrição, palavras-chave) para engajamento e compartilhamento nas redes sociais.

### 2. CSS3 (Customizado & Moderno)
* **Função**: Estilização visual completa e layout responsivo.
* **Diferenciais**:
  * Uso intensivo de **Custom Properties (CSS Variables)**, permitindo fácil manutenção do sistema de cores e espaçamento.
  * Layout flexível e robusto baseado em **CSS Grid** e **Flexbox**.
  * Efeitos visuais modernos: **Glassmorphism** (efeito de vidro jateado com `backdrop-filter`) e animações fluidas (`cubic-bezier`).
  * Rolagem suave nativa (`scroll-behavior: smooth`).

### 3. JavaScript (ES6+ Vanilla)
* **Função**: Adição de interatividade e lógica de negócios no cliente.
* **Diferenciais**:
  * Sem frameworks pesados (React/Vue/Angular), garantindo um carregamento praticamente instantâneo (First Contentful Paint baixíssimo).
  * **Intersection Observer API**: Usada para disparar animações de entrada elegantes à medida que o usuário rola a página.
  * **Custom Cursor System**: Criação de um cursor interativo duplo com efeito de inércia (lag suave) em telas que aceitam hover.
  * **Lightbox Gallery**: Sistema nativo de ampliação de fotos com backdrop embaçado e navegação intuitiva.

---

## 🎨 Design e Tipografia

* **Fontes (Google Fonts)**:
  * **Syne**: Fonte geométrica e ousada usada em títulos e cabeçalhos para transmitir a estética artística e contemporânea da tatuagem.
  * **Inter**: Fonte limpa, neutra e de altíssima legibilidade para o corpo de texto e formulários.
* **Ícones**:
  * **Lucide Icons**: Pacote de ícones minimalista e moderno importado de forma otimizada via CDN (`unpkg`).

---

## 🔗 Integrações

* **API de Conversas do WhatsApp (`wa.me`)**:
  * O formulário de agendamento recolhe os dados do cliente (nome, estilo, tamanho, local do corpo e descrição da ideia) e os compila dinamicamente em uma string codificada em URL.
  * O usuário é redirecionado de maneira transparente diretamente para a interface do WhatsApp com a mensagem pronta para envio, eliminando a necessidade de um servidor de e-mail ou banco de dados externo.

---

## 🚀 Hospedagem e Deploy

* **Plataforma Recomendada**: **Cloudflare Pages**
* **Vantagens**:
  * Integração contínua (CI/CD) automática com o repositório Git.
  * Entrega na borda global (Edge Network), oferecendo tempos de resposta extremamente rápidos em qualquer lugar do mundo.
  * Certificados SSL/HTTPS gratuitos automáticos.
