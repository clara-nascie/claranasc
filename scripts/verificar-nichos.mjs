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
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';

/** Os cinco slugs, com o que cada página tem de próprio. */
const NICHOS = [
  { slug: 'coberturas', h1: 'Cobertura de tatuagem em Belo Horizonte' },
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

      Duas tentativas anteriores erraram por simular o que a visitante faz em
      vez de pedir o que o teste precisa: rolar + esperar 1,2s quebrou com 46
      fotos, e rolar + esperar a condição estourou o tempo porque a altura da
      página cresce enquanto as imagens chegam, e o laço de rolagem termina
      antes de alcançar o fim.

      Trocar `loading` para `eager` manda o navegador buscar todas de uma vez,
      sem depender de posição de scroll. E a espera virou uma checagem própria:
      se alguma não carregar, isso é defeito da página e deve aparecer como
      falha nomeada, não como exceção do script.
    */
    await page.locator('.portfolio-item--livre img').evaluateAll((imgs) => {
      for (const img of imgs) img.loading = 'eager';
    });
    const todasCarregaram = await page
      .waitForFunction(
        () =>
          [...document.querySelectorAll('.portfolio-item--livre img')].every(
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

    // Sem legenda visível desde 04/08/2026, o `alt` é o único texto que descreve
    // cada foto — para leitor de tela e para o Google Imagens.
    const alts = await page
      .locator('.portfolio-item--livre img')
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
    await page.locator('.portfolio-grid--masonry').evaluate((el) =>
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

    await page.close();
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
