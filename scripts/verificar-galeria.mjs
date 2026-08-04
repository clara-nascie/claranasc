/**
 * Verificação da galeria do portfólio.
 *
 * Complementa `verificar-visual.mjs`, que olha o botão flutuante, contraste e
 * console. Aqui o alvo são as duas interações reescritas quando a galeria
 * deixou de ser React: o filtro por categoria e a abertura do lightbox.
 *
 * Existe uma checagem que parece redundante mas não é — a de opacidade. Contar
 * itens no DOM não prova que a visitante os vê: `.reveal` começa em
 * `opacity: 0` e depende de um IntersectionObserver. Um `threshold` medido por
 * fração de área já deixou a galeria permanentemente invisível no celular com
 * os 30 itens no lugar certo e nenhuma outra verificação reclamando.
 *
 * Uso:
 *   npm run preview        (em outro terminal)
 *   npm run verificar:galeria
 */
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';

const resultados = [];
function checar(nome, passou, detalhe) {
  resultados.push({ nome, passou: Boolean(passou), detalhe });
  console.log(`  ${passou ? 'PASSOU' : 'FALHOU'}  ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
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
  throw new Error(`Servidor não respondeu em ${url}. Rode \`npm run preview\` (ou \`npm run dev\`).`);
}

await aguardarServidor(BASE_URL);

const browser = await chromium.launch();

try {
  // Celular de propósito: é onde a galeria fica mais alta em relação à tela, e
  // portanto onde defeitos ligados à altura do elemento aparecem primeiro.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const errosConsole = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errosConsole.push(msg.text());
  });
  page.on('pageerror', (err) => errosConsole.push(`pageerror: ${err.message}`));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // --- a grade chega a ficar visível? ---
  await page.locator('#portfolio').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1200);
  const opacidade = await page
    .locator('.portfolio-grid')
    .evaluate((el) => getComputedStyle(el).opacity);
  checar('grade visível depois de entrar na tela', opacidade === '1', `opacity=${opacidade}`);

  // --- filtro ---
  const total = await page.locator('.portfolio-item').count();
  const visiveisInicio = await page.locator('.portfolio-item:not(.hidden)').count();
  checar('todos os itens aparecem no início', total > 0 && visiveisInicio === total,
         `${visiveisInicio}/${total}`);

  /*
    A home é a camada de destaque: 6 por categoria, igual para todas.
    Sem esta checagem, cada lote importado para as páginas por nicho inflaria a
    home em silêncio — no primeiro lote ela pulou de 30 para 36 fotos.
  */
  const porCategoria = await page.locator('.portfolio-item').evaluateAll((nos) => {
    const conta = {};
    for (const n of nos) {
      const c = n.dataset.category;
      conta[c] = (conta[c] ?? 0) + 1;
    }
    return conta;
  });
  const fora = Object.entries(porCategoria).filter(([, n]) => n !== 6);
  checar('home mostra 6 fotos por categoria', fora.length === 0,
         fora.length
           ? fora.map(([c, n]) => `${c}=${n}`).join(', ')
           : Object.keys(porCategoria).length + ' categorias com 6');

  await page.locator('[data-filtro="blackwork"]').click();
  await page.waitForTimeout(150);
  const visiveisBw = await page.locator('.portfolio-item:not(.hidden)').count();
  const esperadoBw = await page.locator('.portfolio-item[data-category="blackwork"]').count();
  checar('filtro Blackwork mostra só blackwork', visiveisBw === esperadoBw && visiveisBw > 0,
         `${visiveisBw} visíveis, esperado ${esperadoBw}`);

  const marcadoBw = await page.locator('[data-filtro="blackwork"]').getAttribute('aria-selected');
  const marcadoTodos = await page.locator('[data-filtro="all"]').getAttribute('aria-selected');
  checar('aria-selected acompanha o filtro ativo',
         marcadoBw === 'true' && marcadoTodos === 'false',
         `blackwork=${marcadoBw} todos=${marcadoTodos}`);

  await page.locator('[data-filtro="all"]').click();
  await page.waitForTimeout(150);
  const voltou = await page.locator('.portfolio-item:not(.hidden)').count();
  checar('voltar para Todos restaura a grade', voltou === total, `${voltou}/${total}`);

  // --- lightbox ---
  const primeiro = page.locator('.portfolio-item').first();
  await primeiro.locator('.lightbox-trigger').click({ force: true });
  await page.waitForTimeout(300);

  const modalAberto = await page.locator('#lightbox-modal').isVisible().catch(() => false);
  checar('lightbox abre ao clicar na lupa', modalAberto);

  if (modalAberto) {
    const src = await page.locator('#lightbox-img').getAttribute('src');
    // O build serve a variante por /_astro/; o dev serve pela rota /_image?.
    // As duas provam que a imagem passou pelo pipeline, e não é o arquivo cru.
    const peloPipeline = Boolean(src) && (src.includes('/_astro/') || src.includes('/_image?'));
    checar('lightbox recebe a variante ampliada', peloPipeline, src);

    const categoria = (await page.locator('#lightbox-category').textContent())?.trim();
    // 'Ornamental' era o fallback de um mapeamento que nunca casava e fazia
    // toda tatuagem ampliada aparecer com a mesma categoria.
    checar('categoria não caiu em fallback',
           categoria && categoria.length > 0 && categoria !== 'Ornamental',
           `categoria="${categoria}"`);

    const titulo = (await page.locator('#lightbox-title').textContent())?.trim();
    checar('título preenchido', titulo && titulo.length > 0, `título="${titulo}"`);

    const carregou = await page
      .locator('#lightbox-img')
      .evaluate((el) => el.complete && el.naturalWidth > 0);
    checar('imagem do lightbox carregou de fato', carregou);

    await page.locator('#lightbox-close').click();
    await page.waitForTimeout(250);
    const fechou = !(await page.locator('#lightbox-modal').isVisible().catch(() => false));
    checar('lightbox fecha no botão', fechou);
  }

  // --- a galeria não pode voltar a hidratar React ---
  const portfolioHidratado = await page
    .locator('astro-island')
    .evaluateAll((nos) => nos.some((n) => (n.getAttribute('component-url') || '').includes('Portfolio')));
  checar('galeria não hidrata React', !portfolioHidratado);

  checar('sem erros no console', errosConsole.length === 0, errosConsole.join(' | ') || 'nenhum');

  await page.close();
} finally {
  await browser.close();
}

const falhas = resultados.filter((r) => !r.passou);

console.log(`\n${'='.repeat(60)}`);
console.log(`${resultados.length - falhas.length}/${resultados.length} verificações passaram`);

if (falhas.length) {
  console.log(`\n${falhas.length} FALHA(S):`);
  for (const f of falhas) console.log(`  - ${f.nome}: ${f.detalhe}`);
}

process.exit(falhas.length ? 1 : 0);
