import type { PortfolioItem } from './portfolioData';

import guitarra from '../assets/coberturas-antes/cobertura-guitarra-trash-polka-braco-antes.webp';
import coracao from '../assets/coberturas-antes/cobertura-coracao-anatomico-braco-antes.webp';
import margaridas from '../assets/coberturas-antes/cobertura-margaridas-braco-antes.webp';
import onca from '../assets/coberturas-antes/cobertura-onca-flores-braco-antes.webp';
import aguaViva from '../assets/coberturas-antes/cobertura-agua-viva-panturrilha-antes.webp';
import samurai from '../assets/coberturas-antes/cobertura-samurai-braco-antes.webp';
import planetas from '../assets/coberturas-antes/cobertura-planetas-ombro-antes.webp';
import fullmetal from '../assets/coberturas-antes/cobertura-fullmetal-alchemist-braco-antes.webp';
import floralPulso from '../assets/coberturas-antes/cobertura-floral-pulso-antes.webp';
import floralPulsoLadoDireito from '../assets/coberturas-antes/cobertura-floral-pulso-lado-direito-antes.webp';
import floralPulsoLadoEsquerdo from '../assets/coberturas-antes/cobertura-floral-pulso-lado-esquerdo-antes.webp';
import lotus from '../assets/coberturas-antes/cobertura-flor-de-lotus-e-ramos-triceps-antes.webp';
import trevos from '../assets/coberturas-antes/cobertura-par-de-trevos-biceps-antes.webp';

export interface FotoAntes {
  image: ImageMetadata;
  alt: string;
}

/* ⚠️ As fotos do antes não entram no `ImagensSchema` nem no sitemap de
   imagens: os dois declaram a Clara como autora, e a tatuagem antiga não é
   trabalho dela. */

const LOTUS: FotoAntes = {
  image: lotus,
  alt: 'Antes da cobertura: flor de lótus em traço fino no braço, sobre o tríceps'
};

const AGUA_VIVA: FotoAntes = {
  image: aguaViva,
  alt: 'Antes da cobertura: figura de menina de vestido em traço preto na panturrilha'
};

/** Chave: o `id` da foto do depois em `portfolioItems`. */
const ANTES: Record<number, FotoAntes> = {
  3: {
    image: onca,
    alt: 'Antes da cobertura: tatuagem antiga de rosas em preto carregado, do ombro ao braço'
  },
  5: {
    image: samurai,
    alt: 'Antes da cobertura: retrato de samurai em preto e cinza no braço, do ombro ao cotovelo'
  },
  6: {
    image: fullmetal,
    alt: 'Antes da cobertura: símbolo de Flamel de Fullmetal Alchemist em preto sólido no ombro'
  },
  31: {
    image: guitarra,
    alt: 'Antes da cobertura: tatuagem antiga de guitarra com faixa escrita no braço, do ombro ao bíceps'
  },
  32: {
    image: margaridas,
    alt: 'Antes da cobertura: tatuagens pequenas e desbotadas, com figura feminina, carimbo oriental e flor, no braço, sobre o tríceps'
  },
  33: AGUA_VIVA,
  34: {
    image: planetas,
    alt: 'Antes da cobertura: estrela vazada em traço preto grosso no ombro'
  },
  36: {
    image: coracao,
    alt: 'Antes da cobertura: linha de eletrocardiograma com escrita em traço fino colorido no braço, sobre o tríceps'
  },
  46: AGUA_VIVA,
  186: {
    image: floralPulso,
    alt: 'Antes da cobertura: flores em traço vermelho envolvendo o pulso'
  },
  187: {
    image: floralPulsoLadoDireito,
    alt: 'Antes da cobertura: flores em traço vermelho com folhas pretas no pulso, vista pelo lado de dentro'
  },
  188: {
    image: floralPulsoLadoEsquerdo,
    alt: 'Antes da cobertura: flores em traço vermelho no pulso, vista pela lateral'
  },
  189: LOTUS,
  190: LOTUS,
  191: {
    image: trevos,
    alt: 'Antes da cobertura: par de trevos em traço colorido roxo no braço, sobre o bíceps'
  }
};

export const antesDa = (item: PortfolioItem): FotoAntes | undefined => ANTES[item.id];
