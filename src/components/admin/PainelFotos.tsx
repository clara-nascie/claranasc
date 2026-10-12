import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { emMegabytes } from '../../data/referencias';
import { converterFoto, type FotoConvertida } from '../../lib/converterFoto';
import {
  ALT_MINIMO,
  CATEGORIA_COM_ANTES,
  INICIO_DO_ALT_DO_ANTES,
  arquivoDoAntes,
  blocoDoAntes,
  blocoDoItem,
  limparTexto,
  linhaDeImport,
  linhaDeImportDoAntes,
  problemasDaFoto,
  problemasDoAntes,
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
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState<{ arquivo: string; id: number; comAntes: boolean; commit: string } | null>(
    null
  );

  const campoAntesRef = useRef<HTMLInputElement>(null);
  const [antes, setAntes] = useState<FotoConvertida | null>(null);
  const [previaAntes, setPreviaAntes] = useState<string | null>(null);
  const [convertendoAntes, setConvertendoAntes] = useState(false);
  const [altAntes, setAltAntes] = useState(INICIO_DO_ALT_DO_ANTES);

  /* ⚠️ `proximoId` e `existentes` vêm do build, e a página não é refeita a
     cada envio: sem acompanhar o que o Worker gravou, a prévia repete o id e
     aceita um nome que acabou de ser usado. */
  const [idDaPrevia, setIdDaPrevia] = useState(proximoId);
  const [enviadasAgora, setEnviadasAgora] = useState<string[]>([]);

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

  useEffect(() => {
    if (!antes) return setPreviaAntes(null);
    const endereco = URL.createObjectURL(antes.blob);
    setPreviaAntes(endereco);
    return () => URL.revokeObjectURL(endereco);
  }, [antes]);

  const escolher = async (lista: FileList | null) => {
    const escolhido = lista?.[0];
    if (!escolhido) return;
    setOriginal(escolhido);
    setEnviada(null);
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

  const escolherAntes = async (lista: FileList | null) => {
    const escolhido = lista?.[0];
    if (!escolhido) return;
    setAntes(null);
    setErro(null);
    setConvertendoAntes(true);
    try {
      setAntes(await converterFoto(escolhido));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não consegui converter a foto do antes.');
    } finally {
      setConvertendoAntes(false);
      if (campoAntesRef.current) campoAntesRef.current.value = '';
    }
  };

  const rotulo = categorias.find((c) => c.id === categoria)!.label;
  const foto = {
    id: idDaPrevia,
    arquivo,
    titulo: limparTexto(titulo),
    categoria,
    categoriaLabel: rotulo,
    alt: limparTexto(alt)
  };
  // ⚠️ O antes escolhido continua guardado se a categoria mudar; só é enviado em coberturas.
  const comAntes = categoria === CATEGORIA_COM_ANTES && antes !== null;
  const problemas = [
    ...problemasDaFoto(foto, [...existentes, ...enviadasAgora]),
    ...(comAntes ? problemasDoAntes(altAntes) : [])
  ];
  const pronta = convertida && !convertendoAntes && problemas.length === 0;

  const enviar = async () => {
    if (!convertida) return;
    const dados = new FormData();
    dados.append('foto', convertida.blob, `${arquivo}.webp`);
    dados.append('arquivo', arquivo);
    dados.append('titulo', foto.titulo);
    dados.append('categoria', categoria);
    dados.append('alt', foto.alt);
    if (comAntes) {
      dados.append('antes', antes.blob, `${arquivoDoAntes(foto)}.webp`);
      dados.append('altAntes', limparTexto(altAntes));
    }

    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch('/api/admin/fotos', { method: 'POST', body: dados });
      const corpo = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(corpo.erro ?? `O envio falhou (${resposta.status}).`);
      setEnviada({ arquivo, id: corpo.id, comAntes: Boolean(corpo.comAntes), commit: corpo.commit });
      setIdDaPrevia(corpo.id + 1);
      setEnviadasAgora((lista) => [...lista, arquivo]);
      setConvertida(null);
      setOriginal(null);
      setTitulo('');
      setParteDoCorpo('');
      setAlt('');
      setAntes(null);
      setAltAntes(INICIO_DO_ALT_DO_ANTES);
      setArquivoEditado(false);
    } catch (e) {
      // Sem internet o `fetch` falha sem resposta nenhuma, e a mensagem do
      // navegador ("Failed to fetch") não diz nada para quem está no celular.
      setErro(e instanceof TypeError ? 'Sem conexão. A foto não foi enviada.' : (e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

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
      {enviada && (
        <p className="painel-sucesso" role="status">
          <strong>{enviada.arquivo}</strong> foi enviada com o id {enviada.id}
          {enviada.comAntes && ', junto com a foto do antes'}. Ela aparece no site em alguns minutos, depois
          do build. <a href={enviada.commit}>Ver o commit</a>
        </p>
      )}

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
      {categoria === CATEGORIA_COM_ANTES && (
        <fieldset className="painel-antes">
          <legend>Antes da cobertura (opcional)</legend>
          <div className="form-group">
            <label htmlFor="foto-antes">Foto do antes</label>
            <input
              ref={campoAntesRef}
              id="foto-antes"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => escolherAntes(e.target.files)}
            />
          </div>
          {convertendoAntes && <p className="painel-aviso">Convertendo o antes…</p>}
          {antes && previaAntes && (
            <figure className="painel-previa">
              <img src={previaAntes} alt="Prévia da foto do antes" />
              <figcaption>
                {antes.largura}×{antes.altura} · {Math.round(antes.blob.size / 1024)}KB em WebP ·{' '}
                <button type="button" className="painel-remover" onClick={() => setAntes(null)}>
                  Remover
                </button>
              </figcaption>
            </figure>
          )}
          {antes && (
            <Textarea
              label="Descrição do antes (alt)"
              id="alt-antes"
              rows={3}
              value={altAntes}
              onChange={(e) => setAltAntes(e.target.value)}
            />
          )}
        </fieldset>
      )}
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
          {comAntes && (
            <>
              <p>
                <code>src/assets/coberturas-antes/{arquivoDoAntes(foto)}.webp</code>
              </p>
              <pre>{`${linhaDeImportDoAntes(foto)}\n\n${blocoDoAntes(foto, limparTexto(altAntes))}`}</pre>
            </>
          )}
          <button type="button" className="btn btn-primary" disabled={enviando} onClick={enviar}>
            {enviando ? 'Enviando…' : 'Enviar para o site'}
          </button>
          <p className="painel-aviso">O id final é conferido na hora do envio.</p>
        </section>
      )}
    </div>
  );
};
