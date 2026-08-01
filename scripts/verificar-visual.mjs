/**
 * Verificação visual e comportamental da home.
 *
 * Sobe o Chromium via Playwright, navega pelo site como uma visitante faria
 * e checa coisas que análise de código não alcança: se o botão flutuante
 * aparece na hora certa, se há erro de JavaScript no console, e se os textos
 * têm contraste suficiente contra o fundo que realmente ficou atrás deles.
 *
 * Uso:
 *   npm run dev            (em outro terminal)
 *   node scripts/verificar-visual.mjs
 *
 * As imagens vão para .playwright/ (ignorado pelo git).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT_DIR = '.playwright';

const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 } // iPhone 14
};

/** Luminância relativa de um canal, conforme a formula da WCAG. */
function canalLinear(valor255) {
  const c = valor255 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminancia([r, g, b]) {
  return 0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b);
}

/** Razão de contraste entre duas cores RGB. WCAG AA pede 4.5:1 para texto normal. */
function razaoContraste(rgb1, rgb2) {
  const l1 = luminancia(rgb1);
  const l2 = luminancia(rgb2);
  const [claro, escuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (escuro + 0.05);
}

function parseRgb(cssColor) {
  const m = cssColor.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).map(Number);
  return [parts[0], parts[1], parts[2]];
}

/**
 * Falhas conhecidas, já rastreadas e aceitas por ora: aparecem no relatório
 * como AVISO e não reprovam o processo, para o CI não ficar permanentemente
 * vermelho por algo que já tem issue aberta.
 *
 * Ao corrigir, **remova a entrada** — é de propósito que isso exija uma
 * decisão explícita, e não uma flag genérica de "ignorar erros".
 */
const FALHAS_ACEITAS = [
  // Só o botão primário: creme sobre marrom mel dá 3,78:1. O `.btn-secondary`
  // passou a 14,08:1 quando o hero virou fundo claro, então NÃO deve mais ser
  // aceito — o padrão é específico de propósito, para uma regressão nele voltar
  // a reprovar.
  { padrao: /contraste "Orçamento/, motivo: 'GitHub #8 — botão primário 3,78:1' }
];

const resultados = [];
function checar(nome, passou, detalhe) {
  const aceita = passou ? null : FALHAS_ACEITAS.find((f) => f.padrao.test(nome));
  resultados.push({ nome, passou, detalhe, aceita });
  const rotulo = passou ? 'PASSOU' : aceita ? 'AVISO ' : 'FALHOU';
  const sufixo = aceita ? `  [aceita: ${aceita.motivo}]` : '';
  console.log(`  ${rotulo}  ${nome}${detalhe ? ` — ${detalhe}` : ''}${sufixo}`);
}

/** Espera o servidor responder. Em CI o processo sobe em paralelo ao script. */
async function aguardarServidor(url, tentativas = 40) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return;
    } catch {
      // servidor ainda não está de pé
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Servidor não respondeu em ${url}. Rode \`npm run dev\` (ou \`npm run preview\`).`);
}

await aguardarServidor(BASE_URL);

const browser = await chromium.launch();

