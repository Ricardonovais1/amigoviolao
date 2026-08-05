// Audita a migracao de URLs: lista todo slug publicado no WordPress
// (posts + pages, via REST API publica) e diffa contra o que o site novo serve,
// pra achar endereco indexado que vai cair em 404.
//
// Ja desconta o que esta coberto pelo REDIRECT_MAP de
// scripts/cloudfront_redirects.py, entao o que sobra na saida e exatamente o
// que ainda precisa de decisao.
//
// Rodar antes do cutover (pra montar o mapa) e depois (pra confirmar que nao
// sobrou nada).
//
// Uso: node scripts/audit_wp_urls.mjs

import { readdirSync, readFileSync } from "node:fs";

const API = "https://amigoviolao.com/wp-json/wp/v2";

async function fetchAll(type) {
  const out = [];
  for (let page = 1; page < 30; page++) {
    const r = await fetch(
      `${API}/${type}?per_page=100&page=${page}&_fields=slug,link,title`,
    );
    if (!r.ok) break;
    const batch = await r.json();
    if (!batch.length) break;
    out.push(...batch);
    if (page >= Number(r.headers.get("x-wp-totalpages") || 1)) break;
  }
  return out;
}

// Chaves do REDIRECT_MAP em scripts/cloudfront_redirects.py (fonte unica).
function redirectKeys() {
  const py = readFileSync("scripts/cloudfront_redirects.py", "utf8");
  const block = py.match(/REDIRECT_MAP = \{[\s\S]*?\n\}/)[0];
  return new Set([...block.matchAll(/"(\/[^"]*)":\s*"/g)].map((m) => m[1]));
}

// Prefixos de topo que o site novo serve (estaticos + dinamicos).
const KNOWN_PREFIXES = new Set([
  "blog",
  "contato",
  "cursos",
  "professores",
  "quiz",
  "quizzes",
  "sobre",
  "politica-de-privacidade",
  "politicas-de-cancelamento",
  "termos-de-servicos",
]);

const posts = await fetchAll("posts");
const pages = await fetchAll("pages");
const migrated = new Set(
  readdirSync("content/blog")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "")),
);
const redirected = redirectKeys();

console.log(
  `WordPress: ${posts.length} posts + ${pages.length} pages | ` +
    `migrados: ${migrated.size} posts | redirects mapeados: ${redirected.size}\n`,
);

const orphans = [];
for (const item of [...posts, ...pages]) {
  const path = "/" + new URL(item.link).pathname.replace(/^\/|\/$/g, "");
  if (path === "/") continue;
  const top = path.slice(1).split("/")[0];
  if (migrated.has(top) || KNOWN_PREFIXES.has(top) || redirected.has(path)) {
    continue;
  }
  orphans.push({ path, title: item.title.rendered });
}

if (!orphans.length) {
  console.log("Nenhuma URL orfa. Toda pagina indexada tem destino.");
} else {
  console.log(`${orphans.length} URLs sem destino no site novo (vao dar 404):\n`);
  for (const o of orphans) console.log(`  ${o.path.padEnd(58)} ${o.title}`);
}
