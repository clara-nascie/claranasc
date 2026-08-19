/// <reference types="@cloudflare/workers-types" />

/**
 * Recebe as fotos de referência do formulário de orçamento e devolve um
 * endereço único para elas. Ver `docs/arquitetura/referencias-do-orcamento.md`.
 */

import { LIMITE_REFERENCIAS } from '../src/data/referencias';

interface Env {
  ASSETS: Fetcher;
  REFERENCIAS: R2Bucket;
  LIMITE_UPLOAD: RateLimit;
}

const { arquivos: MAX_ARQUIVOS, bytesPorArquivo: MAX_BYTES_ARQUIVO, bytesTotal: MAX_BYTES_TOTAL } =
  LIMITE_REFERENCIAS;

const texto = (bytes: Uint8Array, de: number, ate: number) =>
  String.fromCharCode(...bytes.slice(de, ate));

/* ⚠️ O tipo declarado pelo navegador vem do cliente e não prova nada. Sem
   conferir os bytes, o endereço aceitaria qualquer arquivo com um `type`
   mentido e viraria hospedagem grátis no domínio dela. */
const ASSINATURAS: { tipo: string; extensao: string; casa: (b: Uint8Array) => boolean }[] = [
  {
    tipo: 'image/jpeg',
    extensao: 'jpg',
    casa: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
  },
  {
    tipo: 'image/png',
    extensao: 'png',
    casa: (b) => b[0] === 0x89 && texto(b, 1, 4) === 'PNG'
  },
  {
    tipo: 'image/webp',
    extensao: 'webp',
    casa: (b) => texto(b, 0, 4) === 'RIFF' && texto(b, 8, 12) === 'WEBP'
  },
  {
    // iPhone. O navegador costuma converter para JPEG ao escolher a foto, mas
    // nem sempre — e barrar aqui seria barrar quem tem iPhone.
    tipo: 'image/heic',
    extensao: 'heic',
    casa: (b) =>
      texto(b, 4, 8) === 'ftyp' &&
      ['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].includes(texto(b, 8, 12))
  }
];

const reconhecer = (bytes: Uint8Array) => ASSINATURAS.find((a) => a.casa(bytes)) ?? null;

const json = (dados: unknown, status = 200) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

async function receberReferencias(request: Request, env: Env): Promise<Response> {
  const remetente = request.headers.get('cf-connecting-ip') ?? 'desconhecido';
  const { success } = await env.LIMITE_UPLOAD.limit({ key: remetente });
  if (!success) {
    return json({ erro: 'Muitos envios seguidos. Espere um minuto e tente de novo.' }, 429);
  }

  // Corta antes de ler o corpo: não faz sentido baixar 200MB para recusar.
  const declarado = Number(request.headers.get('content-length') ?? 0);
  if (declarado > MAX_BYTES_TOTAL * 1.1) {
    return json({ erro: 'As fotos somam mais que o limite de 20MB.' }, 413);
  }

  let formulario: FormData;
  try {
    formulario = await request.formData();
  } catch {
    return json({ erro: 'Não consegui ler as fotos enviadas.' }, 400);
  }

  const enviados = formulario.getAll('referencias').filter((v): v is File => v instanceof File);
  if (enviados.length === 0) return json({ erro: 'Nenhuma foto veio no envio.' }, 400);
  if (enviados.length > MAX_ARQUIVOS) {
    return json({ erro: `No máximo ${MAX_ARQUIVOS} fotos por envio.` }, 400);
  }

  const pedido = crypto.randomUUID();
  const guardados: string[] = [];
  let somaBytes = 0;

  for (const [indice, arquivo] of enviados.entries()) {
    if (arquivo.size > MAX_BYTES_ARQUIVO) {
      return json({ erro: `"${arquivo.name}" passa de 8MB.` }, 413);
    }

    const bytes = new Uint8Array(await arquivo.arrayBuffer());
    somaBytes += bytes.byteLength;
    if (somaBytes > MAX_BYTES_TOTAL) {
      return json({ erro: 'As fotos somam mais que o limite de 20MB.' }, 413);
    }

    const formato = reconhecer(bytes);
    if (!formato) {
      return json({ erro: `"${arquivo.name}" não é uma imagem que eu reconheça.` }, 415);
    }

    const chave = `${pedido}/${indice}.${formato.extensao}`;
    await env.REFERENCIAS.put(chave, bytes, {
      httpMetadata: { contentType: formato.tipo },
      // O nome original só serve para ela reconhecer o arquivo; nunca volta
      // como caminho, para não abrir travessia de diretório.
      customMetadata: { nomeOriginal: arquivo.name.slice(0, 120) }
    });
    guardados.push(chave);
  }

  const origem = new URL(request.url).origin;
  return json({ url: `${origem}/r/${pedido}`, quantidade: guardados.length });
}

async function entregarFoto(env: Env, chave: string): Promise<Response> {
  const objeto = await env.REFERENCIAS.get(chave);
  if (!objeto) return new Response('Não encontrado', { status: 404 });

  return new Response(objeto.body, {
    headers: {
      'content-type': objeto.httpMetadata?.contentType ?? 'application/octet-stream',
      /* ⚠️ Conteúdo de terceiro servido do domínio dela: o `nosniff` impede o
         navegador de reinterpretar os bytes como HTML e executar script. */
      'x-content-type-options': 'nosniff',
      'content-disposition': 'inline',
      'cache-control': 'private, max-age=3600',
      'x-robots-tag': 'noindex, nofollow'
    }
  });
}

async function montarPagina(request: Request, env: Env, pedido: string): Promise<Response> {
  const lista = await env.REFERENCIAS.list({ prefix: `${pedido}/` });
  if (lista.objects.length === 0) {
    return new Response('Estas referências não existem mais.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' }
    });
  }

  const emOrdem = [...lista.objects].sort((a, b) => a.key.localeCompare(b.key));
  const enviadoEm = emOrdem[0].uploaded.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const fotos = emOrdem
    .map((objeto) => {
      const endereco = `/r/${objeto.key}`;
      const nome = escapar(objeto.customMetadata?.nomeOriginal ?? 'referência');
      /* HEIC não pinta em `<img>` na maioria dos navegadores. Um link de
         download é honesto; uma imagem quebrada não. */
      return objeto.httpMetadata?.contentType === 'image/heic'
        ? `<p class="heic"><a href="${endereco}" download>${nome} — baixar (HEIC)</a></p>`
        : `<img src="${endereco}" alt="${nome}" loading="lazy">`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Referências do orçamento</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 24px 16px 48px; background: #0a0a0a; color: #f4efe6;
         font: 16px/1.5 system-ui, sans-serif; }
  header { max-width: 720px; margin: 0 auto 24px; }
  h1 { font-size: 1.1rem; letter-spacing: 0.15em; text-transform: uppercase;
       font-weight: 600; margin: 0 0 4px; }
  p.quando { margin: 0; opacity: 0.55; font-size: 0.85rem; }
  main { max-width: 720px; margin: 0 auto; display: grid; gap: 16px; }
  img { width: 100%; height: auto; display: block; border-radius: 6px; }
  .heic a { color: #d9a06a; }
</style>
</head>
<body>
<header>
  <h1>Referências do orçamento</h1>
  <p class="quando">${emOrdem.length} foto(s) — enviadas em ${escapar(enviadoEm)}</p>
</header>
<main>
${fotos}
</main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      /* A página é privada e o site inteiro existe para ranquear: referência
         de cliente não pode entrar no índice do Google. */
      'x-robots-tag': 'noindex, nofollow',
      'cache-control': 'private, no-store'
    }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/referencias') {
      if (request.method !== 'POST') {
        return json({ erro: 'Método não permitido.' }, 405);
      }
      return receberReferencias(request, env);
    }

    if (url.pathname.startsWith('/r/')) {
      const partes = url.pathname.slice(3).split('/').filter(Boolean);
      // Só UUID: qualquer outra coisa no lugar do id não vira consulta ao R2.
      const pedido = partes[0];
      const eUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        pedido ?? ''
      );
      if (!eUuid) return new Response('Não encontrado', { status: 404 });

      if (partes.length === 1) return montarPagina(request, env, pedido);
      if (partes.length === 2 && /^\d+\.[a-z]+$/.test(partes[1])) {
        return entregarFoto(env, `${pedido}/${partes[1]}`);
      }
      return new Response('Não encontrado', { status: 404 });
    }

    /* Rede de segurança: o `run_worker_first` do wrangler.jsonc só manda
       `/api/*` e `/r/*` para cá, mas se essa rota mudar o site continua
       servido em vez de cair. */
    return env.ASSETS.fetch(request);
  }
};
