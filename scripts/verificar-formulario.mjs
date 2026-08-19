import { chromium } from 'playwright';
import { mkdtempSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/*
  O formulário de orçamento e o Worker que recebe as fotos de referência.

  ⚠️ Roda contra `npm run worker` (wrangler), não contra `npm run preview`.
  O `astro preview` serve só os arquivos estáticos: `/api/referencias` não
  existe lá, e o script passaria a testar o nada.
*/

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8787';

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
      // ainda subindo
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Servidor não respondeu em ${url}. Rode \`npm run worker\`.`);
}

async function aguardarFormularioHidratado(page) {
  await page.waitForFunction(
    () => {
      const ilha = [...document.querySelectorAll('astro-island')].find((n) =>
        (n.getAttribute('component-url') || '').includes('ContactForm')
      );
      return Boolean(ilha) && !ilha.hasAttribute('ssr');
    },
    null,
    { timeout: 10000 }
  );
}

/* Fotos de teste de verdade, tiradas do próprio build: o Worker decide pelos
   bytes, então um arquivo inventado não provaria nada. */
const pasta = mkdtempSync(join(tmpdir(), 'referencias-'));
const jpegReal = join(pasta, 'referencia-1.jpg');
copyFileSync('public/assets/og-clara-nasc.jpg', jpegReal);

const pngReal = join(pasta, 'referencia-2.png');
copyFileSync('public/favicon.png', pngReal);

// PDF com nome e `type` de imagem: é o disfarce que o `accept` não pega.
const disfarcado = join(pasta, 'nao-e-imagem.jpg');
writeFileSync(disfarcado, Buffer.from('%PDF-1.7\n%\xe2\xe3\xcf\xd3\ntexto qualquer', 'binary'));

/* ⚠️ O próprio script esgota a cota de envios no último teste. Sem esperar a
   janela abrir, rodá-lo duas vezes seguidas reprova tudo por 429 — falha de
   teste, não do site. */
async function aguardarLimiteLivre(tentativas = 9) {
  for (let i = 0; i < tentativas; i++) {
    const sonda = await fetch(`${BASE_URL}/api/referencias`, {
      method: 'POST',
      body: new FormData()
    });
    if (sonda.status !== 429) return;
    if (i === 0) console.log('  (esperando a trava de envios liberar…)');
    await new Promise((r) => setTimeout(r, 12000));
  }
  throw new Error('A trava de envios não liberou. O servidor está sendo usado por outra coisa?');
}

await aguardarServidor(BASE_URL);
await aguardarLimiteLivre();

