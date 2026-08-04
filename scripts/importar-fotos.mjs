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

console.log(`\n--- imports para portfolioData.ts ---\n`);
for (const f of importados) {
  console.log(`import ${camelo(f.arquivo)} from '../assets/portfolio/${f.arquivo}.webp';`);
}

console.log(`\n--- itens para o array ---\n`);
for (const f of importados) {
  console.log(`  {
    id: ${f.id},
    title: ${JSON.stringify(f.titulo)},
    category: ${JSON.stringify(categoria)},
    categoryLabel: ${JSON.stringify(categoriaLabel)},
    image: ${camelo(f.arquivo)},
    alt: ${JSON.stringify(f.alt)}
  },`);
}
