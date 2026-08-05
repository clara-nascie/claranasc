/**
 * Relatório de acesso do site, direto da API da Cloudflare.
 *
 * Os números vêm da GraphQL Analytics API, a mesma fonte do painel. São
 * métricas de servidor: a Cloudflare as coleta porque o tráfego passa por ela,
 * sem script nenhum na página. Não incluem tempo na página nem Core Web Vitals
 * de campo — isso exigiria o beacon do Web Analytics no HTML.
 *
 * Uso:
 *   1. Crie um .env na raiz (já ignorado pelo git) com:
 *        CLOUDFLARE_API_TOKEN=seu_token
 *        CLOUDFLARE_ZONE_ID=opcional, o script descobre pelo nome
 *   2. node scripts/analytics-cloudflare.mjs [dias]
 *
 *   O padrão é 7 dias. `node scripts/analytics-cloudflare.mjs 30` para um mês.
 */

const GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql';
const REST = 'https://api.cloudflare.com/client/v4';
const DOMINIO = 'claranasc.com';

try {
  process.loadEnvFile('.env');
} catch {
  // Sem .env: as variáveis podem vir do ambiente. A checagem abaixo decide.
}

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('Falta CLOUDFLARE_API_TOKEN. Veja o cabeçalho deste arquivo.');
  process.exit(1);
}

const dias = Number(process.argv[2] ?? 7);
if (!Number.isFinite(dias) || dias < 1) {
  console.error(`Número de dias inválido: ${process.argv[2]}`);
  process.exit(1);
}

const agora = new Date();
const dia = (d) => d.toISOString().slice(0, 10);
const desde = new Date(agora.getTime() - (dias - 1) * 86400000);
const ultimas24h = new Date(agora.getTime() - 86400000);

const cabecalhos = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Tráfego é dado da zona; Web Vitals é dado da conta. Os dois IDs saem da
 * mesma consulta, porque o objeto da zona carrega a conta a que pertence.
 */
async function descobrirIds() {
  const resposta = await fetch(`${REST}/zones?name=${DOMINIO}`, { headers: cabecalhos });
  const corpo = await resposta.json();

  if (!corpo.success) {
    const motivo = corpo.errors?.map((e) => e.message).join('; ') ?? resposta.status;
    throw new Error(
      `Não consegui achar a zona ${DOMINIO}: ${motivo}\n` +
        'Se for falta de permissão, preencha CLOUDFLARE_ZONE_ID no .env.'
    );
  }
  if (!corpo.result?.length) throw new Error(`Nenhuma zona chamada ${DOMINIO} nesta conta.`);

  return {
    zoneTag: process.env.CLOUDFLARE_ZONE_ID || corpo.result[0].id,
    accountTag: process.env.CLOUDFLARE_ACCOUNT_ID || corpo.result[0].account?.id
  };
}

const { zoneTag, accountTag } = await descobrirIds();

/**
 * Cada seção é uma consulta própria: uma falhar não pode derrubar as outras.
 *
 * Filtro e zona entram literais, e não como variáveis tipadas. Variável
 * exigiria nomear o input type do schema, e errar esse nome derruba tudo de
 * uma vez. Os valores são gerados aqui, não vêm de fora.
 */
async function consultar(nome, corpoDaConsulta, escopo = 'zona') {
  const alvo =
    escopo === 'conta'
      ? `accounts(filter: { accountTag: "${accountTag}" })`
      : `zones(filter: { zoneTag: "${zoneTag}" })`;
  const query = `query { viewer { ${alvo} { ${corpoDaConsulta} } } }`;

  const resposta = await fetch(GRAPHQL, {
    method: 'POST',
    headers: cabecalhos,
    body: JSON.stringify({ query })
  });
  const corpo = await resposta.json();

  if (corpo.errors?.length) {
    console.error(`\n[${nome}] a API recusou a consulta:`);
    for (const erro of corpo.errors) console.error(`  - ${erro.message}`);
    return null;
  }
  const viewer = corpo.data?.viewer;
  return (escopo === 'conta' ? viewer?.accounts?.[0] : viewer?.zones?.[0]) ?? null;
}

const num = (n) => (n ?? 0).toLocaleString('pt-BR');

function tabela(titulo, linhas, rotulo, valor) {
  console.log(`\n${titulo}`);
  if (!linhas?.length) {
    console.log('  (sem dados no período)');
    return;
  }
  const largura = Math.max(...linhas.map((l) => String(rotulo(l)).length));
  for (const linha of linhas) {
    console.log(`  ${String(rotulo(linha)).padEnd(largura)}  ${num(valor(linha))}`);
  }
}

/** Soma os mapas aninhados que o conjunto diário devolve dentro de cada dia. */
function somarMapa(dias_, campo, chave) {
  const total = new Map();
  for (const d of dias_) {
    for (const item of d.sum?.[campo] ?? []) {
      const k = item[chave];
      total.set(k, (total.get(k) ?? 0) + item.requests);
    }
  }
  return [...total.entries()]
    .map(([nome, requests]) => ({ nome, requests }))
    .sort((a, b) => b.requests - a.requests);
}

console.log(`\n${DOMINIO} — ${dia(desde)} a ${dia(agora)} (${dias} dia(s))`);
console.log('='.repeat(60));

/*
 * O conjunto diário é pré-somado pela Cloudflare, e por isso aceita períodos
 * longos. O preço é não ter o caminho da página: isso só existe no dado cru,
 * consultado mais abaixo em recorte de 24h.
 */
const serie = await consultar(
  'série diária',
  `httpRequests1dGroups(
     limit: 366
     filter: { date_geq: "${dia(desde)}", date_leq: "${dia(agora)}" }
     orderBy: [date_ASC]
   ) {
     dimensions { date }
     uniq { uniques }
     sum {
       requests
       pageViews
       countryMap { clientCountryName requests }
       responseStatusMap { edgeResponseStatus requests }
     }
   }`
);

