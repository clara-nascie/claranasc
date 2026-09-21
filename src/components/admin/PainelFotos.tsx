import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { emMegabytes } from '../../data/referencias';
import { converterFoto, type FotoConvertida } from '../../lib/converterFoto';
import {
  ALT_MINIMO,
  blocoDoItem,
  linhaDeImport,
  problemasDaFoto,
  sugerirNome
} from '../../lib/itemDoPortfolio';

interface PainelFotosProps {
  categorias: { id: string; label: string }[];
  proximoId: number;
  existentes: string[];
}

export const PainelFotos: React.FC<PainelFotosProps> = ({ categorias, proximoId, existentes }) => {
  const campoRef = useRef<HTMLInputElement>(null);
  const [original, setOriginal] = useState<File | null>(null);
  const [convertida, setConvertida] = useState<FotoConvertida | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [convertendo, setConvertendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [categoria, setCategoria] = useState(categorias[0].id);
  const [titulo, setTitulo] = useState('');
  const [parteDoCorpo, setParteDoCorpo] = useState('');
  const [alt, setAlt] = useState('');
  const [arquivo, setArquivo] = useState('');
  const [arquivoEditado, setArquivoEditado] = useState(false);

  useEffect(() => {
    if (!arquivoEditado) setArquivo(sugerirNome(categoria, titulo, parteDoCorpo));
  }, [categoria, titulo, parteDoCorpo, arquivoEditado]);

  // ⚠️ Sem o `revoke`, cada foto trocada fica presa na memória da aba.
  useEffect(() => {
    if (!convertida) return;
    const endereco = URL.createObjectURL(convertida.blob);
    setPrevia(endereco);
    return () => URL.revokeObjectURL(endereco);
  }, [convertida]);

  const escolher = async (lista: FileList | null) => {
    const escolhido = lista?.[0];
    if (!escolhido) return;
    setOriginal(escolhido);
    setConvertida(null);
    setPrevia(null);
    setErro(null);
    setConvertendo(true);
    try {
      setConvertida(await converterFoto(escolhido));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não consegui converter a foto.');
    } finally {
      setConvertendo(false);
      if (campoRef.current) campoRef.current.value = '';
    }
  };

  const rotulo = categorias.find((c) => c.id === categoria)!.label;
  const foto = { id: proximoId, arquivo, titulo, categoria, categoriaLabel: rotulo, alt };
  const problemas = problemasDaFoto(foto, existentes);
  const pronta = convertida && problemas.length === 0;

  return (
    <div className="painel-fotos">
      <div className="form-group">
        <label htmlFor="foto">Foto</label>
        <input
          ref={campoRef}
          id="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => escolher(e.target.files)}
        />
      </div>

      {convertendo && <p className="painel-aviso">Convertendo…</p>}
      {erro && <p className="painel-erro" role="alert">{erro}</p>}

      {convertida && previa && original && (
        <figure className="painel-previa">
          <img src={previa} alt="Prévia da foto convertida" />
          <figcaption>
            {convertida.largura}×{convertida.altura} · {emMegabytes(original.size)} →{' '}
            {Math.round(convertida.blob.size / 1024)}KB em WebP
          </figcaption>
        </figure>
      )}

      <Select
        label="Categoria"
        id="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        options={categorias.map((c) => ({ value: c.id, label: c.label }))}
      />
      <Input
        label="Título"
        id="titulo"
        value={titulo}
        placeholder="Ramo de café"
        onChange={(e) => setTitulo(e.target.value)}
      />
      <Input
        label="Parte do corpo"
        id="parte-do-corpo"
        value={parteDoCorpo}
        placeholder="punho"
        onChange={(e) => setParteDoCorpo(e.target.value)}
      />
      <Textarea
        label={`Descrição para o Google (alt) · ${alt.trim().length}/${ALT_MINIMO}`}
        id="alt"
        rows={4}
        value={alt}
        placeholder="Tatuagem botânica de ramo de café em traço fino no punho"
        onChange={(e) => setAlt(e.target.value)}
      />
      <Input
        label="Nome do arquivo"
        id="arquivo"
        value={arquivo}
        autoCapitalize="none"
        spellCheck={false}
        onChange={(e) => {
          setArquivo(e.target.value);
          setArquivoEditado(true);
        }}
      />

      {problemas.length > 0 && (
        <ul className="painel-problemas">
          {problemas.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {pronta && (
        <section className="painel-resumo">
          <h2>O que entraria no site</h2>
          <p>
            <code>src/assets/portfolio/{arquivo}.webp</code>
          </p>
          <pre>{`${linhaDeImport(foto)}\n\n${blocoDoItem(foto)}`}</pre>
          <a className="btn btn-primary" href={previa!} download={`${arquivo}.webp`}>
            Baixar o WebP
          </a>
          <p className="painel-aviso">O envio direto para o site chega na próxima etapa.</p>
        </section>
      )}
    </div>
  );
};
