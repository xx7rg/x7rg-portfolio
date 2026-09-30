// Guardrail das superfícies APROVADAS. Sem dependências.
//   npm run check:approved                       confere hashes, arquivos novos em pastas travadas e regras estáticas de CSS
//   npm run check:approved -- --touches a b c    diz quais travas os arquivos tocam (use ANTES de editar; sai com 2 se algum for travado)
//   npm run check:approved -- --update --reason "..." --by "Rogério, AAAA-MM-DD"
//                                                re-baseline SÓ depois de autorização explícita (fica registrado no manifesto)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "docs", "portfolio-approved-baseline.json");
const abs = (p) => path.join(ROOT, p);
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(abs(p))).digest("hex");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

if (!fs.existsSync(MANIFEST)) {
  console.log("SKIP  manifesto interno docs/portfolio-approved-baseline.json não está incluído no repositório público.");
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const isExcluded = (f) => f.startsWith("src/i18n/dictionaries/") || f === "src/i18n/types.ts";

function walk(dir) {
  if (!fs.existsSync(abs(dir))) return [];
  const out = [];
  for (const e of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// arquivo -> travas (como arquivo direto ou como dependência)
const membership = {};
for (const [name, lock] of Object.entries(manifest.locks)) {
  for (const f of lock.files) (membership[f] ??= []).push(`${name}`);
  for (const f of lock.dependencies) (membership[f] ??= []).push(`${name} (dependência)`);
}
const lockedDirs = Object.entries(manifest.locks).flatMap(([name, l]) => l.directories.map((d) => [d, name]));

if (flag("--touches")) {
  const files = args.filter((a) => !a.startsWith("--")).map((f) => f.replaceAll("\\", "/").replace(/^\.\//, ""));
  let locked = 0;
  for (const f of files) {
    const direct = membership[f];
    const inDir = lockedDirs.filter(([d]) => f.startsWith(d + "/")).map(([, n]) => n);
    const hit = [...new Set([...(direct ?? []), ...inDir])];
    if (isExcluded(f)) console.log(`texto/tipos  ${f}  (fora do hash: só adicionar chaves de projeto novo ou corrigir texto autorizado)`);
    else if (hit.length) { locked++; console.log(`TRAVADO      ${f}  <- ${hit.join(", ")}`); }
    else console.log(`livre        ${f}`);
  }
  if (locked) {
    console.log(`\n${locked} arquivo(s) travado(s). PARE: informe arquivo, superfície afetada, motivo e a menor mudança proposta, e ESPERE a autorização explícita de Rogério.`);
    process.exit(2);
  }
  process.exit(0);
}

const problems = [];
const changedFiles = [];
for (const [f, expected] of Object.entries(manifest.hashes)) {
  if (!fs.existsSync(abs(f))) { problems.push({ kind: "REMOVIDO", file: f }); changedFiles.push(f); continue; }
  if (sha(f) !== expected) { problems.push({ kind: "ALTERADO", file: f }); changedFiles.push(f); }
}
const addedFiles = [];
for (const [dir, name] of lockedDirs) {
  for (const f of walk(dir)) if (!(f in manifest.hashes) && !isExcluded(f)) { problems.push({ kind: "ADICIONADO em pasta travada", file: f, lock: name }); addedFiles.push(f); }
}

// Regras estáticas de CSS
const cssFiles = walk("src").filter((f) => f.endsWith(".css"));
const rules = manifest.staticRules;
const ruleProblems = [];
for (const f of cssFiles) {
  const css = fs.readFileSync(abs(f), "utf8");
  const has = (re) => re.test(css);
  if (has(/:global\s*\(/) && !rules.noGlobalSelectorsOutsideGlobalsCss.allowed.includes(f)) ruleProblems.push(`${f}: usa :global(...) (regra: ${rules.noGlobalSelectorsOutsideGlobalsCss.rule})`);
  if (has(/position:\s*fixed/) && !rules.positionFixedAllowlist.allowed.includes(f)) ruleProblems.push(`${f}: position: fixed novo (${rules.positionFixedAllowlist.rule})`);
  if ([...css.matchAll(/z-index:\s*(\d+)/g)].some((m) => Number(m[1]) >= 40) && !rules.highZIndexAllowlist.allowed.includes(f)) ruleProblems.push(`${f}: z-index >= 40 novo (${rules.highZIndexAllowlist.rule})`);
  if (has(/perspective:|preserve-3d/) && !rules.perspectiveAllowlist.allowed.includes(f)) ruleProblems.push(`${f}: perspective/preserve-3d novo (${rules.perspectiveAllowlist.rule})`);
}

if (flag("--update")) {
  const reason = value("--reason"), by = value("--by");
  if (!reason || !by || reason.startsWith("--") || by.startsWith("--")) {
    console.error('--update exige --reason "..." e --by "Rogério, AAAA-MM-DD" (autorização explícita).');
    process.exit(3);
  }
  const touched = [];
  for (const f of changedFiles) {
    if (fs.existsSync(abs(f))) manifest.hashes[f] = sha(f);
    else { delete manifest.hashes[f]; for (const l of Object.values(manifest.locks)) { l.files = l.files.filter((x) => x !== f); l.dependencies = l.dependencies.filter((x) => x !== f); } }
    touched.push(f);
  }
  for (const f of addedFiles) {
    const lockName = problems.find((p) => p.file === f)?.lock;
    manifest.hashes[f] = sha(f);
    if (lockName && !manifest.locks[lockName].files.includes(f)) manifest.locks[lockName].files.push(f);
    touched.push(f);
  }
  manifest.authorizedChanges.push({ files: touched, date: new Date().toISOString().slice(0, 10), by, reason });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Manifesto atualizado (${touched.length} arquivo(s)). Registro: ${by} — ${reason}`);
  process.exit(0);
}

const hashedCount = Object.keys(manifest.hashes).length;
if (problems.length === 0 && ruleProblems.length === 0) {
  const s = manifest.summary;
  console.log(`OK  ${hashedCount} arquivos conferidos (${s.directlyProtectedFiles} diretos + ${s.transitiveOrSharedDependencies} dependências), ${s.locks} travas, regras estáticas de CSS sem violação.`);
  const known = new Set(Object.keys(manifest.hashes));
  const fresh = [...walk("src"), ...walk("public/media")].filter((f) => !known.has(f) && !isExcluded(f) && !/\.css$/.test(f) === true && !lockedDirs.some(([d]) => f.startsWith(d + "/")));
  if (fresh.length) console.log(`   (${fresh.length} arquivo(s) fora de qualquer trava, ex.: ${fresh.slice(0, 3).join(", ")})`);
  process.exit(0);
}

console.error("\n!!! SUPERFÍCIE APROVADA ALTERADA — NÃO PROSSIGA SEM AUTORIZAÇÃO DE ROGÉRIO !!!\n");
for (const p of problems) {
  const locks = [...new Set([...(membership[p.file] ?? []), ...(p.lock ? [p.lock] : [])])];
  console.error(`${p.kind.padEnd(28)} ${p.file}\n${"".padEnd(29)}trava(s): ${locks.join(", ")}`);
}
for (const r of ruleProblems) console.error(`REGRA DE CSS                 ${r}`);
console.error(`\n${problems.length} arquivo(s) e ${ruleProblems.length} regra(s) violados. Depois de autorizado: npm run check:approved -- --update --reason "..." --by "Rogério, AAAA-MM-DD"`);
process.exit(1);
