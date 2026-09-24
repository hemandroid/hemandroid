// Builds assets/reactor.svg: the arc reactor from hemandroid.me's Core Engine
// section, redrawn for a GitHub README. README images cannot run JavaScript, so
// the anime.js boot is replayed with CSS keyframes and the typed roles with SMIL.
// Geometry, colours and skill levels match components/core-reactor.tsx and
// components/skills.tsx in the Personal-Website repo; edit GROUPS below when
// those change, then run: node scripts/reactor.mjs
import { writeFileSync } from "node:fs";

const HUE = { mobile: "#7091e6", web: "#00b4d8", ai: "#f59e0b", devops: "#2dd4bf" };
const GROUPS = [
  ["mobile", "Mobile", [["Flutter & Dart", 92], ["Android & Kotlin", 96], ["SwiftUI", 60], ["Jetpack Compose", 75], ["Testing", 94]]],
  ["web", "Web & Backend", [["React & Next.js", 92], ["TypeScript", 85], ["Node.js", 75], ["GraphQL", 90], [".NET", 85]]],
  ["ai", "Analytics & AI", [["Claude Code", 96], ["OpenAI API", 75], ["Prompt Eng.", 85], ["Agentic dev", 90], ["Loop Eng.", 75]]],
  ["devops", "DevOps & Cloud", [["Neon DB", 90], ["Firebase & GCP", 80], ["CI/CD", 92], ["Docker", 70], ["Automation", 80]]],
];
const SKILLS = GROUPS.flatMap(([id, label, skills]) => skills.map(([name, level]) => ({ name, level, group: label, hue: HUE[id] })));
const N = SKILLS.length;
if (N !== 20) throw new Error(`geometry assumes 20 skills, got ${N}`);
const ROLES = ["Mobile Architect", "Developer Advocate", "Developer Relations"];

// Reactor space is the site's: centre 310,310 in a 620 square, degrees
// clockwise from twelve o'clock. The stage shifts it right by OX.
const W = 1200, H = 620, C = 310, OX = 24;
const PX = 704, PW = 466; // HUD column
const f = (n) => (+n.toFixed(2)).toString();
const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const arc = (r, a0, a1) => {
  const [x0, y0] = polar(r, a0), [x1, y1] = polar(r, a1);
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
};
const annulus = (r0, r1) =>
  `M${C - r1} ${C}a${r1} ${r1} 0 1 0 ${2 * r1} 0a${r1} ${r1} 0 1 0 ${-2 * r1} 0Z` +
  `M${C - r0} ${C}a${r0} ${r0} 0 1 1 ${2 * r0} 0a${r0} ${r0} 0 1 1 ${-2 * r0} 0Z`;
const tri = (r) => [180, 300, 60].map((a) => polar(r, a).map(f).join(",")).join(" ");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const TOP_ARC = (() => { const [x0, y0] = polar(265, 252), [x1, y1] = polar(265, 108); return `M${f(x0)} ${f(y0)}A265 265 0 1 1 ${f(x1)} ${f(y1)}`; })();
const BOTTOM_ARC = (() => { const [x0, y0] = polar(282, 242), [x1, y1] = polar(282, 118); return `M${f(x0)} ${f(y0)}A282 282 0 0 0 ${f(x1)} ${f(y1)}`; })();

// Timing (seconds). The boot mirrors the site's anime.js timeline; the coil
// lock then steps through all 20 skills, LOCK seconds each, forever.
const LOCK = 2.8, LOCK_AT = 1.4, CYCLE = LOCK * N;
const PY = 300; // panel top
const leader = (i) => {
  const mid = i * 18 + 9;
  const [x, y] = polar(236, mid), [ex, ey] = polar(306, mid), [qx, qy] = polar(306, 100);
  const sweep = ((100 - mid + 540) % 360) - 180 > 0 ? 1 : 0;
  return `M${f(x + OX)} ${f(y)}L${f(ex + OX)} ${f(ey)}A306 306 0 0 ${sweep} ${f(qx + OX)} ${f(qy)}L${PX - 14} ${PY + 84}H${PX}`;
};

