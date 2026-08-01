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
/*
  O cabecalho entra na lista porque ele flutua SOBRE o hero: os links ficam no
  topo direito, que e onde a mascara nao apaga nada e a flor esta em forca
  cheia. E a regiao de pior caso da pagina, nao a de melhor.
*/
const ALVOS = [
  '.hero-tagline', '.hero-title-name', '.hero-title-role', '.hero-subtitle', '.hero-endereco a',
  '#hero-secondary-btn',
  '#nav-link-portfolio', '#nav-link-sobre', '#nav-link-contato'
];

/**
 * Falhas conhecidas e aceitas por decisao. Aparecem como AVISO e nao reprovam,
 * pelo mesmo motivo do verificar-visual.mjs: um relatorio permanentemente
 * vermelho deixa de ser lido, e a proxima regressao de verdade passa batida.
 *
 * Ao corrigir, **remova a entrada**. E de proposito que isso exija uma decisao
 * explicita, em vez de uma flag generica de "ignorar erros".
 */
const FALHAS_ACEITAS = [
  {
    padrao: /\.hero-tagline|#nav-link-contato/,
    motivo: 'Clara decidiu em 31/07/2026 nao mexer no --accent-gold. Dourado sobre fundo claro nao alcanca 4,5:1; e a mesma raiz do botao primario na GitHub #8.'
  }
];

const canal = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => { const [x, y] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)]; return (x + 0.05) / (y + 0.05); };
const rgbDe = (s) => s.match(/rgba?\(([^)]+)\)/)[1].split(/[,\s/]+/).map(Number).slice(0, 3);

const browser = await chromium.launch();
const leitor = await browser.newPage();
const reprovas = [];
const avisos = new Set();

for (const largura of LARGURAS) {
  const page = await browser.newPage({ viewport: { width: largura, height: 1000 } });
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  const alvos = await page.evaluate((sels) => sels.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    /*
      Encolhe a caixa antes de amostrar. Borda e canto arredondado nao sao
      fundo, e entravam na conta como se fossem:
        - a borda do `.btn-header-cta` e do mesmo dourado do rotulo dele, entao
          o pixel "mais escuro do fundo" era a propria borda e o contraste dava
          1,00:1;
        - fora do raio do canto o fundo do botao nao pinta, e o desenho do hero
          aparecia por ali.
      O texto nunca chega nessa faixa -- ha padding entre ele e a borda.
    */
    const recuo = Math.ceil(Math.max(
      parseFloat(s.borderTopWidth) || 0,
      parseFloat(s.borderLeftWidth) || 0,
      parseFloat(s.borderTopLeftRadius) || 0
    )) + 1;
    return {
      sel, cor: s.color,
      grande: parseFloat(s.fontSize) >= 24,
      recuo,
      caixa: {
        x: Math.round(r.x) + recuo,
        y: Math.round(r.y) + recuo,
        w: Math.round(r.width) - recuo * 2,
        h: Math.round(r.height) - recuo * 2
      }
    };
  }).filter(Boolean), ALVOS);

  await page.addStyleTag({
    /*
      `.nav-menu a.nav-link` e mais especifico de proposito: o `.btn-header-cta`
      declara `color: ... !important`, e um seletor de uma classe so empatava
      com ele. O empate fazia o rotulo continuar pintado, e a medicao lia a
      propria letra como se fosse o fundo -- dava 1,00:1.
    */
    content: `.hero-content, .hero-content *, .nav-menu, .nav-menu *,
      .nav-menu a.nav-link, .nav-menu a.nav-link * {
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
    const aceita = ok ? null : FALHAS_ACEITAS.find((f) => f.padrao.test(m.sel));
    if (!ok && !aceita) reprovas.push(`${largura}px ${m.sel} ${r1.toFixed(2)}:1`);
    if (!ok && aceita) avisos.add(m.sel);
    const rotulo = ok ? 'PASSOU' : aceita ? 'AVISO ' : 'FALHOU';
    console.log(`  ${rotulo}  ${m.sel.padEnd(22)} p1 ${r1.toFixed(2)}:1  (min absoluto ${rMin.toFixed(2)}:1, exigido ${minimo})`);
  }
}

await browser.close();

if (avisos.size) {
  console.log(`\nAVISO(S) -- falha conhecida, nao reprova:`);
  for (const sel of avisos) {
    console.log(`  - ${sel}: ${FALHAS_ACEITAS.find((f) => f.padrao.test(sel)).motivo}`);
  }
}

console.log(reprovas.length ? `\n${reprovas.length} reprova(s):\n  ${reprovas.join('\n  ')}` : '\nNenhuma reprova.');
process.exit(reprovas.length ? 1 : 0);