const porDia = serie?.httpRequests1dGroups ?? [];

if (porDia.length) {
  const requests = porDia.reduce((s, d) => s + (d.sum?.requests ?? 0), 0);
  const pageViews = porDia.reduce((s, d) => s + (d.sum?.pageViews ?? 0), 0);

  console.log(`\nRequisições:   ${num(requests)}`);
  console.log(`Page views:    ${num(pageViews)}   (carregamentos de página, sem imagens e CSS)`);

  console.log('\nPor dia                page views   visitantes únicos');
  for (const d of porDia) {
    const pv = num(d.sum?.pageViews).padStart(10);
    const uq = num(d.uniq?.uniques).padStart(17);
    console.log(`  ${d.dimensions.date}   ${pv}${uq}`);
  }

  tabela('Países', somarMapa(porDia, 'countryMap', 'clientCountryName').slice(0, 10), (l) => l.nome, (l) => l.requests);

  tabela(
    'Respostas por status',
    somarMapa(porDia, 'responseStatusMap', 'edgeResponseStatus').slice(0, 10),
    (l) => `HTTP ${l.nome}`,
    (l) => l.requests
  );
} else if (serie) {
  console.log('\n(nenhum acesso registrado no período)');
}

/*
 * Caminho da página só existe no conjunto cru, e o plano gratuito limita esse
 * conjunto a 1 dia por consulta. Daí o recorte separado.
 */
const paginas = await consultar(
  'páginas (24h)',
  `httpRequestsAdaptiveGroups(
     limit: 200
     filter: { datetime_geq: "${ultimas24h.toISOString()}", datetime_leq: "${agora.toISOString()}" }
     orderBy: [count_DESC]
   ) {
     count
     dimensions { clientRequestPath }
   }`
);

/*
 * Sem filtrar, a lista vira imagem e script: cada página puxa dezenas de
 * arquivos, então eles sempre ganham no volume. O que interessa aqui é a
 * página que a visitante abriu.
 */
const ARQUIVOS = /^\/(_astro|cdn-cgi)\/|\.(webp|jpe?g|png|svg|ico|js|css|xml|txt|woff2?)$/i;
const soPaginas = (paginas?.httpRequestsAdaptiveGroups ?? [])
  .filter((l) => !ARQUIVOS.test(l.dimensions.clientRequestPath))
  .slice(0, 15);

tabela(
  'Páginas mais acessadas (últimas 24h)',
  soPaginas,
  (l) => l.dimensions.clientRequestPath,
  (l) => l.count
);

/*
 * Core Web Vitals medidos em visitantes reais, e não em laboratório: é o que
 * o Google usa para avaliar a experiência da página. Vem do beacon do Web
 * Analytics, que a Cloudflare injeta na borda — por isso o dado é da conta, e
 * não da zona.
 *
 * O percentil 75 é o número que conta: três em cada quatro visitas foram pelo
 * menos tão boas quanto ele. Os limiares abaixo são os do Google.
 */
const LIMIARES = {
  LCP: { bom: 2500, ruim: 4000, unidade: 'ms', o_que: 'maior elemento visível terminar de pintar' },
  INP: { bom: 200, ruim: 500, unidade: 'ms', o_que: 'a página responder a um toque ou clique' },
  CLS: { bom: 0.1, ruim: 0.25, unidade: '', o_que: 'o quanto o layout pula durante o carregamento' },
  FCP: { bom: 1800, ruim: 3000, unidade: 'ms', o_que: 'aparecer o primeiro pixel de conteúdo' },
  TTFB: { bom: 800, ruim: 1800, unidade: 'ms', o_que: 'o servidor mandar o primeiro byte' }
};

const vitals = accountTag
  ? await consultar(
      'core web vitals',
      `rumWebVitalsEventsAdaptiveGroups(
         limit: 1
         filter: {
           datetime_geq: "${desde.toISOString()}"
           datetime_leq: "${agora.toISOString()}"
           bot: 0
         }
       ) {
         count
         quantiles {
           largestContentfulPaintP75
           interactionToNextPaintP75
           cumulativeLayoutShiftP75
           firstContentfulPaintP75
           timeToFirstByteP75
         }
       }`,
      'conta'
    )
  : null;

const medidas = vitals?.rumWebVitalsEventsAdaptiveGroups?.[0];

console.log('\nCore Web Vitals — percentil 75, visitantes reais');
if (!medidas?.count) {
  console.log('  (sem amostras no período)');
} else {
  const q = medidas.quantiles;
  const valores = {
    LCP: q.largestContentfulPaintP75,
    INP: q.interactionToNextPaintP75,
    CLS: q.cumulativeLayoutShiftP75,
    FCP: q.firstContentfulPaintP75,
    TTFB: q.timeToFirstByteP75
  };

  console.log(`  amostras: ${num(medidas.count)}\n`);
  for (const [sigla, valor] of Object.entries(valores)) {
    const { bom, ruim, unidade, o_que } = LIMIARES[sigla];
    if (valor == null) {
      console.log(`  ${sigla.padEnd(5)} sem dado`);
      continue;
    }
    // As durações vêm em microssegundos; os limiares do Google são em ms.
    const emMs = unidade === 'ms' ? valor / 1000 : valor;
    const nota = emMs <= bom ? 'bom' : emMs <= ruim ? 'a melhorar' : 'ruim';
    const exibido = unidade === 'ms' ? `${Math.round(emMs)}ms` : emMs.toFixed(3);
    console.log(`  ${sigla.padEnd(5)} ${exibido.padStart(8)}  ${nota.padEnd(11)} ${o_que}`);
  }
}

console.log('');
