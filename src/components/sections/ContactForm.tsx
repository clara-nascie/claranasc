import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { FileInput } from '../ui/FileInput';
import { whatsappUrl } from '../../data/siteData';
import { LIMITE_REFERENCIAS, TIPOS_ACEITOS, emMegabytes } from '../../data/referencias';

/** Sobe as referências e devolve o endereço delas. Ver
 *  `docs/arquitetura/referencias-do-orcamento.md`. */
async function subirReferencias(arquivos: File[]): Promise<string> {
  const pacote = new FormData();
  for (const arquivo of arquivos) pacote.append('referencias', arquivo);

  const resposta = await fetch('/api/referencias', { method: 'POST', body: pacote });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro ?? 'Não consegui enviar as fotos.');
  return dados.url;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    placement: '',
    size: '',
    idea: ''
  });
  const [referencias, setReferencias] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const key = e.target.id.replace('input-', '').replace('select-', '');
    setFormData({ ...formData, [key]: e.target.value });
  };

  const trocarReferencias = (novas: File[]) => {
    const grandeDemais = novas.find((a) => a.size > LIMITE_REFERENCIAS.bytesPorArquivo);
    if (grandeDemais) {
      setAviso(
        `"${grandeDemais.name}" tem ${emMegabytes(grandeDemais.size)} e o limite por foto é ` +
          `${emMegabytes(LIMITE_REFERENCIAS.bytesPorArquivo)}.`
      );
      return;
    }
    const soma = novas.reduce((total, a) => total + a.size, 0);
    if (soma > LIMITE_REFERENCIAS.bytesTotal) {
      setAviso(`As fotos somam ${emMegabytes(soma)} e o limite é ${emMegabytes(LIMITE_REFERENCIAS.bytesTotal)}.`);
      return;
    }
    setAviso('');
    setReferencias(novas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;

    let linhaReferencias = '';
    if (referencias.length > 0) {
      setEnviando(true);
      try {
        const endereco = await subirReferencias(referencias);
        linhaReferencias = `\n*Referências:* ${endereco}`;
      } catch (erro) {
        /* Falha no upload não pode custar o contato: a conversa abre do mesmo
           jeito, avisando que as fotos vão pelo chat. */
        linhaReferencias = '\n_(vou mandar as fotos de referência aqui na conversa)_';
        setAviso(
          `${erro instanceof Error ? erro.message : 'Não consegui enviar as fotos.'} ` +
            'Sem problema — é só anexá-las na conversa que vai abrir.'
        );
      } finally {
        setEnviando(false);
      }
    }

    const message = [
      'Olá Clara! Gostaria de solicitar um orçamento para tatuagem.',
      '',
      `*Nome:* ${formData.name}`,
      `*Estilo:* ${formData.style}`,
      `*Local:* ${formData.placement}`,
      `*Tamanho:* ${formData.size}`,
      '',
      `*Ideia:* ${formData.idea}${linhaReferencias}`
    ].join('\n');
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="booking-section" id="contato">
      <div className="container">
        <div className="booking-card reveal">
          <div className="booking-header">
            <span className="section-tag">Agendamento</span>
            <h2 className="section-title">Solicite seu Orçamento</h2>
            <p className="booking-subtitle">Preencha os detalhes abaixo para que possamos iniciar a criação do seu projeto personalizado. O formulário gerará uma mensagem direta para o meu WhatsApp.</p>
          </div>

          <form className="booking-form" id="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <Input label="Nome Completo" id="input-name" placeholder="Ex: Clara Silva" required value={formData.name} onChange={handleChange} />
              <Select
                label="Estilo Preferido"
                id="select-style"
                required
                value={formData.style}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Selecione um estilo', disabled: true },
                  { value: 'Blackwork', label: 'Blackwork (Preenchimento e Sombra)' },
                  { value: 'Fine Line', label: 'Fine Line (Traços Finos/Delicados)' },
                  { value: 'Botânico', label: 'Botânico (Flores e Folhagens)' },
                  { value: 'Geek & Animes', label: 'Geek & Animes (Cultura Pop)' },
                  { value: 'Coberturas', label: 'Cobertura de Tatuagem Antiga' },
                  { value: 'Outro', label: 'Outro (Descreva na ideia)' }
                ]}
              />
            </div>

            <div className="form-row">
              <Input label="Local do Corpo" id="input-placement" placeholder="Ex: Antebraço, Costela, Tornozelo" required value={formData.placement} onChange={handleChange} />
              <Input label="Tamanho Aproximado (em cm)" id="input-size" placeholder="Ex: 10cm de altura por 5cm de largura" required value={formData.size} onChange={handleChange} />
            </div>

            <Textarea label="Descreva sua Ideia" id="input-idea" rows={4} placeholder="Conte-me um pouco sobre o que você deseja tatuar, significado, elementos que gostaria de incluir e referências..." required value={formData.idea} onChange={handleChange} />

            <FileInput
              label="Fotos de Referência (opcional)"
              id="input-referencias"
              ajuda={`Até ${LIMITE_REFERENCIAS.arquivos} imagens, ${emMegabytes(LIMITE_REFERENCIAS.bytesPorArquivo)} cada. Arraste aqui ou escolha no aparelho.`}
              arquivos={referencias}
              aceita={TIPOS_ACEITOS}
              maxArquivos={LIMITE_REFERENCIAS.arquivos}
              onChange={trocarReferencias}
              desabilitado={enviando}
            />

            {aviso && (
              <p className="form-aviso" role="alert">
                {aviso}
              </p>
            )}

            <Button type="submit" className="btn-primary btn-submit" id="btn-submit-booking" disabled={enviando}>
              <span>{enviando ? 'Enviando as fotos…' : 'Enviar via WhatsApp'}</span>
              <Send size={18} aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
