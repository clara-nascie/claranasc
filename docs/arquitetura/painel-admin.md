# Painel `/admin`

Como uma foto sai do celular da Clara e entra no portfólio sem computador, e
por que o caminho é esse. Issue #24.

## O problema: o site não tem onde guardar foto

O site é estático. Uma foto só existe no site se estiver em
`src/assets/portfolio/` **na hora do build**, porque é o `astro:assets` que gera
as variantes responsivas (ver "Pipeline de imagem" em `arquitetura.md`).
Guardar no R2, como as referências do orçamento, deixaria a foto fora desse
pipeline.

Então "subir uma foto" é, no fundo, **fazer um commit**.

## O caminho escolhido

1. A Clara abre `/admin`, escolhe a foto e preenche categoria, título, parte do
   corpo e `alt`.
2. **O navegador converte**: 1600px no lado maior, rotação do EXIF aplicada,
   WebP qualidade 82, os mesmos números do `scripts/importar-fotos.mjs`.
3. A foto convertida sobe para `POST /api/admin/fotos`.
4. O Worker confere tudo de novo e grava **foto + item do `portfolioData.ts`
   num único commit** pela API do GitHub.
5. O commit na `main` dispara o deploy de sempre. A foto aparece em alguns
   minutos.

| Alternativa | Por que não |
|---|---|
| App do GitHub + Action que converte | Resolve a conversão, mas título e `alt` ficam para depois, no computador. |
| CMS pronto (Sveltia, Decap) | Exigiria tirar os dados do `portfolioData.ts` e mover para arquivos de conteúdo, uma reestruturação grande de um arquivo que a Clara edita à mão. |
| Converter no Worker | Worker não roda `sharp`. E subir a foto de 11MB pela rede do celular é lento; convertida ela tem ~120KB. |

## Por que o Worker confere o que o navegador já conferiu

O navegador valida para a Clara ver o erro na hora. O Worker valida porque
**qualquer um pode chamar `/api/admin/fotos` direto**, sem passar pelo painel.
Ele confere:

- que o arquivo é WebP **pelos bytes** e mede largura e altura pelo cabeçalho;
- nome, título e `alt` com as mesmas regras de `src/lib/itemDoPortfolio.ts`;
- a categoria contra o `PORTFOLIO_CATEGORIES` **lido do próprio arquivo** no
  GitHub, então uma categoria criada à mão passa a valer sem mexer no Worker;
- que não existe foto com o mesmo nome.

O `id` também é calculado no Worker, a partir do arquivo atual. O número que o
painel mostra na prévia é só uma estimativa.

## Um commit só, e sem apagar edição alheia

Pela API de "conteúdo" do GitHub, cada arquivo vira um commit. Foto num commit
e dados em outro deixaria, entre os dois, um `portfolioData.ts` importando uma
foto que não existe, e o build quebraria. Por isso o Worker usa a API de baixo
nível (blob → tree → commit → ref) e grava os dois juntos.

Se outro commit entrar entre a leitura do `portfolioData.ts` e a gravação, o
GitHub recusa a atualização do ramo (`force: false`, resposta 422). O Worker
relê e refaz, até 3 vezes. Testado com dois envios simultâneos: saíram ids 177
e 178, um commit em cima do outro.

## Quem pode enviar

O login é do **Cloudflare Access**: só o e-mail da Clara entra em `/admin*` e
`/api/admin*`. O Access manda um token assinado no cabeçalho
`Cf-Access-Jwt-Assertion`, e o Worker **confere a assinatura** com a biblioteca
`jose`. Conferir só se o cabeçalho existe não bastaria, porque qualquer um
consegue inventar um cabeçalho.

Sem `ACCESS_TEAM_DOMAIN` e `ACCESS_AUD` configurados, o Worker recusa todo
envio. Falha fechada: esquecer a configuração bloqueia o painel, não o abre.

## Configuração

| Nome | Onde | O que é |
|---|---|---|
| `GITHUB_REPO`, `GITHUB_BRANCH` | `wrangler.jsonc` | Destino dos commits. |
| `GITHUB_TOKEN` | secret; `.dev.vars` no local | Fine-grained token, só o repositório `claranasc`, só *Contents: read and write*. Vence em 1 ano. |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | `wrangler.jsonc` | Do aplicativo do Access. |

⚠️ O `ACCESS_TEAM_DOMAIN` **não é o nome da organização** mostrado no Zero
Trust ("claranasc"), e sim um identificador gerado (`square-wind-1f90`). O
jeito seguro de descobrir é abrir `claranasc.com/admin` sem login e ver para
onde o redirecionamento leva. O endereço errado não dá erro de configuração:
o Worker só passa a recusar todos os logins.

Quando o token vencer, o painel avisa "O token do GitHub venceu ou foi
revogado". Gere outro e rode `npx wrangler secret put GITHUB_TOKEN`.

## Testar sem mexer na produção

⚠️ Com `GITHUB_BRANCH` apontando para `main`, **um teste local publica no
site**. Teste num ramo descartável:

```
npx wrangler dev --port 8788 --var GITHUB_BRANCH:<ramo-de-teste> --var ADMIN_SEM_LOGIN:1
```

`ADMIN_SEM_LOGIN` pula o Access, e só quando o endereço é `localhost` ou
`127.0.0.1`. Nunca defina essa variável no `wrangler.jsonc`.

## Depois de enviar pelo celular

O commit acontece no GitHub, não no computador. Antes de editar o
`portfolioData.ts` à mão, rode `git pull`, senão a próxima edição conflita com a
foto que entrou pelo painel.

A foto entra só na camada de volume, sem `destaque`. Escolher os 6 destaques de
cada categoria continua sendo uma decisão tomada no computador.
