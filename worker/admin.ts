/// <reference types="@cloudflare/workers-types" />

/**
 * Recebe uma foto do painel `/admin` e grava foto + item do portfólio num
 * único commit. Ver `docs/arquitetura/painel-admin.md`.
 */

import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  BYTES_MAXIMOS,
  LADO_MAXIMO,
  categoriasDoFonte,
  dimensoesDoWebp,
  inserirNoPortfolio,
  limparTexto,
  problemasDaFoto,
  proximoIdDoFonte,
  type FotoNova
} from '../src/lib/itemDoPortfolio';

export interface EnvAdmin {
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_SEM_LOGIN?: string;
}

const DADOS = 'src/data/portfolioData.ts';
const PASTA = 'src/assets/portfolio';

const json = (dados: unknown, status = 200) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });

let chavesDoAccess: ReturnType<typeof createRemoteJWKSet> | null = null;

/* ⚠️ Conferir só se o cabeçalho existe não basta: qualquer um consegue mandar
   um cabeçalho inventado. A assinatura é que prova que o login passou pelo
   Access. */
async function autorizado(request: Request, env: EnvAdmin): Promise<boolean> {
  const { hostname } = new URL(request.url);
  if (env.ADMIN_SEM_LOGIN === '1' && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return true;
  }
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) return false;

  chavesDoAccess ??= createRemoteJWKSet(new URL('/cdn-cgi/access/certs', env.ACCESS_TEAM_DOMAIN));
  try {
    await jwtVerify(token, chavesDoAccess, {
      issuer: env.ACCESS_TEAM_DOMAIN,
      audience: env.ACCESS_AUD
    });
    return true;
  } catch {
    return false;
  }
}

class ErroGithub extends Error {
  constructor(
    readonly status: number,
    mensagem: string
  ) {
    super(mensagem);
  }
}

