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

export const blocoDoItem = (foto: FotoNova) => `  {
    id: ${foto.id},
    title: ${texto(foto.titulo)},
    category: ${texto(foto.categoria)},
    categoryLabel: ${texto(foto.categoriaLabel)},
    image: ${camelo(foto.arquivo)},
    alt: ${texto(foto.alt)}
  },`;
