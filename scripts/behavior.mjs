// Fumaça de COMPORTAMENTO das superfícies aprovadas. Hash de arquivo não pega regressão visual; isto mede o resultado no navegador.
//   npm run dev (ou npm run build + npm run preview) em outro terminal, depois:
//   npm run check:behavior                      (usa http://localhost:3000)
//   BASE=http://localhost:3101 npm run check:behavior
//   npm run check:behavior -- --quick           (menos combinações de caso × tamanho)
//   EDGE_PATH="C:/caminho/msedge.exe" ...       (se o Edge/Chrome não estiver num lugar padrão)
// Sem dependências: Edge/Chrome headless por CDP + WebSocket global do Node.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Conta as entradas reais do catálogo (não a declaração `slug: string` do tipo), para a
// checagem de faixas acompanhar o catálogo em vez de travar num número de projetos desatualizado.
const PROJECT_COUNT = (fs.readFileSync(path.join(ROOT, "src/content/projects.ts"), "utf8").match(/slug: "/g) || []).length;

const BASE = process.env.BASE || "http://localhost:3000";
const QUICK = process.argv.includes("--quick");
const CANDIDATES = [
  process.env.EDGE_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const BROWSER = CANDIDATES.find((p) => fs.existsSync(p));
if (!BROWSER) { console.error("Edge/Chrome não encontrado. Defina EDGE_PATH."); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const race = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r("timeout"), ms))]);
const PORT = 9700 + Math.floor(Math.random() * 200);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "x7rg-behavior-"));
const proc = spawn(BROWSER, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
let cleaned = false;
const cleanup = () => { if (cleaned) return; cleaned = true; try { proc.kill(); } catch {} setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 800); };
process.on("exit", cleanup);

for (let i = 0; i < 60; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(250); } }
const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map(); const waiters = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); if (m.error) rej(new Error(m.error.message)); else res(m.result); }
  else if (m.method) waiters.slice().forEach((w) => w(m));
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const once = (name) => new Promise((res) => { const w = (m) => { if (m.method === name) { waiters.splice(waiters.indexOf(w), 1); res(); } }; waiters.push(w); });
await send("Page.enable"); await send("Runtime.enable");

const view = async (w, h, { mobile = false, reduced = false, touch = false } = {}) => {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
  await send("Emulation.setEmulatedMedia", { features: [
    { name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" },
    { name: "pointer", value: touch ? "coarse" : "fine" },
    { name: "any-pointer", value: touch ? "coarse" : "fine" },
    { name: "hover", value: touch ? "none" : "hover" },
    { name: "any-hover", value: touch ? "none" : "hover" },
  ] });
  await send("Emulation.setTouchEmulationEnabled", touch ? { enabled: true, maxTouchPoints: 1 } : { enabled: false });
};
const open = async (route, settleMs = 2600) => {
  const a = once("Page.loadEventFired"); await send("Page.navigate", { url: "about:blank" }); await a;
  const b = once("Page.loadEventFired"); await send("Page.navigate", { url: BASE + route }); await b;
  await settle(settleMs);
  const slug = new URL(route, BASE).hash.slice(1);
  if (slug) {
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      if (await ev(`document.getElementById(${JSON.stringify(`${slug}-case`)})?.hidden === false`)) break;
      await frame();
      await sleep(100);
    }
  }
};
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { returnByValue: true, awaitPromise: true, expression });
  if (r.exceptionDetails) throw new Error(String(r.exceptionDetails.exception?.description ?? "erro em ev").slice(0, 300));
  return r.result.value;
};
// O Edge headless só avança requestAnimationFrame quando há quadros: capturas minúsculas fazem o papel do monitor.
const frame = () => race(send("Page.captureScreenshot", { format: "jpeg", quality: 5, clip: { x: 0, y: 0, width: 8, height: 8, scale: 1 } }), 3000);
const settle = async (ms) => { const end = Date.now() + ms; while (Date.now() < end) { await frame(); await sleep(30); } };
const mouse = (x, y) => race(send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, pointerType: "mouse" }), 4000);
const key = async (k, code) => { await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: k === "Escape" ? 27 : 0 }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: k === "Escape" ? 27 : 0 }); };
const clickSel = async (sel) => {
  const pt = await ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  if (!pt) throw new Error("sem elemento " + sel);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: pt.x, y: pt.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: pt.x, y: pt.y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: pt.x, y: pt.y, button: "left", clickCount: 1 });
};