const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errosConsole = [];
  page.on('console', (m) => m.type() === 'error' && errosConsole.push(m.text()));
  page.on('pageerror', (e) => errosConsole.push(`pageerror: ${e.message}`));

  /* Antes de tudo: o Worker não pode ter roubado o site. O `run_worker_first`
     manda só `/api/*` e `/r/*` para ele, e uma rota errada aí derrubaria
     todas as páginas de uma vez. */
  const home = await fetch(BASE_URL);
  const nicho = await fetch(`${BASE_URL}/tatuagem/blackwork/`);
  checar('o site estático continua sendo servido',
         home.ok && nicho.ok, `home=${home.status} nicho=${nicho.status}`);

  await page.goto(`${BASE_URL}/#contato`, { waitUntil: 'networkidle' });
  await aguardarFormularioHidratado(page);

  // --- o campo existe e mostra o que foi escolhido ---
  await page.setInputFiles('#input-referencias', [jpegReal, pngReal]);
  await page.waitForTimeout(400);
  const escolhidas = await page.locator('.referencia').count();
  checar('as fotos escolhidas aparecem na tela', escolhidas === 2, `${escolhidas} miniatura(s)`);

  const previaPintou = await page.locator('.referencia-previa').first().evaluate(
    (img) => img.complete && img.naturalWidth > 0
  );
  checar('a miniatura pinta de fato', previaPintou);

  await page.locator('.referencia-remover').first().click();
  await page.waitForTimeout(200);
  const depoisDeRemover = await page.locator('.referencia').count();
  checar('dá para remover uma foto da lista', depoisDeRemover === 1, `${depoisDeRemover} restante(s)`);

  await page.setInputFiles('#input-referencias', [jpegReal]);
  await page.waitForTimeout(300);

  // --- envio ---
  await page.evaluate(() => {
    window.__aberto = null;
    window.open = (url) => {
      window.__aberto = url;
      return null;
    };
  });

  await page.fill('#input-name', 'Maria Teste');
  await page.selectOption('#select-style', 'Fine Line');
  await page.fill('#input-placement', 'Antebraço');
  await page.fill('#input-size', '12cm por 6cm');
  await page.fill('#input-idea', 'Um ramo pequeno com folhas.');
  await page.click('#btn-submit-booking');

  await page.waitForFunction(() => window.__aberto !== null, null, { timeout: 20000 });
  const aberto = await page.evaluate(() => window.__aberto);
  const mensagem = decodeURIComponent(new URL(aberto).searchParams.get('text') ?? '');

  checar('o envio abre o WhatsApp', aberto.includes('wa.me'));
  const linkReferencias = mensagem.match(/\/r\/[0-9a-f-]{36}/)?.[0];
  checar('a mensagem carrega o link das referências', Boolean(linkReferencias),
         linkReferencias ?? mensagem.slice(-90));

  checar('os campos de texto continuam na mensagem',
         mensagem.includes('Maria Teste') && mensagem.includes('Fine Line') &&
         mensagem.includes('Antebraço') && mensagem.includes('12cm por 6cm'));

  if (linkReferencias) {
    const pagina = await fetch(`${BASE_URL}${linkReferencias}`);
    const html = await pagina.text();
    const quantas = (html.match(/<img /g) ?? []).length;
    checar('a página das referências mostra as fotos', pagina.ok && quantas === 2,
           `status=${pagina.status}, ${quantas} imagem(ns)`);

    /* O site inteiro existe para ranquear: referência de cliente não pode
       entrar no índice do Google. */
    checar('a página das referências não é indexável',
           (pagina.headers.get('x-robots-tag') ?? '').includes('noindex'),
           pagina.headers.get('x-robots-tag'));

    /* Escolher fotos de novo acrescenta, não substitui — então a ordem aqui é
       [png, jpg]. Conferir as duas evita depender dessa ordem. */
    const caminhos = [...html.matchAll(/src="(\/r\/[^"]+)"/g)].map((m) => m[1]);
    const baixadas = await Promise.all(
      caminhos.map(async (caminho) => {
        const r = await fetch(`${BASE_URL}${caminho}`);
        return {
          tipo: r.headers.get('content-type'),
          nosniff: r.headers.get('x-content-type-options'),
          bytes: Buffer.from(await r.arrayBuffer())
        };
      })
    );

    const tiposEsperados = ['image/png', 'image/jpeg'].sort();
    checar('as fotos voltam com o tipo certo e sem sniffing',
           JSON.stringify(baixadas.map((f) => f.tipo).sort()) === JSON.stringify(tiposEsperados) &&
           baixadas.every((f) => f.nosniff === 'nosniff'),
           baixadas.map((f) => `${f.tipo}/${f.nosniff}`).join(' '));

    /* O Worker força o tipo pelos bytes, mas não pode reescrever a foto: o
       que ela abre no celular tem que ser o arquivo que a pessoa mandou. */
    const originais = [readFileSync(pngReal), readFileSync(jpegReal)];
    const intactas = baixadas.every((f) => originais.some((o) => o.equals(f.bytes)));
    checar('as fotos voltam byte a byte iguais às enviadas', intactas,
           baixadas.map((f) => `${f.bytes.length}B`).join(' '));
  }

  checar('sem erros no console', errosConsole.length === 0, errosConsole.join(' | ') || 'nenhum');
  await page.close();

  // --- o Worker sozinho: o que o navegador não protege ---
  const enviar = (arquivos) => {
    const pacote = new FormData();
    for (const caminho of arquivos) {
      const nome = caminho.split(/[\\/]/).pop();
      pacote.append('referencias', new Blob([readFileSync(caminho)]), nome);
    }
    return fetch(`${BASE_URL}/api/referencias`, { method: 'POST', body: pacote });
  };

  /* ⚠️ O `accept` do campo e o `type` do arquivo vêm do cliente e não provam
     nada: quem recusa é a conferência dos bytes no Worker. */
  const comDisfarce = await enviar([disfarcado]);
  checar('recusa arquivo que só finge ser imagem', comDisfarce.status === 415,
         `status=${comDisfarce.status}`);

  const demais = await enviar(Array(6).fill(pngReal));
  checar('recusa mais fotos que o limite', demais.status === 400, `status=${demais.status}`);

  const porGet = await fetch(`${BASE_URL}/api/referencias`);
  checar('o endereço de upload só aceita POST', porGet.status === 405, `status=${porGet.status}`);

  const inventado = await fetch(`${BASE_URL}/r/nao-e-um-uuid`);
  const travessia = await fetch(`${BASE_URL}/r/../../etc/passwd`);
  checar('endereço de referência inventado não vira consulta ao bucket',
         inventado.status === 404 && travessia.status === 404,
         `${inventado.status} / ${travessia.status}`);

  /* O endereço é público: sem trava, uma máquina só encheria o bucket.
     São 5 por minuto — a sexta tem que ser recusada. */
  let recusadaPorLimite = 0;
  for (let i = 0; i < 7; i++) {
    const r = await enviar([pngReal]);
    if (r.status === 429) recusadaPorLimite++;
  }
  checar('trava de envios seguidos entra em ação', recusadaPorLimite > 0,
         `${recusadaPorLimite} recusa(s) por limite em 7 envios`);
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
