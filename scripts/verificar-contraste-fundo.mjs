/**
 * Contraste do texto do hero contra o fundo REAL, pixel a pixel.
 *
 * Por que existe: o verificar-visual.mjs mede contraste subindo a arvore ate
 * achar um `background-color` opaco. Isso e cego para o crisantemo do hero, que
 * e `background-image` da `.hero-flor` -- o texto poderia estar em cima do
 * traco e o script continuaria lendo o creme do ancestral e aprovando. Foi o
 * que aconteceu: ele deu 12/14 enquanto o subtitulo media 2,10:1.
 *
 * Uso:
 *   npm run dev            (em outro terminal)
 *   npm run verificar:contraste
 *
 * Como mede: pinta o texto de transparente e captura so o fundo.
 *
 * Duas abordagens foram descartadas, as duas por falsear a medicao:
 *   - `visibility: hidden`: `.btn` tem `transition: all 0.4s`, e `all` inclui
 *     `visibility`. O texto some com 400ms de atraso e vaza para a captura.
 *   - remover o bloco do DOM: no layout empilhado a `.hero-flor` esta no
 *     FLUXO, entao ela sobe para o lugar que o texto ocupava. Media-se um
 *     layout que nao existe.
 * `color: transparent` nao mexe em layout nenhum.
 *
 * Duas leituras por elemento:
 *   p1   percentil 1 dos pixels mais escuros. E o numero de julgamento: ignora
 *        pixel isolado de grao, mas pega qualquer regiao escura de verdade.
 *   min  o pixel mais escuro. So para registro -- com o grao ligado ele quase
 *        sempre e ruido de 1px e reprovaria tudo.
 */
import { chromium } from 'playwright';

const LARGURAS = [1440, 1280, 1100, 993, 900, 768, 600, 390];
const ALVOS = ['.hero-tagline', '.hero-title-name', '.hero-title-role', '.hero-subtitle', '#hero-secondary-btn'];

const canal = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => { const [x, y] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)]; return (x + 0.05) / (y + 0.05); };
const rgbDe = (s) => s.match(/rgba?\(([^)]+)\)/)[1].split(/[,\s/]+/).map(Number).slice(0, 3);

const browser = await chromium.launch();
const leitor = await browser.newPage();
const reprovas = [];

for (const largura of LARGURAS) {
  const page = await browser.newPage({ viewport: { width: largura, height: 1000 } });
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  const alvos = await page.evaluate((sels) => sels.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      sel, cor: getComputedStyle(el).color,
      grande: parseFloat(getComputedStyle(el).fontSize) >= 24,
      caixa: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    };
  }).filter(Boolean), ALVOS);

  await page.addStyleTag({
    content: `.hero-content, .hero-content * {
      color: transparent !important;
      -webkit-text-fill-color: transparent !important;
    }`
  });
  const altura = await page.evaluate(() => document.querySelector('.hero-section').getBoundingClientRect().height);
  await page.waitForTimeout(200);
  const png = (await page.screenshot({ clip: { x: 0, y: 0, width: largura, height: Math.min(1000, Math.ceil(altura)) } })).toString('base64');
  await page.close();

  // Decodifica no proprio navegador: unico decodificador de PNG disponivel sem
  // adicionar dependencia ao projeto.
  const medidos = await leitor.evaluate(async ({ png, alvos }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + png;
    await img.decode();
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    return alvos.map((a) => {
      const { x, y, w, h } = a.caixa;
      const larg = Math.min(w, cv.width - x), alt = Math.min(h, cv.height - y);
      if (larg <= 0 || alt <= 0 || y < 0) return { ...a, fora: true };
      const d = ctx.getImageData(x, y, larg, alt).data;
      const px = [];
      for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
      px.sort((p, q) => (p[0] + p[1] + p[2]) - (q[0] + q[1] + q[2]));
      return { ...a, min: px[0], p1: px[Math.floor(px.length * 0.01)] };
    });
  }, { png, alvos });

  console.log(`\n=== ${largura}px ===`);
  for (const m of medidos) {
    if (m.fora) { console.log(`  (fora do recorte) ${m.sel}`); continue; }
    const cor = rgbDe(m.cor);
    const minimo = m.grande ? 3 : 4.5;
    const r1 = razao(cor, m.p1), rMin = razao(cor, m.min);
    const ok = r1 >= minimo;
    if (!ok) reprovas.push(`${largura}px ${m.sel} ${r1.toFixed(2)}:1`);
    console.log(`  ${ok ? 'PASSOU' : 'FALHOU'}  ${m.sel.padEnd(22)} p1 ${r1.toFixed(2)}:1  (min absoluto ${rMin.toFixed(2)}:1, exigido ${minimo})`);
  }
}

await browser.close();
console.log(reprovas.length ? `\n${reprovas.length} reprova(s):\n  ${reprovas.join('\n  ')}` : '\nNenhuma reprova.');