function clienteGithub(env: EnvAdmin) {
  return async (caminho: string, init: { method?: string; body?: unknown; accept?: string } = {}) => {
    const resposta = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${caminho}`, {
      method: init.method ?? 'GET',
      headers: {
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
        accept: init.accept ?? 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        // A API do GitHub recusa com 403 qualquer pedido sem User-Agent, e o
        // `fetch` do Worker não manda um sozinho.
        'user-agent': 'claranasc-painel-admin',
        ...(init.body ? { 'content-type': 'application/json' } : {})
      },
      body: init.body ? JSON.stringify(init.body) : undefined
    });
    // Sem isto, token vencido aparece como "não encontrei o ramo", que manda
    // procurar o defeito no lugar errado.
    if (resposta.status === 401) {
      throw new ErroGithub(502, 'O token do GitHub venceu ou foi revogado. Gere outro.');
    }
    return resposta;
  };
}

const emBase64 = (bytes: Uint8Array) => {
  let binario = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binario);
};

async function lerCampos(request: Request) {
  const formulario = await request.formData();
  const foto = formulario.get('foto');
  const campo = (nome: string) => limparTexto(String(formulario.get(nome) ?? ''));
  return {
    foto: foto instanceof File ? foto : null,
    arquivo: campo('arquivo'),
    titulo: campo('titulo'),
    categoria: campo('categoria'),
    alt: campo('alt')
  };
}

export async function receberFotoDoPortfolio(request: Request, env: EnvAdmin): Promise<Response> {
  if (!(await autorizado(request, env))) return json({ erro: 'Acesso negado.' }, 403);

  let campos: Awaited<ReturnType<typeof lerCampos>>;
  try {
    campos = await lerCampos(request);
  } catch {
    return json({ erro: 'Não consegui ler o envio.' }, 400);
  }
  if (!campos.foto) return json({ erro: 'A foto não veio no envio.' }, 400);
  if (campos.foto.size > BYTES_MAXIMOS) return json({ erro: 'A foto passa de 4MB.' }, 413);

  const bytes = new Uint8Array(await campos.foto.arrayBuffer());
  const dimensoes = dimensoesDoWebp(bytes);
  if (!dimensoes) return json({ erro: 'O arquivo não é WebP.' }, 415);
  if (Math.max(dimensoes.largura, dimensoes.altura) > LADO_MAXIMO) {
    return json({ erro: `A foto passa de ${LADO_MAXIMO}px.` }, 400);
  }

  const github = clienteGithub(env);
  const ramo = env.GITHUB_BRANCH;

  try {
    // Sobe a foto uma vez só: ela não muda entre as tentativas.
    const blobFoto = await github('/git/blobs', {
      method: 'POST',
      body: { content: emBase64(bytes), encoding: 'base64' }
    });
    if (!blobFoto.ok) throw new ErroGithub(blobFoto.status, 'Não consegui enviar a foto ao GitHub.');
    const { sha: shaFoto } = (await blobFoto.json()) as { sha: string };

    /* Se outro commit entrar entre a leitura do `portfolioData.ts` e a
       gravação, o GitHub recusa a atualização do ramo, e tudo é refeito
       em cima do commit novo. Sem isso, a edição que entrou no meio seria
       apagada. */
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      const resultado = await tentarCommit(github, ramo, campos, shaFoto);
      if (resultado) return json(resultado);
    }
    return json({ erro: 'O repositório mudou várias vezes seguidas. Tente de novo.' }, 409);
  } catch (e) {
    if (e instanceof ErroGithub) {
      return json({ erro: e.message }, e.status === 400 || e.status === 409 ? e.status : 502);
    }
    throw e;
  }
}

async function tentarCommit(
  github: ReturnType<typeof clienteGithub>,
  ramo: string,
  campos: Awaited<ReturnType<typeof lerCampos>>,
  shaFoto: string
) {
  const ref = await github(`/git/ref/heads/${ramo}`);
  if (!ref.ok) throw new ErroGithub(ref.status, `Não encontrei o ramo "${ramo}" no GitHub.`);
  const shaBase = ((await ref.json()) as { object: { sha: string } }).object.sha;

  const [dados, existente] = await Promise.all([
    github(`/contents/${DADOS}?ref=${shaBase}`, { accept: 'application/vnd.github.raw+json' }),
    github(`/contents/${PASTA}/${campos.arquivo}.webp?ref=${shaBase}`)
  ]);
  if (!dados.ok) throw new ErroGithub(dados.status, 'Não consegui ler o portfolioData.ts.');
  const fonte = await dados.text();

  const categoria = categoriasDoFonte(fonte).find((c) => c.id === campos.categoria);
  if (!categoria) throw new ErroGithub(400, 'Categoria desconhecida.');

  const foto: FotoNova = {
    id: proximoIdDoFonte(fonte),
    arquivo: campos.arquivo,
    titulo: campos.titulo,
    categoria: categoria.id,
    categoriaLabel: categoria.label,
    alt: campos.alt
  };
  const problemas = problemasDaFoto(foto, existente.ok ? [foto.arquivo] : []);
  if (problemas.length) throw new ErroGithub(400, problemas.join(' '));

  const arvore = await github('/git/trees', {
    method: 'POST',
    body: {
      base_tree: shaBase,
      tree: [
        { path: `${PASTA}/${foto.arquivo}.webp`, mode: '100644', type: 'blob', sha: shaFoto },
        { path: DADOS, mode: '100644', type: 'blob', content: inserirNoPortfolio(fonte, foto) }
      ]
    }
  });
  if (!arvore.ok) throw new ErroGithub(arvore.status, 'Não consegui montar o commit.');
  const { sha: shaArvore } = (await arvore.json()) as { sha: string };

  const commit = await github('/git/commits', {
    method: 'POST',
    body: {
      message: `feat(portfolio): add ${foto.arquivo}\n\nSent from the /admin panel.`,
      tree: shaArvore,
      parents: [shaBase]
    }
  });
  if (!commit.ok) throw new ErroGithub(commit.status, 'Não consegui criar o commit.');
  const { sha: shaCommit, html_url } = (await commit.json()) as { sha: string; html_url: string };

  const atualizacao = await github(`/git/refs/heads/${ramo}`, {
    method: 'PATCH',
    body: { sha: shaCommit, force: false }
  });
  // 422: o ramo andou desde a leitura. Quem chamou tenta de novo.
  if (atualizacao.status === 422) return null;
  if (!atualizacao.ok) throw new ErroGithub(atualizacao.status, 'Não consegui publicar o commit.');

  return { id: foto.id, arquivo: foto.arquivo, commit: html_url };
}
