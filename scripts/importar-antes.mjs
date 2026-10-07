/**
 * Importa as fotos do ANTES das coberturas para `src/assets/coberturas-antes/`.
 *
 * Uso:
 *   node scripts/importar-antes.mjs <manifesto.json> [--forcar]
 *
 * Manifesto (transitório, fora do repositório):
 *
 *   {
 *     "pasta": "coberturas-antes",
 *     "fotos": [
 *       { "origem": "antes-samurai-braço.png", "arquivo": "cobertura-samurai-braco-antes" }
 *     ]
 *   }
 *
 * O par com a foto do depois e o `alt` são escritos à mão em
 * `src/data/coberturasData.ts`.
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { converterParaWebp } from './converter-foto.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DESTINO = path.join(RAIZ, 'src', 'assets', 'coberturas-antes');

const [manifestoPath, ...flags] = process.argv.slice(2);
if (!manifestoPath) {
  console.error('Uso: node scripts/importar-antes.mjs <manifesto.json> [--forcar]');
  process.exit(1);
}
const forcar = flags.includes('--forcar');
const { pasta, fotos } = JSON.parse(await readFile(manifestoPath, 'utf8'));

for (const foto of fotos) {
  if (!/^[a-z0-9-]+-antes$/.test(foto.arquivo)) {
    console.error(`Nome inválido: "${foto.arquivo}" (minúsculas, números, hífen, terminando em -antes)`);
    process.exit(1);
  }
}

for (const [indice, foto] of fotos.entries()) {
  const destino = path.join(DESTINO, `${foto.arquivo}.webp`);
  if (!forcar && (await stat(destino).catch(() => null))) {
    console.error(`Já existe: ${foto.arquivo}.webp — use --forcar para sobrescrever.`);
    process.exit(1);
  }
  const { original, gravado, bytes } = await converterParaWebp(path.join(RAIZ, pasta, foto.origem), destino);
  console.log(
    `  ${String(indice + 1).padStart(2)}. ${foto.arquivo}.webp  ` +
      `${original.width}x${original.height} -> ${gravado.width}x${gravado.height}  ` +
      `${Math.round(bytes / 1024)}KB`
  );
}