let failures = 0, checks = 0;
const check = (group, name, ok, detail = "") => { checks++; if (!ok) failures++; console.log(`${ok ? "PASS" : "FAIL"}  ${group.padEnd(16)} ${name}${detail ? "  — " + detail : ""}`); };

const SLUGS = ["neon-blockfall", "aquacontrol", "feito-pela-bya", "recibo-digital", "checkout", "light-login"];
const UTILITY = `document.querySelector('[class*=utility]:not([class*=Spacer])')`;

async function languageControl() {
  const sizes = [[1440, 900], [1366, 768], [820, 1180], [390, 844], [844, 390]];
  for (const [w, h] of sizes) {
    await view(w, h, { mobile: w < 900 || h < 500 });
    await open("/pt", 2200);
    const r = await ev(`(() => {
      const u = ${UTILITY}; const cs = getComputedStyle(u); const rect = u.getBoundingClientRect();
      const pillEl = document.querySelector('[class*=langMain]');
      const pillCs = getComputedStyle(pillEl); const pillRect = pillEl.getBoundingClientRect();
      const bad = [];
      for (const root of [u, pillEl]) {
        for (let e = root.parentElement; e && e !== document.documentElement; e = e.parentElement) {
          const c = getComputedStyle(e);
          if (c.transform !== 'none' || c.filter !== 'none' || c.perspective !== 'none' || (c.contain && c.contain !== 'none') || c.willChange.includes('transform') || c.backdropFilter !== 'none') bad.push(e.tagName + '.' + String(e.className).slice(-24));
        }
      }
      const alpha = (el) => { const m = /rgba?\\(([^)]+)\\)/.exec(getComputedStyle(el).backgroundColor); if (!m) return 0; const p = m[1].split(/[ ,\\/]+/).filter(Boolean); return p.length > 3 ? +p[3] : 1; };
      const clockEl = u.querySelector('[data-clock]');
      // Fingerprint do NeonBorder (Originkit): suas camadas de brilho usam mix-blend-mode
      // plus-lighter, um valor que nada mais no projeto usa — presença = componente montado.
      const neonPresent = [...pillEl.querySelectorAll('*')].some((e) => getComputedStyle(e).mixBlendMode === 'plus-lighter');
      return {
        pos: cs.position, z: cs.zIndex, top: rect.top, right: cs.right, bad,
        clockA: alpha(clockEl),
        pillPos: pillCs.position, pillZ: pillCs.zIndex, pillTop: Math.round(pillRect.top), pillRight: pillCs.right,
        pillBlur: pillCs.backdropFilter !== 'none', pillShadow: pillCs.boxShadow !== 'none', neonPresent,
      };
    })()`);
    const wantRight = w >= 1100 ? 32 : 16;
    check("idioma", `${w}x${h} relógio: fixo, z 40, canto superior direito`, r.pos === "fixed" && r.z === "40" && r.top >= 19.5 && r.right === `${wantRight}px`, `pos=${r.pos} z=${r.z} top=${r.top} right=${r.right} (esperado ${wantRight}px)`);
    // No desktop a pílula usa left+transform (eixo do dock), não right — só abaixo de 1100px
    // ela é ancorada por right, igual ao relógio.
    const pillPosOk = w >= 1100 ? r.pillPos === "fixed" && r.pillZ === "40" : r.pillPos === "fixed" && r.pillZ === "40" && r.pillRight === `${wantRight}px`;
    check("idioma", `${w}x${h} pílula: fixa, z 40${w >= 1100 ? "" : ", mesma borda direita"}`, pillPosOk, `pos=${r.pillPos} z=${r.pillZ} right=${r.pillRight}${w >= 1100 ? " (desktop usa left, não right)" : ` (esperado ${wantRight}px)`}`);
    check("idioma", `${w}x${h} nenhum ancestral quebra o fixed`, r.bad.length === 0, r.bad.join(", "));
    // Reuso do controle aprovado do desktop em qualquer largura: vidro (--glass) + NeonBorder
    // sempre presentes, não só a partir de 1100px — trocado por instrução explícita de
    // Rogério após reprovar no iPhone físico uma pílula sólida/cinza sem o efeito dourado.
    check("idioma", `${w}x${h} pílula: vidro (legível sobre conteúdo)`, r.pillBlur && r.pillShadow, `blur=${r.pillBlur} shadow=${r.pillShadow}`);
    check("idioma", `${w}x${h} relógio: fundo quase opaco (legível sobre conteúdo)`, r.clockA >= 0.9, `relógio=${r.clockA}`);
    check("idioma", `${w}x${h} NeonBorder dourado presente na pílula`, r.neonPresent, `neonPresent=${r.neonPresent}`);
    const before = await ev(`(() => { const u = ${UTILITY}.getBoundingClientRect(); const p = document.querySelector('[class*=langMain]').getBoundingClientRect(); return [u,p].map((r) => [r.left, r.top, r.width, r.height].map(Math.round).join(',')).join(' | '); })()`);
    await ev(`window.scrollTo(0, 1200)`); await sleep(300);
    const after = await ev(`(() => { const u = ${UTILITY}.getBoundingClientRect(); const p = document.querySelector('[class*=langMain]').getBoundingClientRect(); return [u,p].map((r) => [r.left, r.top, r.width, r.height].map(Math.round).join(',')).join(' | '); })()`);
    check("idioma", `${w}x${h} relógio e pílula não andam com a rolagem`, before === after, `${before} -> ${after}`);
  }
  // Com cada caso aberto (topo do caso, como após o clique), o controle não cobre texto nem mídia do caso.
  const csizes = QUICK ? [[1440, 900], [390, 844]] : [[1440, 900], [1366, 768], [390, 844], [844, 390]];
  for (const [w, h] of csizes) {
    await view(w, h, { mobile: w < 900 || h < 500 });
    const offenders = [];
    for (const s of SLUGS) {
      await open(`/pt#${s}`, 2200);
      const r = await ev(`(() => {
        const cs = document.getElementById('${s}-case'); if (!cs || cs.hidden) return { aberto: false };
        const langEl = document.querySelector('[class*=langMain]');
        const parts = [...${UTILITY}.children, ...(langEl ? [langEl] : [])].map((e) => e.getBoundingClientRect()); const hit = [];
        for (const el of cs.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,button,a,img,video,figure,svg,input,label,[role=group]')) {
          const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue; const st = getComputedStyle(el); if (st.visibility === 'hidden' || +st.opacity === 0) continue;
          for (const p of parts) { if (Math.min(r.right, p.right) - Math.max(r.left, p.left) > 2 && Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top) > 2) { hit.push(el.tagName.toLowerCase() + ':' + (el.innerText || el.alt || '').trim().slice(0, 24)); break; } }
        }
        return { aberto: true, hit };
      })()`);
      if (!r.aberto) offenders.push(`${s}: caso não abriu`);
      else if (r.hit.length) offenders.push(`${s}: ${r.hit.slice(0, 2).join("; ")}`);
    }
    check("idioma+casos", `${w}x${h} 6 casos abertos: sem cobrir conteúdo`, offenders.length === 0, offenders.join(" | "));
  }
  // O idioma novo abre o MESMO projeto.
  await view(1440, 900);
  await open("/pt#light-login", 2600);
  await ev(`document.querySelector('a[hreflang=en]')?.click()`);
  // A transição do App Router precisa de quadros no navegador headless.
  // Aguarde o resultado real em vez de uma pausa fixa sem renderização.
  const navigationDeadline = Date.now() + 15000;
  let loc;
  do {
    await frame();
    await sleep(100);
    loc = await ev(`({ p: location.pathname + location.hash, open: document.getElementById('light-login-case')?.hidden === false })`);
  } while ((loc.p !== "/en#light-login" || !loc.open) && Date.now() < navigationDeadline);
  check("idioma", "trocar PT->EN mantém o projeto aberto", loc.p === "/en#light-login" && loc.open, JSON.stringify(loc));
}

