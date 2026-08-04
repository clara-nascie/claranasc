/**
 * Importa fotos do acervo para `src/assets/portfolio/`.
 *
 * Faz as três coisas que toda foto do site precisa e que erram quando são
 * feitas à mão: reduzir para 1600px no lado maior, converter para **WebP de
 * verdade** e gravar com o nome que descreve o desenho.
 *
 * > O `.webp` do projeto já foi JPEG renomeado uma vez. Aqui a conversão é
 * > real: o sharp reencoda, e o script confere o formato do arquivo gravado.
 *
 * Também imprime o trecho pronto de `portfolioData.ts` — o `import` e o item
 * do array —, porque digitar 145 desses à mão é onde entra erro de digitação.
 *
 * Uso:
 *   node scripts/importar-fotos.mjs <manifesto.json> [--forcar]
 *
 * O manifesto é transitório (fica fora do repositório) e tem esta forma:
 *
 *   {
 *     "pasta": "COBERTURAS",
 *     "categoria": "coberturas",
 *     "categoriaLabel": "Coberturas",
 *     "primeiroId": 31,
 *     "fotos": [
 *       {
 *         "origem": "20221210_212156.jpg",
 *         "arquivo": "cobertura-guitarra-trash-polka-braco",
 *         "titulo": "Guitarra em Trash Polka",
 *         "alt": "Cobertura de tatuagem em trash polka com guitarra ..."
 *       }
 *     ]
 *   }
 *
 * ## Como escrever o `alt`
 *
 *   <categoria> de tatuagem com <assunto> em <técnica> no <região>, sobre o
 *   <sub-região>
 *
 * **Cite a região geral E a específica.** Regra da Clara (04/08/2026): ela
 * diferencia bíceps de tríceps, mas quem busca digita "tatuagem braço" — e
 * descobre que quer no bíceps ao ver um exemplo. "no braço, sobre o bíceps"
 * atende as duas buscas; só "bíceps" perde a maior das duas.
 *
 * Onde não der para afirmar a sub-região olhando a foto, fique no termo geral.
 * `alt` errado é pior que `alt` genérico.
 *
 * Repetir "Cobertura de tatuagem com..." em todas é intencional, não descuido:
 * é o termo de busca, e o Google Imagens lê o `alt` de cada foto isoladamente.
 *
 * ## O que NÃO descartar
 *
 * Regra da Clara (04/08/2026), depois de eu ter cortado fotos demais:
 *
 * - **Ângulo diferente da mesma tatuagem entra.** Uma peça que dá a volta no
 *   braço não cabe em uma foto só, e cada ângulo mostra uma parte que a outra
 *   não mostra. Descartar como "repetida" apaga metade do trabalho.
 * - **Marca d'água do @tattookapala não é impedimento.** É o estúdio antigo, e
 *   ela considera irrelevante.
 *
 * O que sobra para descartar: arquivo ilegível e duplicata exata — que é o que
 * o `inventario-fotos.mjs` já detecta sozinho.
 *
 * Quando duas fotos são a mesma peça, o nome descreve o que aquela vista tem
 * de próprio (`-outro-lado`, `-completa`) em vez de virar `-2`. O nome do
 * arquivo é conteúdo, não identificador.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ACERVO = path.join(RAIZ, 'Anúncios');
const DESTINO = path.join(RAIZ, 'src', 'assets', 'portfolio');

/** Teto do lado maior. Cobre a maior variante que o site pede (lightbox, 1400px). */
const LADO_MAXIMO = 1600;
const QUALIDADE = 82;

const [manifestoPath, ...flags] = process.argv.slice(2);
if (!manifestoPath) {
  console.error('Uso: node scripts/importar-fotos.mjs <manifesto.json> [--forcar]');
  process.exit(1);
}
const forcar = flags.includes('--forcar');

const manifesto = JSON.parse(await readFile(manifestoPath, 'utf8'));
const { pasta, categoria, categoriaLabel, primeiroId, fotos } = manifesto;

/** Um `alt` curto demais não descreve nada — nem para o Google, nem para leitor de tela. */
const ALT_MINIMO = 30;

const problemas = [];
const vistos = new Set();
for (const foto of fotos) {
  if (!/^[a-z0-9-]+$/.test(foto.arquivo)) {
    problemas.push(`nome de arquivo inválido: "${foto.arquivo}" (só minúsculas, números e hífen)`);
  }
  if (vistos.has(foto.arquivo)) problemas.push(`nome de arquivo repetido: "${foto.arquivo}"`);
  vistos.add(foto.arquivo);
  if (!foto.alt || foto.alt.length < ALT_MINIMO) {
    problemas.push(`alt curto demais em "${foto.arquivo}": ${foto.alt?.length ?? 0} caracteres`);
  }
  if (!foto.titulo) problemas.push(`sem título: "${foto.arquivo}"`);
}
if (problemas.length) {
  console.error('Manifesto inválido:');
  for (const p of problemas) console.error('  -', p);
  process.exit(1);
}

