import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

/** Teto do lado maior. Cobre a maior variante que o site pede (lightbox, 1400px). */
export const LADO_MAXIMO = 1600;
export const QUALIDADE = 82;

/** Reduz, converte para WebP e confere o que foi gravado. */
export async function converterParaWebp(origem, destino) {
  // `failOn: 'none'` aceita JPEG truncado; `rotate()` aplica o EXIF antes de
  // redimensionar, senão foto tirada deitada sai girada no site.
  const entrada = sharp(await readFile(origem), { failOn: 'none' }).rotate();
  const meta = await entrada.metadata();

  const buffer = await entrada
    .resize(LADO_MAXIMO, LADO_MAXIMO, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toBuffer();

  await writeFile(destino, buffer);

  const gravado = await sharp(destino).metadata();
  if (gravado.format !== 'webp') {
    throw new Error(`${destino} saiu como ${gravado.format}`);
  }
  return { original: meta, gravado, bytes: buffer.length };
}
