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

/*
  O clique na lupa só vale depois que a ilha do Lightbox hidrata: antes disso o
  evento é disparado e não há ninguém escutando, e ele some sem deixar rastro.
  No localhost a hidratação é instantânea e um `waitForTimeout` disfarçava; em
  produção, com rede real, o clique caía na janela entre as duas coisas e o
  teste acusava um defeito que não existia.
*/
async function aguardarLightboxHidratado(page) {
  await page.waitForFunction(
    () => {
      const ilha = [...document.querySelectorAll('astro-island')].find((n) =>
        (n.getAttribute('component-url') || '').includes('Lightbox')
      );
      return Boolean(ilha) && !ilha.hasAttribute('ssr');
    },
    null,
    { timeout: 10000 }
  );
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

  // --- as fileiras chegam a ficar visíveis? ---
  await page.locator('#portfolio').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1200);
  const opacidade = await page
    .locator('.carrossel')
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  checar('fileira visível depois de entrar na tela', opacidade === '1', `opacity=${opacidade}`);

  /*
    A home é a camada de destaque: uma fileira por categoria, 3 fotos em cada.
    Sem esta checagem, cada lote importado para as páginas por nicho inflaria a
    home em silêncio — num lote anterior ela pulou de 30 para 36 fotos sozinha.
  */
  const fileiras = await page.locator('.carrossel').count();
  checar('uma fileira por categoria', fileiras === 5, `${fileiras} fileiras`);

  const total = await page.locator('.portfolio-item').count();
  const porCategoria = await page.locator('.portfolio-item').evaluateAll((nos) => {
    const conta = {};
    for (const n of nos) {
      const c = n.dataset.category;
      conta[c] = (conta[c] ?? 0) + 1;
    }
    return conta;
  });
  const fora = Object.entries(porCategoria).filter(([, n]) => n !== 3);
  checar('home mostra 3 fotos por categoria', fora.length === 0 && total === 15,
         fora.length ? fora.map(([c, n]) => `${c}=${n}`).join(', ') : `${total} fotos`);

  /*
    Cada fileira termina num cartão com o link para a página do nicho. É a
    metade do link recíproco que parte da home — sem ela as cinco páginas
    ficariam órfãs.
  */
  const cartoes = await page
    .locator('.carrossel-cartao')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  // A barra final não é cosmética: sem ela o servidor responde com um redirect
  // antes de entregar a página, e cada link interno custaria um salto extra.
  const esperados = [
    '/tatuagem/coberturas/',
    '/tatuagem/botanico/',
    '/tatuagem/geek/',
    '/tatuagem/blackwork/',
    '/tatuagem/fine-line/'
  ];
  checar('cada fileira linka a página do nicho',
         JSON.stringify(cartoes) === JSON.stringify(esperados),
         cartoes.join(' '));

  /*
    No desktop as 4 vagas cabem e não há rolagem; no celular transbordam de
    propósito, e é o corte da segunda foto que sinaliza "arrasta".
    Este script roda a 390px, então todos os trilhos devem rolar.
  */
  const rolam = await page.locator('.carrossel-trilho').evaluateAll(
    (ts) => ts.filter((t) => t.scrollWidth > t.clientWidth).length
  );
  checar('trilhos rolam na horizontal no celular', rolam === 5, `${rolam}/5`);

  // --- filtro: agora esconde a fileira inteira, não foto a foto ---
  await page.locator('[data-filtro="blackwork"]').click();
  await page.waitForTimeout(150);
  const fileirasVisiveis = await page.locator('.carrossel:not(.hidden)').count();
  const categoriaVisivel = await page
    .locator('.carrossel:not(.hidden)')
    .first()
    .getAttribute('data-category');
  checar('filtro Blackwork mostra só a fileira de blackwork',
         fileirasVisiveis === 1 && categoriaVisivel === 'blackwork',
         `${fileirasVisiveis} fileira(s), primeira=${categoriaVisivel}`);

  const marcadoBw = await page.locator('[data-filtro="blackwork"]').getAttribute('aria-selected');
  const marcadoTodos = await page.locator('[data-filtro="all"]').getAttribute('aria-selected');
  checar('aria-selected acompanha o filtro ativo',
         marcadoBw === 'true' && marcadoTodos === 'false',
         `blackwork=${marcadoBw} todos=${marcadoTodos}`);

  await page.locator('[data-filtro="all"]').click();
  await page.waitForTimeout(150);
  const voltou = await page.locator('.carrossel:not(.hidden)').count();
  checar('voltar para Todos restaura as fileiras', voltou === 5, `${voltou}/5`);

  // --- lightbox ---
  await aguardarLightboxHidratado(page);
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

  /*
    O "voltar" do celular com a ampliação aberta.

    O lightbox abria e fechava só com estado do React: para o navegador nada
    acontecia, e o voltar saía da página. Quem ampliava uma foto na página de
    nicho caía na home, porque foi de lá que veio. A abertura passou a empurrar
    uma entrada de histórico descartável, e é ela que o voltar consome.

    O percurso começa na home de propósito — é ele que reproduz o defeito.
    Entrar direto na página de nicho não reproduz: sem página anterior, o
    voltar não teria para onde ir e o bug ficaria invisível.
  */
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.locator('a[href="/tatuagem/blackwork/"]').first().click();
  await page.waitForURL('**/tatuagem/blackwork/');
  await aguardarLightboxHidratado(page);
  await page.locator('.lightbox-trigger').first().click({ force: true });
  await page.waitForTimeout(300);
  const ampliouNoNicho = await page.locator('#lightbox-modal').isVisible().catch(() => false);
  checar('lightbox abre na página de nicho', ampliouNoNicho);

  await page.goBack();
  await page.waitForTimeout(400);
  const fechouNoVoltar = !(await page.locator('#lightbox-modal').isVisible().catch(() => false));
  const ficouNoNicho = page.url().includes('/tatuagem/blackwork/');
  checar('voltar fecha a ampliação e mantém a página', fechouNoVoltar && ficouNoNicho, page.url());

  const rolagemDevolvida = await page.evaluate(() => document.body.style.overflow === '');
  checar('voltar devolve a rolagem da página', rolagemDevolvida);

  // Esc é o atalho esperado de qualquer modal, e critério da WCAG 2.1.2.
  await page.locator('.lightbox-trigger').first().click({ force: true });
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const fechouNoEsc = !(await page.locator('#lightbox-modal').isVisible().catch(() => false));
  checar('Esc fecha a ampliação', fechouNoEsc);

  /*
    Fechar pelo X ou pelo Esc precisa consumir a entrada empurrada na abertura.
    Sem isso, quem abrisse e fechasse cinco fotos precisaria de cinco "voltar"
    para sair da página.
  */
  const semLixoNoHistorico = await page.evaluate(() => !history.state?.lightbox);
  checar('fechar não deixa entrada morta no histórico', semLixoNoHistorico);

  await page.goBack();
  await page.waitForTimeout(400);
  checar('um único voltar sai da página de nicho', !page.url().includes('/tatuagem/'), page.url());

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
