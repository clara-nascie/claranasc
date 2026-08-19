# Referências do orçamento

Como as fotos de referência saem do formulário e chegam no WhatsApp da Clara, e
por que o caminho é esse.

## O problema: link não carrega arquivo

O formulário nunca enviou nada para servidor nenhum. Ele monta uma URL
`wa.me/<numero>?text=<mensagem>` e abre. `wa.me` aceita dois parâmetros,
`phone` e `text` — **não existe parâmetro de arquivo**. E o site é estático:
antes disto o `wrangler.jsonc` só publicava a pasta `dist`, sem nenhum código
rodando na borda.

Ou seja: não havia nem para onde a foto ir, nem como ela entrar na mensagem.

## O caminho escolhido

1. A pessoa escolhe as fotos no formulário.
2. Ao enviar, elas sobem para `POST /api/referencias`.
3. O Worker guarda cada uma no R2 sob um `pedido` sorteado e devolve
   `https://claranasc.com/r/<pedido>`.
4. Esse endereço entra na mensagem como `*Referências:* …`.
5. A Clara abre o link no celular e vê as fotos numa página só.

O que **não** foi escolhido, e por quê:

| Alternativa | Por que não |
|---|---|
| Compartilhamento nativo (`navigator.share`) | Entrega os arquivos, mas não consegue mirar um número. A pessoa teria que achar a Clara na própria agenda — e quem pede orçamento pela primeira vez não tem o contato salvo. |
| Não ter campo, pedir as fotos no chat | Funciona e custa zero, mas depende de a pessoa lembrar de anexar depois. |

## Falha no upload não pode custar o contato

Se o `POST` falhar — rede ruim, limite de envios, Worker fora do ar — a
conversa **abre do mesmo jeito**, com a linha
`_(vou mandar as fotos de referência aqui na conversa)_` no lugar do link, e um
aviso na tela explicando.

O formulário existe para começar uma conversa. Um upload que falha e engole o
envio troca um contato perdido por um problema técnico resolvido, o que é um
péssimo negócio.

## O endereço de upload é público, e isso tem consequências

Qualquer pessoa na internet pode chamar `POST /api/referencias`. As travas:

| Trava | Valor | Contra o quê |
|---|---|---|
| Assinatura dos bytes | jpeg, png, webp, heic | Hospedagem de arquivo qualquer no domínio dela |
| Tamanho por foto | 8MB | Encher o bucket com um arquivo só |
| Soma do envio | 20MB | O mesmo, em cinco arquivos |
| Fotos por envio | 5 | O mesmo, em muitos arquivos |
| Envios por minuto por IP | 5 | Marteladas automáticas |

⚠️ **O tipo declarado pelo navegador não vale nada.** O `accept` do campo e o
`type` do arquivo vêm do cliente e são triviais de mentir. Quem decide é a
conferência dos primeiros bytes no Worker — sem ela, o endereço seria
hospedagem de arquivo grátis no domínio dela, e o `nosniff` da resposta não
salvaria, porque o problema não é como o navegador lê e sim o que está lá.

O `namespace_id` do rate limit é um número que só precisa ser único **dentro do
Worker**; ele não aponta para nada criado no painel.

### Ainda em aberto

As travas seguram martelada de uma máquina, não campanha distribuída. O que
fecha a conta é a **regra de expiração do bucket**, que apaga tudo em 30 dias:
mesmo um enchimento bem-sucedido se desfaz sozinho. Ver "A infraestrutura, e
por que ela é assim" abaixo.

## A página das referências não pode ser indexada

O site inteiro existe para ranquear no Google. Foto de cliente entrando no
índice seria o oposto disso, além de vazamento.

A página e as imagens respondem com `X-Robots-Tag: noindex, nofollow`, e o
endereço é um UUID sorteado — 122 bits, não se adivinha nem se enumera.

⚠️ **Não** foi acrescentado `Disallow: /r/` no `robots.txt` de propósito:
bloquear o rastreamento impediria o Google de *ler* o `noindex`. As duas coisas
juntas se anulam. Como as páginas não são linkadas de lugar nenhum e o endereço
é sorteado, o cabeçalho basta.

## O Worker não pode roubar o site

O `run_worker_first` do `wrangler.jsonc` lista `/api/*` e `/r/*`. Só essas
rotas passam pelo Worker; todo o resto continua sendo entregue direto pelo
servidor de assets, exatamente como antes de existir Worker.

