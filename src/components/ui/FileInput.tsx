import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { emMegabytes } from '../../data/referencias';

interface FileInputProps {
  label: string;
  id: string;
  ajuda?: string;
  arquivos: File[];
  aceita: string;
  maxArquivos: number;
  onChange: (arquivos: File[]) => void;
  desabilitado?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  id,
  ajuda,
  arquivos,
  aceita,
  maxArquivos,
  onChange,
  desabilitado = false
}) => {
  const campoRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const [previas, setPrevias] = useState<string[]>([]);

  /* ⚠️ Cada `createObjectURL` prende o arquivo na memória da aba até ser
     desfeito. Sem o `revoke` do retorno, trocar as fotos algumas vezes vaza
     dezenas de megabytes. */
  useEffect(() => {
    const enderecos = arquivos.map((arquivo) => URL.createObjectURL(arquivo));
    setPrevias(enderecos);
    return () => enderecos.forEach((endereco) => URL.revokeObjectURL(endereco));
  }, [arquivos]);

  const acrescentar = (novos: FileList | null) => {
    if (!novos?.length) return;
    onChange([...arquivos, ...Array.from(novos)].slice(0, maxArquivos));
    // Zera o campo: sem isto, escolher o mesmo arquivo de novo não dispara
    // `change` e a pessoa acha que o clique falhou.
    if (campoRef.current) campoRef.current.value = '';
  };

  const remover = (indice: number) => onChange(arquivos.filter((_, i) => i !== indice));

  const cheio = arquivos.length >= maxArquivos;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <input
        ref={campoRef}
        type="file"
        id={id}
        className="campo-arquivo"
        accept={aceita}
        multiple
        disabled={desabilitado}
        onChange={(e) => acrescentar(e.target.files)}
      />

      <div
        className={`area-arquivo${arrastando ? ' area-arquivo--sobre' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!desabilitado && !cheio) setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (!desabilitado && !cheio) acrescentar(e.dataTransfer.files);
        }}
      >
        <button
          type="button"
          className="area-arquivo-botao"
          disabled={desabilitado || cheio}
          onClick={() => campoRef.current?.click()}
        >
          <ImagePlus size={20} aria-hidden="true" />
          <span>{cheio ? `Limite de ${maxArquivos} fotos atingido` : 'Escolher fotos'}</span>
        </button>
        {ajuda && <p className="area-arquivo-ajuda">{ajuda}</p>}
      </div>

      {arquivos.length > 0 && (
        <ul className="lista-referencias">
          {arquivos.map((arquivo, indice) => (
            <li className="referencia" key={`${arquivo.name}-${indice}`}>
              {/* O nome fica atrás da miniatura de propósito: quando o formato
                  não pinta no navegador (HEIC do iPhone), ele aparece sozinho
                  em vez de sobrar um retângulo quebrado. */}
              <span className="referencia-nome">{arquivo.name}</span>
              <img className="referencia-previa" src={previas[indice]} alt="" />
              <button
                type="button"
                className="referencia-remover"
                aria-label={`Remover ${arquivo.name}`}
                disabled={desabilitado}
                onClick={() => remover(indice)}
              >
                <X size={14} aria-hidden="true" />
              </button>
              <span className="referencia-peso">{emMegabytes(arquivo.size)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
