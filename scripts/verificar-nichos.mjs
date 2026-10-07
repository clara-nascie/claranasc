/**
 * Verificação das páginas por nicho (/tatuagem/...).
 *
 * ⚠️ Rode contra `npm run preview`, não contra `npm run dev`: a barra de
 * ferramentas do Astro no dev tem H1 próprios (o Playwright atravessa shadow
 * DOM) e o sitemap só existe no build.
 *
 *   npm run preview                          (em outro terminal)
 *   BASE_URL=http://localhost:4321 npm run verificar:nichos
 */
import { readdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';

/** Os cinco slugs, com o que cada página tem de próprio. */
const NICHOS = [
  { slug: 'coberturas', h1: 'Cobertura de tatuagem em Belo Horizonte', antesDepois: true },
  { slug: 'botanico', h1: 'Tatuagem botânica em Belo Horizonte' },
  { slug: 'geek', h1: 'Tatuagem geek e de anime em Belo Horizonte' },
  { slug: 'blackwork', h1: 'Tatuagem blackwork em Belo Horizonte' },
  { slug: 'fine-line', h1: 'Tatuagem fine line em Belo Horizonte' }
];

const resultados = [];
function checar(nome, passou, detalhe) {
  resultados.push({ nome, passou: Boolean(passou), detalhe });
  console.log(`  ${passou ? 'PASSOU' : 'FALHOU'}  ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
}

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

// `null` quando não há sitemap (dev server). A checagem que depende dele então
// se anuncia como não verificada, em vez de passar sem ter olhado nada.
const urlsDoSitemap = await (async () => {
  try {
    const res = await fetch(new URL('/sitemap-0.xml', BASE_URL));
    if (!res.ok) return null;
    const xml = await res.text();
    return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  } catch {
    return null;
  }
})();

if (!urlsDoSitemap) {
  console.log('\n⚠ Sem sitemap nesta URL (é o dev server). Rode contra `npm run preview`');
  console.log('  para verificar também a consistência entre canonical e sitemap.');
} else {
  // Toda foto da pagina precisa estar no sitemap de imagens.
  try {
    const res = await fetch(new URL('/sitemap-imagens.xml', BASE_URL));
    if (res.ok) {
      const xml = await res.text();
      const urlsUnicas = new Set([...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(m => m[1]));
      // Conta a pasta em vez de fixar um número: o painel /admin acrescenta fotos.
      const fotosNoProjeto = readdirSync(new URL('../src/assets/portfolio/', import.meta.url))
        .filter((nome) => nome.endsWith('.webp')).length;
      checar(
        `sitemap de imagens lista as ${fotosNoProjeto} fotos da pasta do portfólio`,
        urlsUnicas.size === fotosNoProjeto,
        `${urlsUnicas.size} fotos únicas declaradas`
      );
    } else {
      checar('sitemap de imagens acessível', false, 'arquivo não existe');
    }
  } catch {
    checar('sitemap de imagens acessível', false, 'falha no fetch');
  }
}

/* Coberturas: grade por foto, com a miniatura do antes, e uma ampliação que
   mostra só a tatuagem tocada — o par lado a lado no desktop, e depois → antes
   em deslize no celular. */
async function checarAntesDepois(page) {
  const colunas = await page
    .locator('.coberturas-grid')
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  checar('grade de coberturas em 3 colunas no desktop', colunas === 3, `${colunas} colunas`);

  const proporcoes = await page
    .locator('.cobertura-foto')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => r.width / r.height));
  checar('foto do depois em 4:5', proporcoes.length > 0 && proporcoes.every((p) => Math.abs(p - 0.8) < 0.01),
         `${proporcoes.length} cards`);

  const miniaturas = await page.locator('.cobertura-card').evaluateAll((cards) =>
    cards.map((card) => {
      const gatilho = card.querySelector('.lightbox-trigger');
      const img = card.querySelector('[data-antes] img');
      const foto = card.querySelector('.cobertura-foto').getBoundingClientRect();
      const r = img?.getBoundingClientRect();
      return {
        temAntes: Boolean(gatilho.dataset.antesSrc),
        carregou: Boolean(img && img.complete && img.naturalWidth > 0),
        // Canto inferior esquerdo, dentro da foto do depois.
        noCanto: Boolean(r && r.left - foto.left < 20 && foto.bottom - r.bottom < 40 && r.width < foto.width * 0.4)
      };
    })
  );
  const comAntes = miniaturas.filter((m) => m.temAntes);
  checar('cards com antes mostram a miniatura carregada',
         comAntes.length > 0 && comAntes.every((m) => m.carregou),
         `${comAntes.filter((m) => m.carregou).length}/${comAntes.length}`);
  checar('miniatura do antes no canto inferior esquerdo', comAntes.every((m) => m.noCanto));
  checar('card sem antes não tem miniatura',
         miniaturas.filter((m) => !m.temAntes).every((m) => !m.carregou));

  // ⚠️ O schema e o sitemap de imagens declaram a Clara como autora: o antes
  // não pode entrar em nenhum dos dois.
  const noSchema = await page.locator('script[type="application/ld+json"]').evaluateAll((nos) =>
    nos.map((n) => n.textContent ?? '').join(' ')
  );
  const xml = await (await fetch(new URL('/sitemap-imagens.xml', BASE_URL))).text();
  const antesNoSchema = /-antes\./.test(noSchema);
  const antesNoSitemap = /-antes\./.test(xml);
  checar('foto do antes fora do schema e do sitemap de imagens', !antesNoSchema && !antesNoSitemap,
         `schema=${antesNoSchema} sitemap=${antesNoSitemap}`);

  const slideAtual = '.lightbox-slide[aria-hidden="false"]';
  await page.locator('.lightbox-trigger[data-antes-src]').first().click();
  await page.locator(`${slideAtual} .lightbox-par img`).first().waitFor({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const par = await page.locator(`${slideAtual} .lightbox-par img`).evaluateAll((imgs) =>
    imgs.map((img) => img.getBoundingClientRect()).map((r) => ({ top: Math.round(r.top), left: Math.round(r.left) }))
  );
  checar('desktop: antes e depois lado a lado na ampliação',
         par.length === 2 && par[0].top === par[1].top && par[0].left < par[1].left,
         JSON.stringify(par));
  await checarTamanhoDoPar(page, 'desktop');
  const slidesDesktop = await page.locator('#lightbox-contador').count();
  checar('desktop: ampliação mostra só aquela tatuagem', slidesDesktop === 0,
         slidesDesktop ? 'contador visível: a fileira tem mais de uma foto' : 'um slide');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}

/* O par tem que ocupar a tela, e o título ficar abaixo dele, sem sobrepor. */
async function checarTamanhoDoPar(page, rotulo) {
  const medida = await page.evaluate(() => {
    const atual = '.lightbox-slide[aria-hidden="false"]';
    const foto = document.querySelector(`${atual} .lightbox-par img`)?.getBoundingClientRect();
    const titulo = document.querySelector(`${atual} .lightbox-title`)?.getBoundingClientRect();
    if (!foto || !titulo) return null;
    return {
      altura: Math.round((foto.height / innerHeight) * 100),
      tituloAbaixo: titulo.top >= foto.bottom,
      tituloNaTela: titulo.bottom <= innerHeight
    };
  });
  checar(`${rotulo}: par ocupa ao menos 70% da altura da tela, com o título abaixo`,
         medida && medida.altura >= 70 && medida.tituloAbaixo && medida.tituloNaTela,
         JSON.stringify(medida));
}

/* ⚠️ Zoom do navegador = a mesma tela física com menos px de CSS. Uma faixa
   fixa em px come cada vez mais altura; a 200% o par já chegou a 16%. */
async function checarParComZoom(slug) {
  const page = await browser.newPage({ viewport: { width: 941, height: 404 }, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/tatuagem/${slug}`, { waitUntil: 'networkidle' });
  await page.locator('.lightbox-trigger[data-antes-src]').first().click();
  await page.locator('.lightbox-slide[aria-hidden="false"] .lightbox-par img').first().waitFor({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(800);
  await checarTamanhoDoPar(page, 'zoom de 200%');
  await page.close();
}

async function checarAntesDepoisNoCelular(slug) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE_URL}/tatuagem/${slug}`, { waitUntil: 'networkidle' });

  const colunas = await page
    .locator('.coberturas-grid')
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  checar('celular: grade em 2 colunas', colunas === 2, `${colunas} colunas`);

  const gatilho = page.locator('.lightbox-trigger[data-antes-src]').first();
  const antesSrc = await gatilho.getAttribute('data-antes-src');
  const depoisSrc = await gatilho.getAttribute('data-src');
  await gatilho.scrollIntoViewIfNeeded();
  await gatilho.click();
  await page.locator('#lightbox-contador').waitFor({ timeout: 5000 }).catch(() => {});

  const atual = '.lightbox-slide[aria-hidden="false"]';
  const estado = async () => ({
    contador: ((await page.locator('#lightbox-contador').textContent().catch(() => '')) ?? '').replace(/\s/g, ''),
    rotulo: (await page.locator(`${atual} .lightbox-category`).textContent())?.trim(),
    src: await page.locator(`${atual} img`).getAttribute('src')
  });
  // Espera a prévia ser trocada pela ampliada antes de comparar.
  const esperarSrc = (src) =>
    page
      .waitForFunction(
        ([seletor, s]) => document.querySelector(`${seletor} img`)?.getAttribute('src') === s,
        [atual, src],
        { timeout: 10000 }
      )
      .catch(() => {});

  await esperarSrc(depoisSrc);
  const primeiro = await estado();
  checar('celular: abre no depois, com 2 fotos na fileira',
         primeiro.contador === '1/2' && primeiro.rotulo === 'Depois' && primeiro.src === depoisSrc,
         JSON.stringify(primeiro));

  const dica = await page.evaluate((seletor) => {
    const botao = document.querySelector(`${seletor} .lightbox-dica`);
    const seta = botao?.querySelector('svg')?.getBoundingClientRect();
    const rotulo = document.querySelector(`${seletor} .lightbox-category`)?.getBoundingClientRect();
    if (!botao || !seta || seta.width === 0) return null;
    // O texto sem o svg: a posição da seta se mede contra o fim da frase.
    const faixa = document.createRange();
    faixa.selectNodeContents(botao);
    faixa.setEndBefore(botao.querySelector('svg'));
    const texto = faixa.getBoundingClientRect();
    const caixa = botao.getBoundingClientRect();
    return {
      texto: botao.textContent.trim(),
      setaADireita: seta.left >= texto.right,
      mesmaLinha: Math.abs(seta.top + seta.height / 2 - (texto.top + texto.height / 2)) < 6,
      alvo: Math.round(caixa.height),
      depoisVisivel: Boolean(rotulo && rotulo.width > 1 && rotulo.height > 1)
    };
  }, atual);
  checar('celular: "Deslize para ver o antes" com a seta à direita e alvo de toque de 44px',
         dica?.texto === 'Deslize para ver o antes' && dica.setaADireita && dica.mesmaLinha && dica.alvo >= 44,
         JSON.stringify(dica));
  checar('celular: rótulo "Depois" só para leitor de tela quando há dica', dica && !dica.depoisVisivel,
         JSON.stringify(dica));

  // Pela seta, e não pelo teclado: prova também que ela leva ao antes.
  await page.locator(`${atual} .lightbox-dica`).click();
  await esperarSrc(antesSrc);
  const segundo = await estado();
  const setaNoAntes = await page.locator(`${atual} .lightbox-dica`).count();
  checar('celular: sem seta no antes, que é a última foto', setaNoAntes === 0, `${setaNoAntes}`);
  checar('celular: a foto seguinte é o antes da mesma tatuagem',
         segundo.contador === '2/2' && segundo.rotulo === 'Antes' && segundo.src === antesSrc,
         JSON.stringify(segundo));

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(800);
  const terceiro = await estado();
  checar('celular: a fileira termina no antes', terceiro.contador === '2/2', JSON.stringify(terceiro));

  await page.screenshot({ path: '.playwright/coberturas-celular-antes.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '.playwright/coberturas-celular.png' });
  await page.close();
}

const browser = await chromium.launch();

try {
  for (const nicho of NICHOS) {
    console.log(`\n/tatuagem/${nicho.slug}`);

    // Desktop: é a única largura em que o masonry tem 3 colunas, ou seja, a
    // única em que dá para provar que ele é masonry e não uma pilha.
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    const errosConsole = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errosConsole.push(msg.text());
    });
    page.on('pageerror', (err) => errosConsole.push(`pageerror: ${err.message}`));

    const resposta = await page.goto(`${BASE_URL}/tatuagem/${nicho.slug}`, { waitUntil: 'networkidle' });
    checar('página responde 200', resposta?.status() === 200, `status=${resposta?.status()}`);

    /*
      Força o carregamento das fotos antes de medir qualquer coisa da galeria.

      As fotos são `loading="lazy"`: as de baixo da dobra têm `naturalWidth`
      zero até entrarem na tela, e a checagem de proporção dividia por zero.
      Passou com 6 fotos, reprovou com 26, e a página estava certa nas duas.
    */
    await page.locator('[data-galeria] img').evaluateAll((imgs) => {
      for (const img of imgs) img.loading = 'eager';
    });
    const todasCarregaram = await page
      .waitForFunction(
        () =>
          [...document.querySelectorAll('[data-galeria] img')].every(
            (img) => img.complete && img.naturalWidth > 0
          ),
        null,
        { timeout: 30000 }
      )
      .then(() => true)
      .catch(() => false);
    checar('todas as fotos da galeria carregam', todasCarregaram);

    // --- identidade da página ---
    // `main h1` e não `h1`: o Playwright atravessa shadow DOM, e a barra de
    // ferramentas do dev server tem títulos próprios.
    const h1s = await page.locator('main h1').allTextContents();
    checar('tem exatamente um H1', h1s.length === 1, `${h1s.length} encontrado(s)`);
    checar('H1 é o do nicho', h1s[0]?.trim() === nicho.h1, `"${h1s[0]?.trim()}"`);

    const titulo = await page.title();
    checar('title tem no máximo 60 caracteres', titulo.length <= 60, `${titulo.length}: "${titulo}"`);

    const descricao = await page.locator('meta[name="description"]').getAttribute('content');
    checar('description entre 100 e 160 caracteres',
           descricao && descricao.length >= 100 && descricao.length <= 160,
           `${descricao?.length} caracteres`);

    // Barra final normalizada: o build serve com, o dev sem. O que importa é a
    // checagem seguinte — canonical e sitemap precisam ser a MESMA string, ou o
    // Google trata as duas grafias como duas páginas.
    const semBarra = (url) => (url ?? '').replace(/\/$/, '');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    checar('canonical aponta para a própria URL',
           semBarra(canonical) === `https://claranasc.com/tatuagem/${nicho.slug}`,
           canonical);

    if (urlsDoSitemap) {
      checar('canonical e sitemap usam a MESMA string',
             urlsDoSitemap.has(canonical ?? ''),
             canonical);
    }

    // 120 caracteres é o que cabe em duas linhas a 390px de largura.
    const chamada = (await page.locator('.nicho-chamada').innerText()).trim();
    checar('chamada existe e cabe em duas linhas',
           chamada.length > 0 && chamada.length <= 120,
           `${chamada.length} caracteres`);

    if (nicho.antesDepois) {
      await checarAntesDepois(page);
    } else {
      // --- galeria em masonry ---
      const totalFotos = await page.locator('.portfolio-item--livre').count();
      checar('galeria tem fotos', totalFotos > 0, `${totalFotos} fotos`);

      const colunas = await page
        .locator('.portfolio-grid--masonry')
        .evaluate((el) => getComputedStyle(el).columnCount);
      checar('masonry em 3 colunas no desktop', colunas === '3', `column-count=${colunas}`);

      const fotos = await page.locator('.portfolio-item--livre img').evaluateAll((imgs) =>
        imgs.map((img) => {
          const r = img.getBoundingClientRect();
          return {
            proporcaoNaTela: r.width / r.height,
            proporcaoDoArquivo: img.naturalWidth / img.naturalHeight,
            altura: Math.round(r.height)
          };
        })
      );

      // Se o `object-fit: cover` e o `aspect-ratio: 4/5` da home vazarem para cá,
      // toda foto renderiza em 0,8 e o desenho é cortado.
      const respeitamProporcao = fotos.every(
        (f) => Math.abs(f.proporcaoNaTela - f.proporcaoDoArquivo) < 0.02
      );
      const proporcoesDistintas = new Set(fotos.map((f) => f.proporcaoNaTela.toFixed(2))).size;
      checar('fotos mantêm a proporção original', respeitamProporcao,
             `${proporcoesDistintas} proporções diferentes na página`);

      // É masonry se a altura varia pelo menos tanto quanto a proporção varia.
      // `>=` e não `===`: proporções diferentes podem arredondar igual em duas
      // casas decimais e ainda render alturas de pixel diferentes.
      const alturasDistintas = new Set(fotos.map((f) => f.altura)).size;
      checar('altura de cada item sai da própria foto',
             alturasDistintas >= proporcoesDistintas,
             `${alturasDistintas} alturas para ${proporcoesDistintas} proporções`);
    }

    // Sem legenda visível, o `alt` é o único texto que descreve
    // cada foto — para leitor de tela e para o Google Imagens.
    const alts = await page
      .locator('[data-galeria] img')
      .evaluateAll((imgs) => imgs.map((i) => i.getAttribute('alt') ?? ''));
    const semAlt = alts.filter((a) => a.trim().length < 15);
    checar('toda foto tem alt descritivo', semAlt.length === 0,
           semAlt.length ? `${semAlt.length} sem alt útil` : `${alts.length} fotos`);

    // --- perguntas frequentes ---
    const perguntasNaTela = (await page.locator('.faq-item summary').allTextContents())
      .map((t) => t.trim());
    checar('tem 3 ou mais perguntas', perguntasNaTela.length >= 3, `${perguntasNaTela.length}`);

    const abertasNoInicio = await page.locator('.faq-item[open]').count();
    checar('perguntas começam fechadas', abertasNoInicio === 0, `${abertasNoInicio} abertas`);

    // Texto sem ponto final é o defeito mais fácil de deixar passar ao editar:
    // não quebra nada, não aparece no build, e fica visível no site.
    const semPontoFinal = [chamada, ...(await page.locator('.faq-resposta').allTextContents())]
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !/[.!?]$/.test(t));
    checar('todo texto termina com pontuação', semPontoFinal.length === 0,
           semPontoFinal.map((t) => `…${t.slice(-40)}`).join(' | ') || 'ok');

    // ⚠️ A checagem mais importante do arquivo: `FAQPage` exige que pergunta e
    // resposta estejam VISÍVEIS. Texto só no schema é conteúdo oculto, que é
    // infração de política. Prova as duas metades — que abre, e que é o mesmo.
    await page.locator('.faq-item summary').first().click();
    await page.waitForTimeout(300);
    const respostaVisivel = await page.locator('.faq-item[open] .faq-resposta').isVisible();
    checar('resposta abre ao clicar na pergunta', respostaVisivel);

    const faqJson = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nos) =>
        nos
          .map((n) => {
            try {
              return JSON.parse(n.textContent ?? '');
            } catch {
              return null;
            }
          })
          .find((obj) => obj && obj['@type'] === 'FAQPage')
      );
    checar('FAQPage presente e é JSON válido', Boolean(faqJson));

    if (faqJson) {
      const perguntasSchema = faqJson.mainEntity.map((q) => q.name);
      checar('toda pergunta do schema está na tela',
             JSON.stringify(perguntasSchema) === JSON.stringify(perguntasNaTela),
             `schema=${perguntasSchema.length} tela=${perguntasNaTela.length}`);

      // Abre todas antes de ler: `innerText` só devolve o que é renderizado, e
      // `<details>` fechado não é — as outras respostas sairiam como ausentes.
      await page.locator('.faq-item').evaluateAll((nos) => {
        for (const no of nos) no.open = true;
      });
      await page.waitForTimeout(200);

      const textoDaPagina = await page.locator('main').innerText();
      const respostasAusentes = faqJson.mainEntity
        .map((q) => q.acceptedAnswer.text)
        .filter((texto) => !textoDaPagina.includes(texto));
      checar('toda resposta do schema está visível na página',
             respostasAusentes.length === 0,
             respostasAusentes.length ? `${respostasAusentes.length} ausente(s)` : 'todas');
    }

    // Fecha tudo, para não interferir nas medições seguintes.
    await page.locator('.faq-item').evaluateAll((nos) => {
      for (const no of nos) no.open = false;
    });
    await page.waitForTimeout(200);

    // --- trilha e o schema dela ---
    const passosVisiveis = await page.locator('.trilha li').allTextContents();
    const breadcrumbJson = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nos) =>
        nos
          .map((n) => {
            try {
              return JSON.parse(n.textContent ?? '');
            } catch {
              return null;
            }
          })
          .find((obj) => obj && obj['@type'] === 'BreadcrumbList')
      );
    checar('BreadcrumbList presente e é JSON válido', Boolean(breadcrumbJson));

    if (breadcrumbJson) {
      const nomesSchema = breadcrumbJson.itemListElement.map((i) => i.name);
      const nomesTela = passosVisiveis.map((t) => t.trim());
      checar('schema espelha a trilha da tela',
             JSON.stringify(nomesSchema) === JSON.stringify(nomesTela),
             `schema=${nomesSchema.join('>')} tela=${nomesTela.join('>')}`);

      const posicoesOk = breadcrumbJson.itemListElement.every((i, n) => i.position === n + 1);
      checar('positions começam em 1 e são sequenciais', posicoesOk);
    }

    // --- links internos não podem cair em 404 ---
    const internos = await page
      .locator('a[href^="/"]')
      .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    const quebrados = [];
    for (const href of internos) {
      // Só o caminho: o fragmento (#contato) não vai para o servidor.
      const caminho = href.split('#')[0] || '/';
      const res = await fetch(new URL(caminho, BASE_URL), { method: 'GET' });
      if (!res.ok) quebrados.push(`${href} -> ${res.status}`);
    }
    checar('links internos respondem', quebrados.length === 0,
           quebrados.join(', ') || `${internos.length} links conferidos`);

    // No topo o botão é `position: fixed` sobre o texto que a visitante acabou
    // de abrir para ler. Já aconteceu — ver `data-cta-apos` no FloatingCta.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const ctaNoTopo = await page.locator('#floating-cta').evaluate((el) =>
      el.classList.contains('is-visible')
    );
    checar('botão flutuante escondido no topo da página', !ctaNoTopo);

    // Ancorado na galeria, nunca num scroll em pixels: posição fixa muda de
    // significado quando o conteúdo acima cresce ou encolhe. E `scrollIntoView`
    // e não `scrollIntoViewIfNeeded` — o segundo não rola se já estiver na tela.
    await page.locator('[data-galeria]').evaluate((el) =>
      el.scrollIntoView({ block: 'start' })
    );
    await page.waitForTimeout(500);
    const ctaRolado = await page.locator('#floating-cta').evaluate((el) =>
      el.classList.contains('is-visible')
    );
    checar('botão flutuante aparece na galeria', ctaRolado);

    // --- lightbox ---
    await page.locator('.lightbox-trigger').first().click({ force: true });
    await page.waitForTimeout(300);
    const abriu = await page.locator('#lightbox-modal').isVisible().catch(() => false);
    checar('lightbox abre', abriu);
    if (abriu) await page.locator('#lightbox-close').click();

    checar('sem erros no console', errosConsole.length === 0, errosConsole.join(' | ') || 'nenhum');

    if (nicho.antesDepois) await page.screenshot({ path: '.playwright/coberturas-desktop.png' });
    await page.close();

    if (nicho.antesDepois) {
      await checarParComZoom(nicho.slug);
      await checarAntesDepoisNoCelular(nicho.slug);
    }
  }
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