const importados = [];

for (const [indice, foto] of fotos.entries()) {
  const origem = path.join(ACERVO, pasta, foto.origem);
  const destino = path.join(DESTINO, `${foto.arquivo}.webp`);

  if (!forcar) {
    try {
      await stat(destino);
      console.error(`Já existe: ${foto.arquivo}.webp — use --forcar para sobrescrever.`);
      process.exit(1);
    } catch {
      // não existe, segue
    }
  }

  // `failOn: 'none'` aceita JPEG truncado; `rotate()` aplica o EXIF antes de
  // redimensionar, senão foto tirada deitada sai girada no site.
  const entrada = sharp(await readFile(origem), { failOn: 'none' }).rotate();
  const meta = await entrada.metadata();

  const buffer = await entrada
    .resize(LADO_MAXIMO, LADO_MAXIMO, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toBuffer();

  await writeFile(destino, buffer);

  // Confere o que foi gravado, em vez de confiar no que foi pedido.
  const gravado = await sharp(destino).metadata();
  if (gravado.format !== 'webp') {
    console.error(`ERRO: ${foto.arquivo}.webp saiu como ${gravado.format}`);
    process.exit(1);
  }

  importados.push({ ...foto, id: primeiroId + indice, ...gravado });
  console.log(
    `  ${String(indice + 1).padStart(2)}. ${foto.arquivo}.webp  ` +
      `${meta.width}x${meta.height} -> ${gravado.width}x${gravado.height}  ` +
      `${Math.round(buffer.length / 1024)}KB`
  );
}

const camelo = (s) =>
  s.split('-').map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');

/** Aspas simples, como o resto do `portfolioData.ts`. */
const texto = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const linhasImport = importados.map(
  (f) => `import ${camelo(f.arquivo)} from '../assets/portfolio/${f.arquivo}.webp';`
);

const linhasItem = importados.map(
  (f) => `  {
    id: ${f.id},
    title: ${texto(f.titulo)},
    category: ${texto(categoria)},
    categoryLabel: ${texto(categoriaLabel)},
    image: ${camelo(f.arquivo)},
    alt: ${texto(f.alt)}
  },`
);

if (!flags.includes('--aplicar')) {
  console.log('\n--- imports para portfolioData.ts ---\n' + linhasImport.join('\n'));
  console.log('\n--- itens para o array ---\n' + linhasItem.join('\n'));
  console.log('\n(rode com --aplicar para escrever direto no portfolioData.ts)');
  process.exit(0);
}

/*
  Escreve direto no `portfolioData.ts`, logo abaixo de dois marcadores.
  Copiar e colar 145 blocos à mão é onde entra erro de digitação — e o erro
  típico (id repetido, import sem item) só aparece no build, longe da causa.
*/
const DADOS = path.join(RAIZ, 'src', 'data', 'portfolioData.ts');
const MARCA_IMPORT = '// IMPORTS-AUTOMATICOS';
const MARCA_ITEM = '// ITENS-AUTOMATICOS';

let fonte = await readFile(DADOS, 'utf8');
for (const marca of [MARCA_IMPORT, MARCA_ITEM]) {
  if (!fonte.includes(marca)) {
    console.error(`Marcador ausente em portfolioData.ts: ${marca}`);
    process.exit(1);
  }
}

/** Insere depois da última linha do bloco de comentário que segue o marcador. */
function inserirApos(src, marca, bloco) {
  const inicio = src.indexOf(marca);
  const linhas = src.slice(inicio).split('\n');
  let i = 0;
  while (i < linhas.length && linhas[i].trim().startsWith('//')) i++;
  const posicao = inicio + linhas.slice(0, i).join('\n').length;
  return src.slice(0, posicao) + '\n' + bloco + src.slice(posicao);
}

// Item primeiro: inserir os imports antes deslocaria o índice do outro marcador.
fonte = inserirApos(fonte, MARCA_ITEM, linhasItem.join('\n'));
fonte = inserirApos(fonte, MARCA_IMPORT, linhasImport.join('\n'));

// Guarda contra id repetido — o defeito que só apareceria no lightbox.
const ids = [...fonte.matchAll(/^    id: (\d+),$/gm)].map((m) => Number(m[1]));
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
if (repetidos.length) {
  console.error(`ERRO: ids repetidos em portfolioData.ts: ${[...new Set(repetidos)].join(', ')}`);
  console.error('Nada foi escrito. Ajuste `primeiroId` no manifesto.');
  process.exit(1);
}

await writeFile(DADOS, fonte);
console.log(`\n${importados.length} itens escritos em src/data/portfolioData.ts (ids ${importados[0].id}–${importados.at(-1).id}).`);
