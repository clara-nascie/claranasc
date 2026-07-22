# Arquitetura do Site

O portfólio da Clara Nasc adota uma arquitetura focada em altíssima performance, ideal para SEO e navegação instantânea. 

A base arquitetural utiliza **Islands Architecture** provida pelo framework **Astro**. Isso significa que a página entrega HTML estático puro por padrão (Static Site Generation - SSG) e só carrega fragmentos de JavaScript exatamente onde são necessários (as "ilhas" de interatividade).

## Hospedagem e Infraestrutura
* **Provedor**: Cloudflare Pages.
* **Fluxo de Deploy**: A cada push na branch principal do repositório, a Cloudflare inicia a pipeline de build do Astro. O resultado gerado (arquivos estáticos em `/dist`) é propagado instantaneamente por centenas de servidores na Edge Network global.
* **Vantagens**: Resposta ultra-rápida, zero custos de servidor Node.js operante, e pontuação máxima em testes de Core Web Vitals do Google.
