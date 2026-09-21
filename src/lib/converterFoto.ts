import { LADO_MAXIMO, QUALIDADE_WEBP } from './itemDoPortfolio';

export interface FotoConvertida {
  blob: Blob;
  largura: number;
  altura: number;
}

/** Reduz para 1600px no lado maior e converte para WebP, no próprio aparelho. */
export async function converterFoto(arquivo: File): Promise<FotoConvertida> {
  let bitmap: ImageBitmap;
  try {
    // `from-image` aplica a rotação do EXIF: sem ela, foto tirada com o
    // celular em pé chega deitada.
    bitmap = await createImageBitmap(arquivo, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      `Este navegador não conseguiu abrir "${arquivo.name}". Se for HEIC, exporte como JPEG antes.`
    );
  }

  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const contexto = canvas.getContext('2d')!;
  contexto.imageSmoothingQuality = 'high';
  contexto.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    canvas.toBlob(resolver, 'image/webp', QUALIDADE_WEBP)
  );

  /* ⚠️ Navegador que não sabe gerar WebP (o Safari, por exemplo) devolve PNG
     em silêncio, sem erro. Sem esta conferência, um PNG de vários megabytes
     entraria no site com extensão .webp. */
  if (!blob || blob.type !== 'image/webp') {
    throw new Error('Este navegador não gera WebP. Use o Chrome.');
  }

  return { blob, largura, altura };
}
