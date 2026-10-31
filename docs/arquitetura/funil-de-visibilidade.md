# Funil de visibilidade: contagem de pedidos

O site conta quantas vezes o formulário de orçamento é enviado. Esse número,
somado às visitas do Web Analytics, mostra a etapa **antes do orçamento**:
quantas pessoas chegam e quantas pedem orçamento.

```
Visitas ao site ──▶ Pedidos iniciados ──▶ Orçamentos
 (Web Analytics)     (/api/pedido)
```

A coleta e a análise desses números ficam **fora deste repositório**, que é
público: aqui fica só a contagem.

## Como funciona

O formulário (`ContactForm.tsx`) chama `navigator.sendBeacon('/api/pedido')`
logo antes de abrir o WhatsApp. O Worker grava um ponto no Workers Analytics
Engine, no dataset `claranasc_pedidos`, e responde `204`.

- **Nada do formulário é enviado.** Nem nome, nem ideia, nem estilo. O ponto diz
  só "houve um envio".
- **O IP não é guardado.** Ele serve de chave para o limite de 10 contagens por
  minuto (`LIMITE_PEDIDO`) e é descartado.
- **Falha não pode custar o contato**, a mesma regra de
  [referencias-do-orcamento.md](referencias-do-orcamento.md). O `sendBeacon` não
  espera resposta e fica dentro de um `try`. Se a rota cair, o WhatsApp abre do
  mesmo jeito. `npm run verificar:formulario` cobre os dois casos.

⚠️ **Pedido iniciado não é mensagem enviada.** A pessoa pode fechar o WhatsApp
sem mandar.

## Ler a contagem

O dataset nasce sozinho no primeiro ponto gravado. Os dados ficam guardados por 3
meses. Para ler, use a API SQL do Analytics Engine, com um token com
**Account → Account Analytics → Read**:

```sql
SELECT toStartOfDay(timestamp) AS dia, SUM(_sample_interval) AS pedidos
FROM claranasc_pedidos
GROUP BY dia ORDER BY dia
```

`SUM(_sample_interval)`, e não `count()`: o Analytics Engine pode amostrar, e
cada linha diz quantos eventos representa.