O `fetch` ainda termina em `env.ASSETS.fetch(request)` como rede de segurança:
se um dia essa lista mudar, o site continua servido em vez de cair.

A primeira verificação em `scripts/verificar-formulario.mjs` é justamente essa
— a home e uma página de nicho respondem 200. Um erro de rota aqui derrubaria o
site inteiro de uma vez, e é o tipo de defeito que precisa falhar barulhento.

## Os limites moram num arquivo só

`src/data/referencias.ts` é importado **pelo formulário e pelo Worker**. Se cada
lado tivesse o seu número, um dia o navegador aceitaria o que o servidor recusa
e a pessoa perderia o envio depois de escolher as fotos.

## HEIC do iPhone

O iOS costuma converter para JPEG ao escolher a foto pelo campo de arquivo, mas
nem sempre. HEIC é aceito no upload — barrar seria barrar quem tem iPhone.

Na página das referências ele vira **link de download**, não `<img>`: a maioria
dos navegadores não pinta HEIC, e um link honesto é melhor que uma imagem
quebrada. Na lista do formulário, o nome do arquivo fica *atrás* da miniatura
pelo mesmo motivo — quando o formato não pinta, sobra o nome em vez de um
retângulo vazio.

## Como testar

⚠️ **`npm run preview` não serve.** Ele entrega só os arquivos estáticos, e
`/api/referencias` não existe lá — a verificação passaria a testar o nada.

```
npm run build     # o Worker serve o dist/
npm run worker    # wrangler, com R2 e rate limit simulados
npm run verificar:formulario
```

`wrangler dev` roda local por padrão e **não precisa de conta nem de token** da
Cloudflare — é por isso que o CI consegue rodar essa verificação.

A verificação esgota a cota de envios no último teste e espera a janela abrir
no começo. Sem essa espera, rodá-la duas vezes seguidas reprovaria tudo por
429 — falha do teste, não do site.

## A infraestrutura, e por que ela é assim

⚠️ **O bucket precisa existir antes de qualquer push.** O `wrangler.jsonc`
declara `claranasc-referencias`; sem ele o deploy falha — e o deploy vai direto
para produção, sem etapa de aprovação.

Feito em 18/08/2026, na conta da Clara:

```
npx wrangler r2 bucket create claranasc-referencias
npx wrangler r2 bucket lifecycle add claranasc-referencias expira-referencias \
  --expire-days 30 --abort-multipart-days 1
```

**As fotos somem sozinhas em 30 dias**, por decisão da Clara: ela precisa
*olhar* a referência para orçar, não guardá-la. O bucket não acumula, e nada de
cliente fica no servidor além do necessário.

O `--abort-multipart-days 1` limpa envio interrompido no meio. O Worker manda a
foto de uma vez só, então isto é rede de segurança contra pedaço órfão ocupando
espaço sem aparecer em lugar nenhum.

⚠️ **O link na conversa do WhatsApp sobrevive à foto.** Passados os 30 dias, o
endereço continua na conversa mas responde "Estas referências não existem
mais". Se um orçamento demorar mais que isso, é pedir a foto de novo — o custo
é esse, e foi aceito.

Trocar o prazo é um comando, e não mexe em código:

```
npx wrangler r2 bucket lifecycle remove claranasc-referencias expira-referencias
npx wrangler r2 bucket lifecycle add claranasc-referencias expira-referencias --expire-days 60
```

O que **não** decide o prazo é custo: 30 orçamentos por mês com 3 fotos de ~3MB
dão uns 270MB/mês, longe dos 10GB da faixa gratuita. O prazo é sobre não
guardar foto de cliente, não sobre a conta.

### O `.env` atrapalha o wrangler

O `.env` do projeto tem um `CLOUDFLARE_API_TOKEN` com escopo só de Analytics, e
ele **tem precedência sobre o login por OAuth**. Com ele carregado, `wrangler
login` recusa ("You are logged in with an API Token") e as chamadas de R2
respondem 403.

A saída é apontar `--env-file` para um arquivo vazio: a opção **substitui** a
descoberta automática do `.env`, não soma a ela.

```
npx wrangler login --env-file ~/vazio.env
npx wrangler r2 bucket lifecycle list claranasc-referencias --env-file ~/vazio.env
```