const engrave = (href, text) => `
  <text dy="1" text-anchor="middle" fill="#fff" opacity=".7" font-size="24" font-weight="800" letter-spacing="3.4"><textPath href="#${href}" startOffset="50%">${text}</textPath></text>
  <text text-anchor="middle" fill="#2b3036" font-size="24" font-weight="800" letter-spacing="3.4"><textPath href="#${href}" startOffset="50%">${text}</textPath></text>`;

const plate = `
  <path d="${annulus(246, 300)}" fill="url(#brushed)" fill-rule="evenodd" stroke="#5b636b" stroke-width="1.2"/>
  ${Array.from({ length: 31 }, (_, k) => `<circle cx="${C}" cy="${C}" r="${f(250 + k * 1.6)}" fill="none" stroke="${k % 2 ? "#fff" : "#6d757d"}" stroke-opacity=".07"/>`).join("")}
  <circle cx="${C}" cy="${C}" r="299" fill="none" stroke="#fff" stroke-opacity=".6"/>
  ${[251, 255.5, 290.5, 295].map((r) => `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#3b4249" stroke-width=".9" stroke-opacity=".75"/><circle cx="${C}" cy="${C}" r="${r + 0.9}" fill="none" stroke="#fff" stroke-width=".7" stroke-opacity=".8"/>`).join("")}
  ${engrave("top", "PROOF THAT HEMANDROID")}
  ${engrave("bottom", "DRIVES INNOVATION")}
  ${[[270, "MK XIII", -90], [90, "EST. 2013", 90]].map(([deg, label, rot]) => {
    const [x, y] = polar(273, deg);
    return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-weight="700" letter-spacing="1.7" fill="#4a5158" transform="rotate(${rot} ${f(x)} ${f(y)})">${label}</text>`;
  }).join("")}
  <path d="${annulus(236, 247)}" fill="url(#rim)" fill-rule="evenodd"/>
  <circle cx="${C}" cy="${C}" r="236" fill="url(#cavity)"/>
  <circle cx="${C}" cy="${C}" r="212" fill="none" stroke="#7ee8ff" stroke-width="28" filter="url(#soft)" class="flicker"/>`;

const windings = Array.from({ length: 14 }, (_, w) => `<line x1="${C - 13}" y1="${f(C - 226 + w * 2.5)}" x2="${C + 13}" y2="${f(C - 226 + w * 2.5)}"/>`).join("");
const lockDelay = (i) => `animation-delay:${f(LOCK_AT + i * LOCK)}s`;
const coils = SKILLS.map((s, i) => `
  <g class="coil" style="animation-delay:${f(0.35 + i * 0.025)}s" transform="rotate(${i * 18 + 9} ${C} ${C})">
    <rect x="${C - 16}" y="${C - 234}" width="32" height="6" rx="1.5" fill="#2a3139" stroke="#0b0f14"/>
    <rect x="${C - 13}" y="${C - 228}" width="26" height="36" rx="2" fill="url(#copper)" stroke="#4a1f0b" stroke-width=".8"/>
    <use href="#windings"/>
    <rect x="${C - 16}" y="${C - 192}" width="32" height="5" rx="1.5" fill="#2a3139" stroke="#0b0f14"/>
    <rect x="${C - 7}" y="${C - 172}" width="14" height="9" rx="4" fill="#dff9ff" opacity="${f(0.35 + (0.65 * s.level) / 100)}" filter="url(#glow)"/>
    <g class="lock" style="${lockDelay(i)}">
      <rect x="${C - 13}" y="${C - 228}" width="26" height="36" rx="2" fill="#f0a86b" opacity=".55" filter="url(#bloom)"/>
      <rect x="${C - 7}" y="${C - 172}" width="14" height="9" rx="4" fill="#fff" filter="url(#bloom)"/>
    </g>
  </g>`).join("");

const beads = SKILLS.map((s, i) => {
  const a0 = i * 18 + 2.2;
  return `<path d="${arc(181, a0, a0 + 13.6)}" stroke="${s.hue}" stroke-opacity=".15" stroke-width="4" fill="none"/>` +
    `<path class="bead" style="animation-delay:${f(0.7 + i * 0.04)}s" pathLength="1" d="${arc(181, a0, a0 + (13.6 * s.level) / 100)}" stroke="${s.hue}" stroke-width="4" fill="none" filter="url(#glow)"/>`;
}).join("");

const arms = [180, 252, 324, 36, 108].map((deg) => `
  <g transform="rotate(${deg} ${C} ${C})">
    <path d="M${C - 4.5} ${C - 100}Q${C - 5.5} ${C - 128} ${C - 8} ${C - 156}H${C + 8}Q${C + 5.5} ${C - 128} ${C + 4.5} ${C - 100}Z" fill="url(#arm)" stroke="#000" stroke-width=".8" filter="url(#shadow)"/>
    <path d="M${C - 2.5} ${C - 103}Q${C - 3.2} ${C - 128} ${C - 5} ${C - 153}" stroke="#9fb0bf" stroke-opacity=".35" stroke-width=".7" fill="none"/>
  </g>`).join("");

const reactor = `
<g transform="translate(${OX} 0)">
  <circle cx="${C}" cy="${C}" r="300" fill="url(#halo)" opacity=".25" class="breathe"/>
  <g class="boot plate">${plate}</g>
  ${coils}
  ${beads}
  <g class="boot inner">${[[150, 10], [133, 3], [121, 6]].map(([r, w]) => `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#e6fbff" stroke-width="${w}" filter="url(#glow)"/>`).join("")}</g>
  <g class="core">
    <circle cx="${C}" cy="${C}" r="118" fill="url(#halo)" class="breathe"/>
    <circle cx="${C}" cy="${C}" r="96" fill="#0b3b63" stroke="#9fdcff" stroke-opacity=".5" stroke-width="2"/>
    <circle cx="${C}" cy="${C}" r="74" fill="url(#plasma)" class="flicker"/>
  </g>
  <g class="boot spill"><circle cx="${C}" cy="${C}" r="96" fill="url(#halo)" class="spill-pulse"/></g>
  <g class="tri">
    <polygon points="${tri(55)}" fill="none" stroke="#38d6ff" stroke-width="22" stroke-linejoin="round" filter="url(#soft)" class="tri-glow"/>
    <polygon points="${tri(55)}" fill="none" stroke="#8fe6ff" stroke-width="10" stroke-linejoin="round" filter="url(#glow)" opacity=".9"/>
    <polygon points="${tri(55)}" fill="#bff3ff" fill-opacity=".12" stroke="#fff" stroke-width="4.5" stroke-linejoin="round"/>
    <polygon points="${tri(55)}" fill="#fff" stroke="#fff" stroke-width="14" stroke-linejoin="round" filter="url(#bloom)" class="flash"/>
  </g>
  <g class="boot arms">${arms}</g>
</g>`;

// Typed roles, as on the site's "Open to" pill. Each role owns one SLOT of a
// TYPE-second cycle: a clip rect grows one character at a time, holds, then
// deletes. Discrete SMIL values, so every step lands on a whole character, and
// textLength pins each glyph to CW so the caret lines up in any monospace font.
const CW = 10.2, TX = PX + 104, TY = 168, SLOT = 3.6, TYPE = SLOT * ROLES.length;
const roleFrames = (r) => {
  const n = ROLES[r].length, t0 = r * SLOT;
  const typed = Array.from({ length: n }, (_, k) => [t0 + (k + 1) * 0.06, k + 1]);
  const hold = t0 + SLOT - 0.05 - n * 0.025;
  const erased = Array.from({ length: n }, (_, k) => [hold + (k + 1) * 0.025, n - k - 1]);
  return [[0, 0], [t0, 0], ...typed, ...erased];
};
const smil = (frames, map, attr) => {
  const pts = frames.filter(([t], k) => k === 0 || t > frames[k - 1][0]);
  return `<animate attributeName="${attr}" calcMode="discrete" dur="${TYPE}s" begin="0.5s" repeatCount="indefinite" keyTimes="${pts.map(([t]) => f(t / TYPE)).join(";")}" values="${pts.map(([, c]) => map(c)).join(";")}"/>`;
};
const caretFrames = ROLES.flatMap((_, r) => roleFrames(r).slice(r ? 2 : 0));
const typed = `
  <defs>${ROLES.map((_, r) => `<clipPath id="type${r}"><rect x="${TX - 2}" y="${TY - 18}" height="26" width="0">${smil(roleFrames(r), (c) => f(c ? c * CW + 2 : 0), "width")}</rect></clipPath>`).join("")}</defs>
  ${ROLES.map((role, r) => `<text x="${TX}" y="${TY}" clip-path="url(#type${r})" class="mono" font-size="17" font-weight="700" fill="#00b4d8" textLength="${f((role.length - 1) * CW + 10)}" lengthAdjust="spacing">${role}</text>`).join("")}
  <rect x="${TX}" y="${TY - 15}" width="2" height="19" fill="#7ee8ff" class="caret">${smil(caretFrames, (c) => f(TX + c * CW + (c ? 1 : 0)), "x")}</rect>`;

const stats = [["13+", "YEARS"], ["10M+", "DOWNLOADS"], ["40+", "TALKS"], ["7", "ENGINEERS LED"]];
const panel = SKILLS.map((s, i) => `
  <g class="lock" style="${lockDelay(i)}">
    <text x="${PX + 18}" y="${PY + 84}" font-size="20" font-weight="700" letter-spacing=".8" fill="#e9fcff">${esc(s.name.toUpperCase())}</text>
    <text x="${PX + 18}" y="${PY + 132}" font-size="40" font-weight="700" fill="${s.hue}" filter="url(#glow)">${s.level}%</text>
    <text x="${PX + 18}" y="${PY + 156}" class="t dim">${esc(s.group.toUpperCase())} · COIL ${String(i + 1).padStart(2, "0")}/${N}</text>
    <rect x="${PX + 290}" y="${PY + 120}" width="${f((150 * s.level) / 100)}" height="6" fill="${s.hue}"/>
  </g>`).join("");
const legend = GROUPS.map(([id, label, skills], i) => {
  const x = PX + (i % 2) * 244, y = 510 + Math.floor(i / 2) * 28;
  const avg = Math.round(skills.reduce((t, [, l]) => t + l, 0) / skills.length);
  return `<rect x="${x}" y="${y - 8}" width="8" height="8" fill="${HUE[id]}"/><text x="${x + 18}" y="${y}" class="t hud" font-size="10.5">${esc(label.toUpperCase())}</text><text x="${x + 222}" y="${y}" text-anchor="end" class="t" fill="${HUE[id]}">AVG ${avg}</text>`;
}).join("");

const hud = `
<g class="boot ident">
  <text x="${PX}" y="62" class="t hud">MK XIII // EST. 2013 // HYDERABAD, IN</text>
  <text x="${PX}" y="106" font-size="27" font-weight="800" fill="#e9fcff" textLength="${PW}" lengthAdjust="spacing">HEMA SAI CHARAN KOTHAMASU</text>
  <text x="${PX}" y="134" class="t dim">LEAD SOFTWARE ENGINEER · FLUTTER · ANDROID · iOS</text>
  <text x="${PX}" y="${TY}" class="mono" font-size="12" letter-spacing="2.4" fill="#5f8ea3">OPEN TO ▸</text>
  ${typed}
  ${stats.map(([n, l], i) => `<text x="${PX + i * 112}" y="232" font-size="30" font-weight="800" fill="#e9fcff" filter="url(#glow)">${n}</text><text x="${PX + i * 112}" y="252" class="t dim" font-size="9.5" letter-spacing="1.8">${l}</text>`).join("")}
  <line x1="${PX}" y1="274" x2="${PX + PW}" y2="274" stroke="#7ee8ff" stroke-opacity=".2"/>
</g>
<g class="boot readout">
  <path d="M${PX} ${PY}h${PW}v172h-${PW - 20}l-20-20z" fill="rgba(8,30,52,.55)" stroke="#7ee8ff" stroke-opacity=".5"/>
  <text x="${PX + 18}" y="${PY + 26}" class="t hud">CORE OUTPUT</text>
  <text x="${PX + PW - 18}" y="${PY + 26}" text-anchor="end" class="t" fill="#e9fcff">${N} / ${N}</text>
  <line x1="${PX + 18}" y1="${PY + 38}" x2="${PX + PW - 18}" y2="${PY + 38}" stroke="#7ee8ff" stroke-opacity=".25"/>
  <text x="${PX + 18}" y="${PY + 58}" class="t dim">COIL LOCK</text>
  <rect x="${PX + 290}" y="${PY + 120}" width="150" height="6" fill="#7ee8ff" fill-opacity=".12"/>
  ${panel}
  ${legend}
  <text x="${PX}" y="596" class="t hud-strong">▸ HEMANDROID.ME</text>
  <text x="${PX + PW}" y="596" text-anchor="end" class="t dim">${N} COILS · ${GROUPS.length} STACKS</text>
</g>
<g class="boot readout">${SKILLS.map((s, i) => `<path class="lock" style="${lockDelay(i)}" d="${leader(i)}" fill="none" stroke="${s.hue}" stroke-width="1.2"/>`).join("")}</g>`;

// Idle loops are opacity-only with identical 0% and 100% frames, so nothing
// snaps at the loop point. Reduced motion gets the settled reactor, first coil locked.
const css = `
text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
.mono,.t{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
.t{font-size:11px;letter-spacing:2.4px}
.hud{fill:#7ee8ff}.dim{fill:#5f8ea3}.hud-strong{fill:#e9fcff}
.coil,.bead{animation-fill-mode:both;animation-timing-function:cubic-bezier(.33,1,.68,1)}
.plate{animation:fade .6s both}
.ident{animation:fade .6s .1s both}
.coil{animation-name:fade;animation-duration:.26s}
.bead{stroke-dasharray:1;animation-name:draw;animation-duration:.7s}
.core{transform-box:fill-box;transform-origin:center;animation:grow .8s .4s both cubic-bezier(.34,1.56,.64,1)}
.inner,.arms{animation:fade .5s 1.25s both}
.spill{animation:fade .25s 1.9s both}
.tri{transform-box:fill-box;transform-origin:center;animation:ignite 1.15s 1.9s both}
.flash{animation:flash 1.15s 1.9s both}
.readout{animation:fade .5s 1.6s both}
.lock{opacity:0;animation:lock ${CYCLE}s infinite}
.breathe{animation:breathe 5.6s ease-in-out infinite}
.flicker{animation:flicker 4.6s linear infinite}
.tri-glow{animation:tri-glow 3.6s ease-in-out infinite}
.spill-pulse{animation:spill 3.6s ease-in-out infinite}
.caret{animation:blink 1s steps(1) infinite}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes grow{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@keyframes ignite{0%{opacity:0;transform:scale(.9)}22%{opacity:1;transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
@keyframes flash{0%{opacity:0}22%{opacity:.85}100%{opacity:0}}
@keyframes lock{0%,${f(100 / N - 0.01)}%{opacity:1}${f(100 / N)}%,100%{opacity:0}}
@keyframes breathe{0%,100%{opacity:.72}50%{opacity:1}}
@keyframes flicker{0%,100%{opacity:.95}6%{opacity:.8}8%{opacity:1}51%{opacity:.9}54%{opacity:1}}
@keyframes tri-glow{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes spill{0%,100%{opacity:.55}50%{opacity:.8}}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.flash{opacity:0}.lock.first{opacity:1}}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
<title id="title">Hema Sai Charan Kothamasu, Lead Software Engineer</title>
<desc id="desc">An arc reactor with 20 copper coils, one per skill, each lit to its level. 13+ years, 10M+ downloads, 40+ talks, 7 engineers led. Open to Mobile Architect, Developer Advocate and Developer Relations roles.</desc>
<style>${css}</style>
<defs>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="bloom" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="shadow" x="-50%" y="-20%" width="200%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000" flood-opacity=".8"/></filter>
  <linearGradient id="brushed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".25" stop-color="#b9c1c9"/><stop offset=".5" stop-color="#e4e8ec"/><stop offset=".75" stop-color="#9ea7b0"/><stop offset="1" stop-color="#d7dce1"/></linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b949d"/><stop offset=".5" stop-color="#3a4149"/><stop offset="1" stop-color="#9aa3ac"/></linearGradient>
  <radialGradient id="cavity"><stop offset="0" stop-color="#1a6fae"/><stop offset=".45" stop-color="#0d3f6e"/><stop offset=".8" stop-color="#07223d"/><stop offset="1" stop-color="#040f1c"/></radialGradient>
  <linearGradient id="copper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a3616"/><stop offset=".25" stop-color="#d9854a"/><stop offset=".5" stop-color="#f0a86b"/><stop offset=".75" stop-color="#c2632f"/><stop offset="1" stop-color="#6e2f12"/></linearGradient>
  <radialGradient id="plasma"><stop offset="0" stop-color="#7fdcff" stop-opacity=".75"/><stop offset=".55" stop-color="#2a9be0" stop-opacity=".55"/><stop offset="1" stop-color="#0a4f86" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#b8f1ff" stop-opacity=".95"/><stop offset=".4" stop-color="#38d6ff" stop-opacity=".4"/><stop offset="1" stop-color="#38d6ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="stage" gradientUnits="userSpaceOnUse" cx="${C + OX}" cy="${C}" r="560"><stop offset="0" stop-color="#38d6ff" stop-opacity=".14"/><stop offset=".55" stop-color="#38d6ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="floor" gradientUnits="userSpaceOnUse" cx="${W / 2}" cy="${H * 1.3}" r="${W * 0.7}"><stop offset="0" stop-color="#0a285a" stop-opacity=".9"/><stop offset="1" stop-color="#0a285a" stop-opacity="0"/></radialGradient>
  <linearGradient id="arm" gradientUnits="userSpaceOnUse" x1="${C - 9}" y1="0" x2="${C + 9}" y2="0"><stop offset="0" stop-color="#05080c"/><stop offset=".3" stop-color="#2a323b"/><stop offset=".5" stop-color="#3c4652"/><stop offset=".75" stop-color="#161c23"/><stop offset="1" stop-color="#05080c"/></linearGradient>
  <g id="windings" stroke="#5a2610" stroke-opacity=".55" stroke-width=".6">${windings}</g>
  <path id="top" d="${TOP_ARC}" fill="none"/>
  <path id="bottom" d="${BOTTOM_ARC}" fill="none"/>
</defs>
<rect width="${W}" height="${H}" rx="22" fill="#03070f"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#floor)"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#stage)"/>
${reactor}
${hud}
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="21.5" fill="none" stroke="#1e2a44"/>
</svg>
`.replaceAll(`class="lock" style="${lockDelay(0)}"`, `class="lock first" style="${lockDelay(0)}"`);

writeFileSync(new URL("../assets/reactor.svg", import.meta.url), svg);
console.log(`assets/reactor.svg: ${(svg.length / 1024).toFixed(1)} KB`);
