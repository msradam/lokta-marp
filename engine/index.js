'use strict';

const fs = require('fs');
const path = require('path');
const { Marp } = require('@marp-team/marp-core');
const mermaidThemes = require('../mermaid');

// Mermaid is loaded at render time from a pinned CDN (only when a deck has a
// diagram). Fonts are embedded from the repo, so decks stay self-hosted.
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';

// Slide classes with a dark ground: Mermaid uses the dark palette on these.
const DARK = ['invert', 'ink', 'indigo', 'night', 'aubergine', 'cinnabar', 'celadon'];

// Self-hosted fonts, embedded as base64 so a rendered deck carries them with no
// network and no Google Fonts CDN (a GDPR exposure in the EU).
const FONT_FACES = [
  ['Archivo', 400, 'normal', 'archivo-latin-400-normal.woff2'],
  ['Archivo', 500, 'normal', 'archivo-latin-500-normal.woff2'],
  ['Archivo', 700, 'normal', 'archivo-latin-700-normal.woff2'],
  ['Archivo', 800, 'normal', 'archivo-latin-800-normal.woff2'],
  ['Spline Sans Mono', 400, 'normal', 'spline-sans-mono-latin-400-normal.woff2'],
  ['Spline Sans Mono', 500, 'normal', 'spline-sans-mono-latin-500-normal.woff2'],
  ['Spline Sans Mono', 600, 'normal', 'spline-sans-mono-latin-600-normal.woff2'],
  ['Source Serif 4', 400, 'italic', 'source-serif-4-latin-400-italic.woff2'],
  ['Source Serif 4', 500, 'italic', 'source-serif-4-latin-500-italic.woff2'],
  ['Noto Sans JP', 400, 'normal', 'noto-sans-jp-japanese-400-normal.woff2'],
];

let fontCSSCache = null;
function fontCSS() {
  if (fontCSSCache !== null) return fontCSSCache;
  const dir = path.join(__dirname, '..', 'themes', 'fonts');
  const out = [];
  for (const [family, weight, style, file] of FONT_FACES) {
    const p = path.join(dir, file);
    if (!fs.existsSync(p)) continue;
    const data = fs.readFileSync(p).toString('base64');
    out.push(
      `@font-face{font-family:"${family}";font-weight:${weight};font-style:${style};font-display:swap;` +
        `src:url(data:font/woff2;base64,${data}) format("woff2")}`,
    );
  }
  fontCSSCache = out.join('\n');
  return fontCSSCache;
}

function buildMermaidScript() {
  const lightVars = JSON.stringify(mermaidThemes.light.themeVariables);
  const darkVars = JSON.stringify(mermaidThemes.dark.themeVariables);
  return `
<script src="${MERMAID_CDN}"></script>
<script>
(function () {
  var DARK = new Set(${JSON.stringify(DARK)});
  // htmlLabels:false renders labels as native SVG <text>, which rasterizes
  // cleanly when Marp exports to PNG/PDF (foreignObject does not).
  var BASE = { startOnLoad: false, securityLevel: 'loose', flowchart: { curve: 'linear', htmlLabels: true, padding: 14, nodeSpacing: 44, rankSpacing: 56 } };
  var LIGHT_VARS = ${lightVars};
  var DARK_VARS = ${darkVars};
  function sectionIsDark(el) {
    var sec = el.closest('section');
    return sec && Array.from(sec.classList).some(function (c) { return DARK.has(c); });
  }
  async function renderAll() {
    if (typeof mermaid === 'undefined') return;
    // Force the embedded fonts to load before Mermaid measures node boxes,
    // otherwise labels are sized with a fallback font and clip on export.
    if (document.fonts && document.fonts.load) {
      try {
        await Promise.all([
          document.fonts.load('400 16px "Archivo"'),
          document.fonts.load('700 16px "Archivo"'),
          document.fonts.load('400 11px "Spline Sans Mono"'),
        ]);
        await document.fonts.ready;
      } catch (e) {}
    }
    var divs = Array.from(document.querySelectorAll('.mermaid'));
    var light = [], dark = [];
    divs.forEach(function (d) { (sectionIsDark(d) ? dark : light).push(d); });
    var uid = 0;
    async function run(group, vars) {
      if (!group.length) return;
      mermaid.initialize(Object.assign({}, BASE, { theme: 'base', themeVariables: vars }));
      for (var i = 0; i < group.length; i++) {
        try {
          var res = await mermaid.render('lk-' + (uid++), group[i].textContent.trim());
          group[i].innerHTML = res.svg;
        } catch (e) {}
      }
    }
    await run(dark, DARK_VARS);
    await run(light, LIGHT_VARS);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll);
  else renderAll();
})();
</script>`.trim();
}

class LoktaMarp extends Marp {
  constructor(opts) {
    super(opts);
    this._hasMermaid = false;
    const md = this.markdown;
    const defaultFence = md.renderer.rules.fence.bind(md.renderer);
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.info.trim() === 'mermaid') {
        this._hasMermaid = true;
        return `<div class="mermaid">${token.content.trim()}</div>\n`;
      }
      return defaultFence(tokens, idx, options, env, self);
    };
  }

  render(markdown, env) {
    this._hasMermaid = false;
    const result = super.render(markdown, env);
    // Embed the self-hosted fonts in the theme CSS.
    result.css = `${fontCSS()}\n${result.css}`;
    // Inject the Mermaid runtime only when the deck has a diagram.
    if (this._hasMermaid) {
      const script = buildMermaidScript();
      if (/<\/section>\s*<script/.test(result.html)) {
        result.html = result.html.replace(/(<\/section>\s*<script)/, `${script}\n$1`);
      } else {
        result.html += script;
      }
    }
    return result;
  }
}

module.exports = LoktaMarp;
