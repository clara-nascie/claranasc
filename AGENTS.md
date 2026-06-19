# Memória do Projeto (AGENTS.md)

Este arquivo serve como contexto e memória persistente para agentes de IA (como Gemini/Antigravity) que trabalham neste repositório. Ele resume as decisões de design, padrões de código e diretrizes operacionais do projeto.

---

## 📌 Visão Geral do Projeto
* **Nome**: claranasc.com (Portfólio de Tatuagem)
* **Objetivo**: Site institucional e portfólio autoral estático para a tatuadora **Clara Nasc**.
* **Estilo Visual**: Estética luxuosa escura (*luxury dark mode*) com paleta baseada em carvão/preto e acentos em dourado champanhe.

---

## 📐 Diretrizes de Desenvolvimento e Arquitetura

### 1. Stack Tecnológico e Abstração
* **Sem Frameworks**: Manter o site puramente estático usando **HTML5**, **CSS3 (Vanilla)** e **JavaScript (ES6+)**. Não introduza frameworks (React, Vue, Vite, Tailwind, etc.) a menos que explicitamente solicitado pela usuária.
* **CDNs Externas**: Os ícones são carregados via Lucide Icons CDN no `index.html`. Evite instalar dependências locais complexas via `npm` para manter o deploy ágil e leve.

### 2. Design System (CSS)
* As variáveis globais de estilo estão centralizadas em `:root` no arquivo `style.css`.
* Cores principais:
  * Fundo primário: `hsl(240, 10%, 4%)` (Preto profundo)
  * Fundo secundário: `hsl(240, 6%, 8%)` (Carvão escuro)
  * Dourado acento: `hsl(36, 40%, 64%)` (#c5a880 - Champanhe)
* Ao adicionar novos elementos ou seções, use sempre o sistema de grid/flexbox existente e as fontes declaradas (`Syne` e `Inter`).

### 3. Interatividade (JS)
* Toda a interatividade está mapeada em `script.js`.
* Recursos implementados:
  * Cursor duplo interativo com inércia (`cursor-outer` e `cursor-inner`). Desabilitado automaticamente em dispositivos que não suportam hover (telas de toque).
  * Lightbox nativo para visualização das fotos do portfólio.
  * Intersection Observer para revelação suave de seções ao rolar a página (`.reveal`).
  * Gerador de link de WhatsApp a partir do formulário de contato.

---

## ⚙️ Configurações Importantes

* **Número do WhatsApp**:
  * A variável `WHATSAPP_NUMBER` está localizada no início de `script.js`. 
  * Certifique-se de instruir a usuária a atualizá-la caso altere de número.

* **Diretório de Assets**:
  * Todas as imagens de tattoos do portfólio devem ser armazenadas na pasta `assets/` no formato `.png`.
  * Nunca use placeholders de URLs externos para imagens do portfólio; sempre prefira gerar ou referenciar imagens locais salvas no repositório.

---

## 🚀 Deploy e Infraestrutura
* O site está configurado para deploy automático na **Cloudflare Pages**.
* **Sem comando de build**: O diretório de saída é a raiz `/` e não há build ou compilação ativa.
* Ao alterar cabeçalhos ou meta tags em `index.html`, sempre valide o funcionamento das tags OpenGraph e responsividade de tela.
