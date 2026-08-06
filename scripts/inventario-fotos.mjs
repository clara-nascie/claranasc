/**
 * Inventário do acervo de fotos.
 *
 * Responde três perguntas antes de importar qualquer foto nova:
 *
 *   1. quais arquivos de `Anúncios/` já estão no site (os nomes não batem —
 *      as fotos publicadas foram renomeadas para descrever o desenho);
 *   2. quais são duplicatas entre si dentro do acervo;
 *   3. quais o sharp não consegue abrir.
 *
 * O casamento é por **impressão digital de imagem**, não por nome nem por hash
 * de bytes: a foto publicada passou por redimensionamento e conversão para
 * WebP, então nenhum byte dela é igual ao do arquivo original.
 *
 * A impressão é uma miniatura 16x16 em tons de cinza. Duas fotos são a mesma
 * quando a diferença média por pixel fica abaixo de LIMITE_IGUAL — tolerância
 * que absorve recompressão sem juntar fotos parecidas da mesma sessão.
 *
 * Uso:  node scripts/inventario-fotos.mjs [--json]
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ACERVO = path.join(RAIZ, 'Anúncios');
const PUBLICADAS = path.join(RAIZ, 'src', 'assets', 'portfolio');

/** Pasta do acervo -> id da categoria em portfolioData. */
const CATEGORIA_DA_PASTA = {
  COBERTURAS: 'coberturas',
  FLORAL: 'botanico',
  'GEEK-ANIMES': 'geek',
  BLACKWORK: 'blackwork',
  FINELINE: 'fineline'
};

const LADO = 16;
const LIMITE_IGUAL = 6;

const EXTENSOES = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * `failOn: 'none'` aceita JPEG truncado em vez de recusar o arquivo — recupera
 * fotos que o padrão rejeitava. Arquivos com "bad seek" continuam ilegíveis.
 */
async function impressao(arquivo) {
  const dados = await sharp(await readFile(arquivo), { failOn: 'none' })
    .rotate() // respeita o EXIF: foto de celular deitada mudaria a impressão
    .resize(LADO, LADO, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer();
  return dados;
}

/** Diferença média por pixel entre duas impressões. 0 = idênticas. */
function distancia(a, b) {
  let soma = 0;
  for (let i = 0; i < a.length; i++) soma += Math.abs(a[i] - b[i]);
  return soma / a.length;
}

async function impressoesDe(pasta, arquivos) {
  const saida = [];
  const falhas = [];
  for (const nome of arquivos) {
    const caminho = path.join(pasta, nome);
    try {
      saida.push({ nome, caminho, digital: await impressao(caminho) });
    } catch (erro) {
      falhas.push({ nome, motivo: erro.message.split('\n')[0] });
    }
  }
  return { saida, falhas };
}

const eImagem = (nome) => EXTENSOES.has(path.extname(nome).toLowerCase());

// --- fotos que já estão no site -------------------------------------------
const nomesPublicados = (await readdir(PUBLICADAS)).filter(eImagem);
const { saida: publicadas } = await impressoesDe(PUBLICADAS, nomesPublicados);

// --- acervo ----------------------------------------------------------------
const relatorio = [];
const todasFalhas = [];

for (const [pasta, categoria] of Object.entries(CATEGORIA_DA_PASTA)) {
  const dir = path.join(ACERVO, pasta);
  const nomes = (await readdir(dir)).filter(eImagem).sort();
  const { saida: arquivos, falhas } = await impressoesDe(dir, nomes);
  todasFalhas.push(...falhas.map((f) => ({ ...f, pasta })));

  const jaVistas = [];
  for (const arquivo of arquivos) {
    const publicada = publicadas.find((p) => distancia(arquivo.digital, p.digital) < LIMITE_IGUAL);
    const duplicataDe = jaVistas.find((a) => distancia(arquivo.digital, a.digital) < LIMITE_IGUAL);

    arquivo.estado = publicada ? 'no site' : duplicataDe ? 'duplicata' : 'novo';
    arquivo.par = publicada?.nome ?? duplicataDe?.nome ?? null;
    jaVistas.push(arquivo);
  }

  relatorio.push({ pasta, categoria, arquivos });
}

// --- saída -----------------------------------------------------------------
if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      relatorio.map(({ pasta, categoria, arquivos }) => ({
        pasta,
        categoria,
        novas: arquivos.filter((a) => a.estado === 'novo').map((a) => a.nome),
        noSite: arquivos.filter((a) => a.estado === 'no site').map((a) => a.nome),
        duplicatas: arquivos
          .filter((a) => a.estado === 'duplicata')
          .map((a) => ({ nome: a.nome, igualA: a.par }))
      })),
      null,
      2
    )
  );
} else {
  console.log(`${'PASTA'.padEnd(14)} ${'NOVAS'.padStart(6)} ${'NO SITE'.padStart(8)} ${'DUPLIC.'.padStart(8)}  total`);
  let totalNovas = 0;
  for (const { pasta, arquivos } of relatorio) {
    const c = (e) => arquivos.filter((a) => a.estado === e).length;
    totalNovas += c('novo');
    console.log(
      `${pasta.padEnd(14)} ${String(c('novo')).padStart(6)} ${String(c('no site')).padStart(8)} ` +
        `${String(c('duplicata')).padStart(8)}  ${arquivos.length}`
    );
  }
  console.log(`${''.padEnd(14)} ${String(totalNovas).padStart(6)} a importar\n`);

  for (const { pasta, arquivos } of relatorio) {
    const dups = arquivos.filter((a) => a.estado === 'duplicata');
    if (dups.length) {
      console.log(`${pasta} — duplicatas:`);
      for (const d of dups) console.log(`  ${d.nome}  =  ${d.par}`);
    }
  }

  if (todasFalhas.length) {
    console.log('\nNão foi possível abrir:');
    for (const f of todasFalhas) console.log(`  ${f.pasta}/${f.nome} — ${f.motivo}`);
  }
}