try {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [rotulo, viewport] of Object.entries(VIEWPORTS)) {
    console.log(`\n=== ${rotulo} (${viewport.width}x${viewport.height}) ===`);

    const page = await browser.newPage({ viewport });

    // Erros de JS e de rede passam batido numa inspeção de HTML — aqui são capturados.
    const errosConsole = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errosConsole.push(msg.text());
    });
    page.on('pageerror', (err) => errosConsole.push(`pageerror: ${err.message}`));
    const requisicoesFalhas = [];
    page.on('requestfailed', (req) => requisicoesFalhas.push(`${req.url()} (${req.failure()?.errorText})`));

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Deixa as animações de entrada (fade-in-delay-*) terminarem.
    await page.waitForTimeout(2000);

    const cta = page.locator('#floating-cta');

    // --- 1. O botão flutuante NÃO deve aparecer sobre o hero ---
    await checarVisibilidade(cta, false, `[${rotulo}] botão flutuante oculto sobre o hero`);
    await page.screenshot({ path: `${OUT_DIR}/${rotulo}-1-hero.png` });

    // --- 2. Deve aparecer depois de rolar o hero ---
    // `scrollIntoView({ block: 'start' })`, não `scrollIntoViewIfNeeded()`: o
    // hero agora tem 85vh e deixa a galeria espiar, então `#portfolio` já está
    // parcialmente visível sem rolar — e `IfNeeded` não faz nada nesse caso,
    // deixando o hero na tela e o teste medindo a situação errada.
    await page.locator('#portfolio').evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(800);
    await checarVisibilidade(cta, true, `[${rotulo}] botão flutuante visível no portfólio`);
    await page.screenshot({ path: `${OUT_DIR}/${rotulo}-2-portfolio.png` });

    /*
      --- 3. A foto da artista precisa ter tamanho de verdade ---

      Existir no DOM não é aparecer. A GitHub #18 viveu em produção com este
      contêiner colapsado para 2x3 pixels em toda tela até 992px: o elemento
      estava lá, o CSS estava lá, e a foto simplesmente não tinha tamanho.
      Nenhuma checagem daqui olhava esta seção.

      Mede a caixa renderizada em vez de conferir se o seletor existe. O limite
      de 50px é folgado de propósito — não é sobre enquadramento, é sobre
      distinguir "foto" de "resíduo de borda".
    */
    await page.locator('#sobre').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const foto = await page.locator('.about-image-foto').boundingBox();
    checar(
      `[${rotulo}] foto da artista visível`,
      Boolean(foto) && foto.width > 50 && foto.height > 50,
      foto ? `${Math.round(foto.width)}x${Math.round(foto.height)}px` : 'elemento não encontrado'
    );

    // --- 4. Deve sumir sobre o formulário de agendamento ---
    await page.locator('#contato').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await checarVisibilidade(cta, false, `[${rotulo}] botão flutuante oculto sobre o formulário`);
    await page.screenshot({ path: `${OUT_DIR}/${rotulo}-3-contato.png` });

    // --- 5. Contraste dos botões do hero ---
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    const botoesHero = await page.evaluate(() => {
      /**
       * Cor de fundo que realmente aparece atrás do elemento: sobe a árvore até
       * achar o primeiro ancestral com background-color opaco. Fundo hardcoded
       * quebra silenciosamente quando o layout muda — foi o que aconteceu quando
       * o hero deixou de ser escuro.
       */
      const fundoEfetivo = (el) => {
        let atual = el;
        while (atual && atual !== document.documentElement) {
          const cor = getComputedStyle(atual).backgroundColor;
          const m = cor.match(/rgba?\(([^)]+)\)/);
          if (m) {
            const p = m[1].split(/[,\s/]+/).map(Number);
            const alfa = p.length > 3 ? p[3] : 1;
            if (alfa > 0.85) return cor;
          }
          atual = atual.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };

      const encontrados = [];
      for (const el of document.querySelectorAll('.hero-actions a')) {
        const s = getComputedStyle(el);
        const proprio = s.backgroundColor;
        const temFundoProprio = !/rgba\([^)]*,\s*0\)$/.test(proprio) && proprio !== 'transparent';
        encontrados.push({
          texto: el.textContent.trim().slice(0, 30),
          cor: s.color,
          fundo: temFundoProprio ? proprio : fundoEfetivo(el.parentElement),
          fontSize: s.fontSize
        });
      }
      return encontrados;
    });

    for (const btn of botoesHero) {
      const razao = razaoContraste(parseRgb(btn.cor), parseRgb(btn.fundo));
      checar(
        `[${rotulo}] contraste "${btn.texto}"`,
        razao >= 4.5,
        `${razao.toFixed(2)}:1 (WCAG AA exige 4.5:1)`
      );
    }

    // --- 6. Erros de console e requisições falhas ---
    checar(`[${rotulo}] sem erros no console`, errosConsole.length === 0, errosConsole.join(' | ') || 'nenhum');
    checar(
      `[${rotulo}] sem requisições falhas`,
      requisicoesFalhas.length === 0,
      requisicoesFalhas.join(' | ') || 'nenhuma'
    );

    await page.close();
  }
} finally {
  await browser.close();
}

async function checarVisibilidade(locator, esperadoVisivel, nome) {
  // O botão usa visibility/opacity, então isVisible() do Playwright já reflete
  // corretamente o estado — ele considera visibility: hidden como invisível.
  const visivel = await locator.isVisible();
  const opacidade = await locator.evaluate((el) => getComputedStyle(el).opacity);
  const efetivamenteVisivel = visivel && Number(opacidade) > 0.5;
  checar(nome, efetivamenteVisivel === esperadoVisivel, `opacity=${opacidade}`);
}

const passaram = resultados.filter((r) => r.passou);
const avisos = resultados.filter((r) => !r.passou && r.aceita);
const bloqueantes = resultados.filter((r) => !r.passou && !r.aceita);

console.log(`\n${'='.repeat(60)}`);
console.log(`${passaram.length}/${resultados.length} verificações passaram`);

if (avisos.length) {
  console.log(`\n${avisos.length} AVISO(S) — falha conhecida, não reprova:`);
  for (const a of avisos) console.log(`  - ${a.nome}: ${a.detalhe}`);
}

if (bloqueantes.length) {
  console.log(`\n${bloqueantes.length} FALHA(S) BLOQUEANTE(S):`);
  for (const f of bloqueantes) console.log(`  - ${f.nome}: ${f.detalhe}`);
}

console.log(`\nImagens em ${OUT_DIR}/`);
process.exit(bloqueantes.length ? 1 : 0);
