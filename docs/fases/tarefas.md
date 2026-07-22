# Lista de Tarefas: Portfólio Clara Nasc (Astro + React + TypeScript)

Use este checklist para acompanhar o passo a passo da evolução e migração do projeto para a nova stack. Marcadores `[x]` indicam tarefas concluídas.

## 🛠️ Configuração Inicial do Ambiente
- [x] Inicializar o projeto com o framework **Astro**.
- [x] Configurar **TypeScript** no projeto.
- [x] Adicionar e configurar a integração do **React** ao Astro.
- [x] Configurar ambiente **Node.js** (scripts de dev e build).
- [x] Atualizar o arquivo `docs/stack.md` e `README.md` refletindo a nova arquitetura.

## 🏗️ Migração de Estrutura e Estilos (HTML/CSS para Astro/React)
- [ ] Migrar o conteúdo de `index.html` para o layout principal em `src/pages/index.astro`.
- [ ] Refatorar a estilização global (`style.css`) para os padrões do Astro.
- [ ] Modularizar a página em Componentes Astro (Header, Hero, Portfolio, About, Contact).

## ⚛️ Refatoração de Interatividade (JavaScript para React/TS)
- [ ] Criar o componente React para o **Custom Cursor** (tipado com TypeScript).
- [ ] Criar o componente React para o **Lightbox** (Galeria do Portfólio).
- [ ] Implementar as animações de scroll (Intersection Observer) nos componentes.
- [ ] Refatorar a lógica do formulário de agendamento (WhatsApp) em um componente React ou função TypeScript.

## 🖼️ Mídia, SEO e Acessibilidade
- [ ] Otimizar e mover imagens estáticas para a pasta `public/` ou `src/assets/`.
- [ ] Configurar metatags de SEO dinâmicas (Head do Astro).
- [ ] Garantir acessibilidade (A11y) nos novos componentes React.

## 🚀 Desempenho e Deploy
- [ ] Testar a build do Astro para garantir que não há erros de TypeScript.
- [ ] Ajustar configurações de deploy (`wrangler.jsonc`) para o Cloudflare Pages (suporte à build do Astro).
- [ ] Deploy em produção e teste no Lighthouse.
