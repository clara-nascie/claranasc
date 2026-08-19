/**
 * Limites das fotos de referência do formulário de orçamento.
 *
 * Importado pelo formulário e pelo Worker de propósito: se cada lado tivesse
 * o seu número, um dia o navegador aceitaria o que o servidor recusa, e a
 * pessoa perderia o envio depois de escolher as fotos.
 */

export const LIMITE_REFERENCIAS = {
  arquivos: 5,
  bytesPorArquivo: 8 * 1024 * 1024,
  bytesTotal: 20 * 1024 * 1024
} as const;

/** O que o seletor de arquivos oferece. Quem decide de verdade é o Worker,
 *  conferindo os bytes — `accept` é sugestão, não trava. */
export const TIPOS_ACEITOS = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

export const emMegabytes = (bytes: number) =>
  `${(bytes / (1024 * 1024)).toFixed(bytes < 1024 * 1024 * 10 ? 1 : 0)}MB`;
