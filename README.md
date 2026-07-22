# Clara Nasc | Tattoo Portfolio

Este repositório contém o código-fonte do portfólio pessoal e profissional de **Clara Nasc**, tatuadora especializada em traços finos (Fine Line) e trabalhos autorais contrastantes (Blackwork / Ornamental). 

O projeto foi construído para ser visualmente impactante, combinando um design escuro sofisticado (*glassmorphism* e detalhes em dourado) com excelente desempenho de carregamento e integração direta para agendamentos rápidos via WhatsApp.

---

## 📂 Estrutura de Pastas

Abaixo está o mapeamento dos diretórios e arquivos que compõem o projeto:

```text
claranasc/
├── assets/                  # Arquivos de mídia e imagens do portfólio
│   ├── hero-bg.png          # Imagem de fundo principal (Hero)
│   ├── tattoo1.png          # Foto do portfólio: Floral Fine Line
│   ├── tattoo2.png          # Foto do portfólio: Snake Blackwork
│   ├── tattoo3.png          # Foto do portfólio: Sacred Mandala Ornamental
│   └── tattoo4.png          # Foto do portfólio: Monarch Micro-realism
├── docs/                    # Documentações detalhadas do projeto
│   └── stack.md             # Detalhamento do Stack Tecnológico
├── index.html               # Página única do site (Estrutura e SEO)
├── style.css                # Folha de estilo (Design System, animações e responsividade)
├── script.js                # Lógica e interatividade do cliente
└── README.md                # Descrição geral do projeto
```

---

## 🛠️ Stack Tecnológico

O site é construído com Astro para gerar arquivos estáticos super otimizados:
* **Astro**: Framework principal para renderização (SSG) e estruturação do site.
* **React & TypeScript**: Usados para componentes complexos e interativos com tipagem forte.
* **CSS3 Vanilla**: Layout responsivo com Flexbox, CSS Grid e variáveis customizadas.
* **Lucide Icons & Google Fonts**: Tipografia com as fontes *Syne* e *Inter*.

Para mais detalhes sobre as tecnologias, consulte a [Documentação de Stack](docs/tecnologias/tecnologias.md) e [Arquitetura](docs/arquitetura/arquitetura.md).

---

## 💻 Como Executar Localmente

O projeto utiliza Node.js e Astro para gerenciamento de dependências e servidor local.

1. Clone o repositório para sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/claranasc.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```
   Depois acesse `http://localhost:4321` no navegador.

---

## 🚀 Como Fazer o Deploy (Cloudflare Pages)

1. Certifique-se de realizar o push das últimas atualizações para a branch principal (`main`) no seu repositório do GitHub.
2. Acesse seu painel da **Cloudflare**.
3. Navegue até **Workers & Pages** > **Pages** e clique em **Connect to Git** (Conectar ao Git).
4. Selecione o repositório `claranasc`.
5. Em configurações de build:
   * **Framework preset**: Selecione *None* (Nenhum).
   * **Build command**: Deixe em branco.
   * **Build output directory**: Deixe como `/` (diretório raiz) ou `.`.
6. Clique em **Save and Deploy**. A Cloudflare gerará o deploy do site estático automaticamente em instantes e vinculará ao seu domínio `claranasc.com`.
