/**
 * Regras de uma foto nova do portfólio, compartilhadas entre o painel `/admin`
 * (que mostra a prévia) e o Worker (que grava). Se cada lado tivesse a sua
 * cópia, a prévia um dia mostraria uma coisa e o commit gravaria outra.
 */

/** Os mesmos números do `scripts/importar-fotos.mjs`. */
export const LADO_MAXIMO = 1600;
export const QUALIDADE_WEBP = 0.82;

export const ALT_MINIMO = 30;
export const NOME_VALIDO = /^[a-z0-9-]+$/;
export const BYTES_MAXIMOS = 4 * 1024 * 1024;

/** ⚠️ Uma quebra de linha no `alt` quebraria a string no `portfolioData.ts`
 *  e, com ela, o build inteiro do site. */
export const limparTexto = (texto: string) => texto.replace(/\s+/g, ' ').trim();

/** Os arquivos de coberturas começam com `cobertura-`, no singular. */
const PREFIXO_DO_ARQUIVO: Record<string, string> = {
  coberturas: 'cobertura'
};

export const prefixoDoArquivo = (categoria: string) => PREFIXO_DO_ARQUIVO[categoria] ?? categoria;

/** "Ramo de Café" vira "ramo-de-cafe". */
export const paraSlug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const sugerirNome = (categoria: string, titulo: string, parteDoCorpo: string) =>
  [prefixoDoArquivo(categoria), paraSlug(titulo), paraSlug(parteDoCorpo)].filter(Boolean).join('-');

export interface FotoNova {
  id: number;
  arquivo: string;
  titulo: string;
  categoria: string;
  categoriaLabel: string;
  alt: string;
}

export function problemasDaFoto(foto: Omit<FotoNova, 'id'>, existentes: string[]): string[] {
  const problemas: string[] = [];
  if (!foto.titulo.trim()) problemas.push('Falta o título.');
  if (!NOME_VALIDO.test(foto.arquivo)) {
    problemas.push('O nome do arquivo só aceita minúsculas, números e hífen.');
  }
  if (existentes.includes(foto.arquivo)) problemas.push('Já existe uma foto com esse nome de arquivo.');
  if (foto.alt.trim().length < ALT_MINIMO) {
    problemas.push(`A descrição (alt) precisa de pelo menos ${ALT_MINIMO} caracteres.`);
  }
  return problemas;
}

const camelo = (s: string) =>
  s
    .split('-')
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join('');

/** Aspas simples, como o resto do `portfolioData.ts`. */
const texto = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const linhaDeImport = (foto: FotoNova) =>
  `import ${camelo(foto.arquivo)} from '../assets/portfolio/${foto.arquivo}.webp';`;

/** Lê do próprio arquivo, e não de uma cópia: categoria criada à mão no
 *  `portfolioData.ts` passa a valer no painel sem mexer em mais nada. */
export function categoriasDoFonte(fonte: string): { id: string; label: string }[] {
  const inicio = fonte.indexOf('PORTFOLIO_CATEGORIES');
  const bloco = fonte.slice(inicio, fonte.indexOf('];', inicio));
  return [...bloco.matchAll(/id: '([^']+)', label: '([^']+)'/g)]
    .map(([, id, label]) => ({ id, label }))
    .filter((c) => c.id !== 'all');
}

export function proximoIdDoFonte(fonte: string): number {
  const ids = [...fonte.matchAll(/^\s*id: (\d+),\s*$/gm)].map((m) => Number(m[1]));
  return Math.max(0, ...ids) + 1;
}

export const MARCA_IMPORT = '// IMPORTS-AUTOMATICOS';
export const MARCA_ITEM = '// ITENS-AUTOMATICOS';

/** Insere depois da última linha do bloco de comentário que segue o marcador. */
function inserirApos(fonte: string, marca: string, bloco: string) {
  const inicio = fonte.indexOf(marca);
  const linhas = fonte.slice(inicio).split('\n');
  let i = 0;
  while (i < linhas.length && linhas[i].trim().startsWith('//')) i++;
  const posicao = inicio + linhas.slice(0, i).join('\n').length;
  return fonte.slice(0, posicao) + '\n' + bloco + fonte.slice(posicao);
}

export function inserirNoPortfolio(fonte: string, foto: FotoNova): string {
  for (const marca of [MARCA_IMPORT, MARCA_ITEM]) {
    if (!fonte.includes(marca)) throw new Error(`Marcador ausente em portfolioData.ts: ${marca}`);
  }
  // Item primeiro: inserir o import antes deslocaria a posição do outro marcador.
  const comItem = inserirApos(fonte, MARCA_ITEM, blocoDoItem(foto));
  return inserirApos(comItem, MARCA_IMPORT, linhaDeImport(foto));
}

const ascii = (b: Uint8Array, de: number, ate: number) => String.fromCharCode(...b.slice(de, ate));

/** Largura e altura lidas do cabeçalho do WebP; `null` se não for WebP. */
export function dimensoesDoWebp(b: Uint8Array): { largura: number; altura: number } | null {
  if (b.length < 30 || ascii(b, 0, 4) !== 'RIFF' || ascii(b, 8, 12) !== 'WEBP') return null;
  switch (ascii(b, 12, 16)) {
    case 'VP8 ':
      return { largura: (b[26] | (b[27] << 8)) & 0x3fff, altura: (b[28] | (b[29] << 8)) & 0x3fff };
    case 'VP8L':
      return {
        largura: 1 + (b[21] | ((b[22] & 0x3f) << 8)),
        altura: 1 + ((b[22] >> 6) | (b[23] << 2) | ((b[24] & 0x0f) << 10))
      };
    case 'VP8X':
      return {
        largura: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        altura: 1 + (b[27] | (b[28] << 8) | (b[29] << 16))
      };
    default:
      return null;
  }
}

export const blocoDoItem = (foto: FotoNova) => `  {
    id: ${foto.id},
    title: ${texto(foto.titulo)},
    category: ${texto(foto.categoria)},
    categoryLabel: ${texto(foto.categoriaLabel)},
    image: ${camelo(foto.arquivo)},
    alt: ${texto(foto.alt)}
  },`;
