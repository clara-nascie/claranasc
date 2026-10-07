// ⚠️ Texto copiado sem edição do Google Business Profile, inclusive erros de
// digitação. Alterar uma avaliação faz ela deixar de ser do cliente.
export interface Avaliacao {
  nome: string;
  texto: string;
  nota: 1 | 2 | 3 | 4 | 5;
}

export const avaliacoes: Avaliacao[] = [
  {
    nome: 'Sayt M.',
    nota: 5,
    texto:
      'Minha experiência sendo tatuada pela Clara foi excelente do início ao fim. Muito atenciosa (desde quando cheguei no estúdio até o fim da cicatrização),profissional e talentosa. O estúdio é organizado, limpo e ela me passou muita segurança do início ao fim. A tatuagem ficou melhor do que eu imaginava, recomendo de olhos fechados e com certeza volto para fazer outras! 💖'
  },
  {
    nome: 'Gabriel M.',
    nota: 5,
    texto:
      'A Clara é uma excelente tatuadora! Ela não só domina várias técnicas como também entende de tudo sobre tatuagens, sempre ajuda muito dando sugestões e soluções para que o resultado saia o melhor possível, desde a concepção da ideia até a hora de tatuar em si. Muito gentil, tranquila e engraçada, então o clima durante a sessão sempre é ótimo. Recomendo muito'
  },
  {
    nome: 'Mateus M.',
    nota: 5,
    texto:
      'Ótima artista e excelente companhia pra sessões longas. Bons papos, boa música, mão leve e embarca nas ideias dos clientes pros desenhos, imprimindo o toque dela.'
  }
];