async function badgeShield() {
  await view(1440, 900);
  await open("/pt", 3200);
  const mouseCapabilities = await ev(`matchMedia('(any-hover: hover) and (any-pointer: fine)').matches`);
  check("ambiente", "desktop simula mouse com hover e ponteiro fino", mouseCapabilities);
  const stable = async () => { let last = ""; for (let i = 0; i < 40; i++) { const now = await ev(`(() => { const r = document.querySelector('[class*=shieldSlot]').parentElement.getBoundingClientRect(); return [r.left, r.top, r.width].map((n) => n.toFixed(1)).join(); })()`); if (now === last) return; last = now; await sleep(400); } };
  await stable();
  const c = await ev(`(() => { const s = document.querySelector('[class*=shieldSlot]'); const r = s.parentElement.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, R: r.width / 2, persp: getComputedStyle(s).perspective, slotPE: getComputedStyle(s).pointerEvents, top: (() => { const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return s.parentElement.contains(e); })() }; })()`);
  const tf = () => ev(`document.querySelector('[class*=shieldBody]').style.transform`);
  const parse = (t) => { const g = (re) => { const m = re.exec(t); return m ? m.slice(1).map(Number) : null; }; return { tr: g(/translate3d\(([-\d.]+)px, ([-\d.]+)px, ([-\d.]+)px\)/), rx: g(/rotateX\(([-\d.]+)deg\)/)?.[0], ry: g(/rotateY\(([-\d.]+)deg\)/)?.[0], s: g(/scale\(([-\d.]+)\)/)?.[0] }; };
  const nearNeutral = (t) => {
    const p = parse(t);
    return !!p.tr && Math.abs(p.tr[0]) <= 0.35 && Math.abs(p.tr[1]) <= 0.35 && Math.abs(p.tr[2]) <= 0.8 && Math.abs(p.rx) <= 1 && Math.abs(p.ry) <= 1 && Math.abs(p.s - 1) <= 0.002;
  };
  const live = () => ev(`(() => { const r = document.querySelector('[class*=shieldSlot]').parentElement.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, R: r.width / 2 }; })()`);
  const enter = async (fx, fy) => { await mouse(5, 5); await settle(500); const c = await live(); for (let s = 1; s <= 10; s++) { await mouse(c.x + fx * c.R * s / 10, c.y + fy * c.R * s / 10); await sleep(16); await frame(); } await settle(900); };
  check("selo", "perspectiva 520px, camada do escudo sem pointer-events, nada intercepta o selo", c.persp === "520px" && c.slotPE === "none" && c.top, `perspective=${c.persp} slot=${c.slotPE} topo=selo:${c.top}`);
  await enter(0.6, -0.4);
  let p = parse(await tf());
  check("selo", "mouse fino: gira e translada em direção ao ponteiro", !!p.tr && Math.abs(p.ry - 5.4) < 0.6 && Math.abs(p.rx - 3.2) < 0.6 && Math.abs(p.tr[0] - 1.8) < 0.4 && p.tr[2] === 7 && Math.abs(p.s - 1.014) < 0.001, `rotY=${p.ry} rotX=${p.rx} t=${p.tr} escala=${p.s}`);
  await enter(0.95, 0);
  p = parse(await tf());
  check("selo", "limites: rotateY <= 9°, rotateX <= 8°, translação <= 3px", Math.abs(p.ry) <= 9.05 && Math.abs(p.ry) >= 8 && Math.abs(p.rx) <= 8.05 && Math.abs(p.tr[0]) <= 3.05, `rotY=${p.ry} rotX=${p.rx} tx=${p.tr[0]}`);
  await mouse(5, 5); await settle(1200);
  check("selo", "volta ao neutro ao sair (sem mola)", nearNeutral(await tf()), await tf());
  { const k = await live(); await mouse(k.x + k.R * 0.95, k.y + k.R * 0.95); } await settle(800);
  check("selo", "canto da caixa (fora do círculo) não responde", nearNeutral(await tf()), await tf());
  await mouse(5, 5); await settle(500);
  const ring = await ev(`(() => { const a = document.getAnimations().find((x) => (x.animationName || '').includes('spin')); return a ? { state: a.playState, dur: a.effect.getTiming().duration, t0: a.currentTime } : null; })()`);
  await settle(700);
  const ring2 = await ev(`(() => { const a = document.getAnimations().find((x) => (x.animationName || '').includes('spin')); return a ? a.currentTime : null; })()`);
  check("selo", "anel gira sozinho (18 s) e o tempo avança", !!ring && ring.state === "running" && ring.dur === 18000 && ring2 > ring.t0, JSON.stringify(ring) + ` -> ${ring2}`);

  await view(1440, 900, { reduced: true });
  await open("/pt", 3000);
  const rc = await ev(`(() => { const r = document.querySelector('[class*=shieldSlot]').parentElement.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  for (let s = 1; s <= 8; s++) { await mouse(rc[0] + 40 * s / 8, rc[1] - 20 * s / 8); await sleep(16); await frame(); }
  await settle(700);
  check("selo", "prefers-reduced-motion: escudo parado", (await tf()) === "", JSON.stringify(await tf()));

  await view(390, 844, { mobile: true, touch: true });
  await open("/pt", 3000);
  const coarse = await ev(`matchMedia('(hover: hover) and (pointer: fine)').matches`);
  await ev(`document.querySelector('[class*=shieldSlot]').parentElement.scrollIntoView({block:'center'})`); await sleep(500);
  const cc = await ev(`(() => { const r = document.querySelector('[class*=shieldSlot]').parentElement.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  for (let s = 1; s <= 6; s++) { await mouse(cc[0] + 30 * s / 6, cc[1]); await sleep(16); await frame(); }
  await settle(600);
  check("selo", "toque/ponteiro grosso: escudo parado", coarse === false && (await tf()) === "", `fine=${coarse} transform=${JSON.stringify(await tf())}`);
}

async function strips() {
  for (const [w, h, mobile] of [[1440, 900, false], [1366, 768, false], [820, 1180, false], [390, 844, true]]) {
    await view(w, h, { mobile });
    await open("/pt", 2400);
    const s = await ev(`[...document.querySelectorAll('[data-strip-list] > [data-project]')].map((e) => { const r = e.getBoundingClientRect(); return [r.top + scrollY, r.height]; })`);
    const hs = s.map((x) => x[1]);
    let overlap = 0; for (let i = 1; i < s.length; i++) if (s[i][0] < s[i - 1][0] + s[i - 1][1] - 0.5) overlap++;
    check("faixas", `${w}x${h} ${PROJECT_COUNT} faixas de 92px, sem sobreposição`, s.length === PROJECT_COUNT && hs.every((x) => Math.abs(x - 92) <= 0.6) && overlap === 0, `n=${s.length} alturas=${[...new Set(hs.map((x) => Math.round(x)))].join('/')} sobrepostas=${overlap}`);
  }
  await view(1440, 900);
  await open("/pt", 2400);
  await ev(`document.querySelectorAll('[data-strip-list] > [data-project]')[2].scrollIntoView({block:'center'})`); await sleep(700);
  const pt = await ev(`(() => { const r = document.querySelectorAll('[data-strip-list] > [data-project]')[2].getBoundingClientRect(); return [r.left + r.width / 2, r.top + 40]; })()`);
  await mouse(pt[0], pt[1]); await settle(1400);
  const after = await ev(`[...document.querySelectorAll('[data-strip-list] > [data-project]')].map((e) => { const r = e.getBoundingClientRect(); return [r.top, r.height]; })`);
  let ov = 0; for (let i = 1; i < after.length; i++) if (after[i][0] < after[i - 1][0] + after[i - 1][1] - 0.5) ov++;
  const others = after.filter((_, i) => i !== 2).every((x) => Math.abs(x[1] - 92) <= 0.6);
  check("faixas", "desktop: passar o mouse expande SÓ a faixa ativa para baixo, sem sobrepor", after[2][1] > 100 && others && ov === 0, `ativa=${Math.round(after[2][1])}px outras=92:${others} sobrepostas=${ov}`);
}

async function casesAndViewer() {
  await view(1440, 900);
  await open("/pt#neon-blockfall", 2800);
  let st = await ev(`({ hash: location.hash, open: !document.getElementById('neon-blockfall-case').hidden })`);
  check("casos", "link direto #neon-blockfall abre o caso", st.open && st.hash === "#neon-blockfall", JSON.stringify(st));
  // Abrir pela faixa e percorrer o histórico (o mesmo fluxo aprovado: abrir -> fechar -> avançar -> voltar).
  await open("/pt", 2600);
  await ev(`document.getElementById('neon-blockfall-open').scrollIntoView({block:'center'})`); await sleep(500);
  await ev(`document.getElementById('neon-blockfall-open').click()`); await sleep(1800);
  st = await ev(`({ hash: location.hash, open: !document.getElementById('neon-blockfall-case').hidden })`);
  check("casos", "clicar na faixa abre o caso e põe #neon-blockfall na URL", st.open && st.hash === "#neon-blockfall", JSON.stringify(st));
  await ev(`document.querySelector('#neon-blockfall [class*=caseBar] button').click()`); await sleep(1500);
  st = await ev(`({ hash: location.hash, open: !document.getElementById('neon-blockfall-case').hidden })`);
  check("casos", "Fechar projeto fecha e limpa o hash", !st.open && st.hash === "", JSON.stringify(st));
  await ev(`history.forward()`); await sleep(1400);
  st = await ev(`({ hash: location.hash, open: !document.getElementById('neon-blockfall-case').hidden })`);
  check("casos", "Avançar reabre o caso", st.open && st.hash === "#neon-blockfall", JSON.stringify(st));
  await ev(`history.back()`); await sleep(1400);
  st = await ev(`({ hash: location.hash, open: !document.getElementById('neon-blockfall-case').hidden })`);
  check("casos", "Voltar fecha o caso", !st.open && st.hash === "", JSON.stringify(st));

  await open("/pt#light-login", 2800);
  await ev(`document.querySelector('[data-zoom-id="light.cord"]').scrollIntoView({block:'center'})`); await sleep(600);
  await clickSel('[data-zoom-id="light.cord"]'); await sleep(900);
  const dlg = await ev(`(() => { const d = document.querySelector('dialog[open]'); return { open: !!d, caption: document.getElementById('media-viewer-caption')?.innerText ?? '' }; })()`);
  check("visualizador", "abre com legenda", dlg.open && dlg.caption.length > 5, JSON.stringify(dlg));
  await key("Escape", "Escape"); await sleep(700);
  const back = await ev(`({ open: !!document.querySelector('dialog[open]'), focus: document.activeElement?.getAttribute('data-zoom-id') })`);
  check("visualizador", "Esc fecha e devolve o foco ao gatilho", !back.open && back.focus === "light.cord", JSON.stringify(back));

  await view(390, 844, { mobile: true });
  await open("/pt#light-login", 2800);
  const mob = await ev(`({ open: !document.getElementById('light-login-case').hidden, ow: document.documentElement.scrollWidth - document.documentElement.clientWidth })`);
  check("mobile", "390x844: caso abre e não há rolagem horizontal", mob.open && mob.ow <= 0, JSON.stringify(mob));
}

try {
  console.log(`Base: ${BASE}  Navegador: ${path.basename(BROWSER)}${QUICK ? "  (--quick)" : ""}\n`);
  const t0 = Date.now();
  await languageControl();
  await badgeShield();
  await strips();
  await casesAndViewer();
  console.log(`\n${failures === 0 ? "OK" : "FALHOU"}  ${checks - failures}/${checks} verificações de comportamento (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
} catch (e) {
  failures++;
  console.error("ERRO na verificação:", String(e.stack || e).slice(0, 600));
} finally {
  try { ws.close(); } catch {}
  cleanup();
  process.exitCode = failures ? 1 : 0;
}
