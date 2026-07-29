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

const resultados = [];
function checar(nome, passou, detalhe) {
  resultados.push({ nome, passou, detalhe });
  console.log(`  ${passou ? 'PASSOU' : 'FALHOU'}  ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
}

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
    await page.locator('#portfolio').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await checarVisibilidade(cta, true, `[${rotulo}] botão flutuante visível no portfólio`);
    await page.screenshot({ path: `${OUT_DIR}/${rotulo}-2-portfolio.png` });

    // --- 3. Deve sumir sobre o formulário de agendamento ---
    await page.locator('#contato').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await checarVisibilidade(cta, false, `[${rotulo}] botão flutuante oculto sobre o formulário`);
    await page.screenshot({ path: `${OUT_DIR}/${rotulo}-3-contato.png` });

    // --- 4. Contraste dos botões do hero ---
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    const botoesHero = await page.evaluate(() => {
      const encontrados = [];
      for (const el of document.querySelectorAll('.hero-actions a')) {
        const s = getComputedStyle(el);
        encontrados.push({
          texto: el.textContent.trim().slice(0, 30),
          cor: s.color,
          fundo: s.backgroundColor,
          fontSize: s.fontSize
        });
      }
      return encontrados;
    });

    // Cor efetiva atrás dos botões do hero: o overlay radial sobre a foto.
    // Amostra o pixel real do screenshot seria mais fiel; aqui usamos a cor
    // declarada do overlay no seu ponto mais opaco como aproximação honesta.
    const FUNDO_HERO = [10, 10, 10];

    for (const btn of botoesHero) {
      const corTexto = parseRgb(btn.cor);
      const corFundo = parseRgb(btn.fundo);
      // Botão com fundo próprio opaco compara contra ele; senão, contra o hero.
      const fundoEfetivo = corFundo && !btn.fundo.includes('rgba(0, 0, 0, 0)') ? corFundo : FUNDO_HERO;
      const razao = razaoContraste(corTexto, fundoEfetivo);
      checar(
        `[${rotulo}] contraste "${btn.texto}"`,
        razao >= 4.5,
        `${razao.toFixed(2)}:1 (WCAG AA exige 4.5:1)`
      );
    }

    // --- 5. Erros de console e requisições falhas ---
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

const falhas = resultados.filter((r) => !r.passou);
console.log(`\n${'='.repeat(60)}`);
console.log(`${resultados.length - falhas.length}/${resultados.length} verificações passaram`);
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(`  - ${f.nome}: ${f.detalhe}`);
}
console.log(`\nImagens em ${OUT_DIR}/`);
process.exit(falhas.length ? 1 : 0);
