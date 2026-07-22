import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

export const ContactForm: React.FC = () => {
  const WHATSAPP_NUMBER = '5531983529270';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    style: '',
    placement: '',
    size: '',
    idea: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // A mapping since IDs use "input-name", "select-style", etc.
    const key = e.target.id.replace('input-', '').replace('select-', '');
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá Clara! Gostaria de solicitar um orçamento para tatuagem.%0A%0A*Nome:* ${formData.name}%0A*Estilo:* ${formData.style}%0A*Local:* ${formData.placement}%0A*Tamanho:* ${formData.size}%0A%0A*Ideia:* ${formData.idea}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
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
              <Input label="WhatsApp" id="input-phone" type="tel" placeholder="Ex: (11) 99999-9999" required value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-row">
              <Select 
                label="Estilo Preferido" 
                id="select-style" 
                required 
                value={formData.style} 
                onChange={handleChange}
                options={[
                  { value: '', label: 'Selecione um estilo', disabled: true },
                  { value: 'Fine Line', label: 'Fine Line (Traços Finos/Delicados)' },
                  { value: 'Blackwork', label: 'Blackwork (Preenchimento e Sombra)' },
                  { value: 'Ornamental', label: 'Ornamental / Geométrico' },
                  { value: 'Outro', label: 'Outro (Descreva na ideia)' }
                ]} 
              />
              <Input label="Local do Corpo" id="input-placement" placeholder="Ex: Antebraço, Costela, Tornozelo" required value={formData.placement} onChange={handleChange} />
            </div>

            <div className="form-row">
              <Input label="Tamanho Aproximado (em cm)" id="input-size" placeholder="Ex: 10cm de altura por 5cm de largura" required value={formData.size} onChange={handleChange} />
            </div>

            <Textarea label="Descreva sua Ideia" id="input-idea" rows={4} placeholder="Conte-me um pouco sobre o que você deseja tatuar, significado, elementos que gostaria de incluir e referências..." required value={formData.idea} onChange={handleChange} />

            <Button type="submit" className="btn-primary btn-submit" id="btn-submit-booking">
              <span>Enviar via WhatsApp</span>
              <i data-lucide="send"></i>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
