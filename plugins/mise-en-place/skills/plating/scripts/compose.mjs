#!/usr/bin/env node
/*
Puts a screen into its product's frame, and the page into the mockup viewer: one self-contained HTML file.

  node compose.mjs --screen <screen.html> --kit <kit folder> --out <mockup.html> --title <text> --question <text> [--formats desktop,tablet,mobile] [--conditions <conditions.json>]
  node compose.mjs --screen <screen.html> --kit <kit folder> --out <page.html> --page-only

--page-only writes the page alone, without the viewer: the page reads from the address its conditions, as
#mockup-conditions=<values as JSON>, and a state to open, as mockup-state=<name in window.mockupStates>.

<screen.html> holds the screen only: its markup, its styles and its scripts. The markup and styles go into the
frame's slot, the element marked data-mockup-screen; the scripts go after the frame's own, so window.mockupFrame
is ready when they run. The screen may define window.onMockupConditions(values) to redraw itself when a
condition changes.
--formats names the formats the mockup is designed in, desktop when none is named: the viewer shows only those.
<conditions.json> lists the conditions that change the screen:
  [ { "id": "profile", "label": "Profile", "options": [ { "value": "write", "label": "Write" }, { "value": "read", "label": "Read only" } ] } ]
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const here = path.dirname(fileURLToPath(import.meta.url));
export const FORMATS = ['desktop', 'tablet', 'mobile'];

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// The page: the base's stylesheets, the frame with the screen in its slot, the screen's scripts last.
// Returns { text } or { error }.
export function composePage(screen, kit, pageOnly) {
  let frame = fs.readFileSync(path.join(kit, 'frame.html'), 'utf8');
  // The base is rebuilt whenever the product's stylesheets change, so it joins the frame here, at every page.
  const basePath = path.join(kit, 'base.html');
  if (fs.existsSync(basePath)) {
    const head = /<head(\s[^>]*)?>([\s\S]*)<\/head>/i.exec(fs.readFileSync(basePath, 'utf8'));
    const baseHead = (head ? head[2] : '').replace(/<meta\b[^>]*>|<title>[\s\S]*?<\/title>/gi, '').trim();
    const frameHead = /<head(\s[^>]*)?>/i.exec(frame);
    if (frameHead) {
      const at = frameHead.index + frameHead[0].length;
      frame = frame.slice(0, at) + '\n' + baseHead + '\n' + frame.slice(at);
    } else {
      frame = baseHead + '\n' + frame;
    }
  }
  const slot = /<[a-zA-Z][^>]*\sdata-mockup-screen(?=[\s=>])[^>]*>/.exec(frame);
  if (!slot) return { error: `no slot: ${path.join(kit, 'frame.html')} has no element marked data-mockup-screen` };
  if (frame.lastIndexOf('</body>') < 0) return { error: `no body: ${path.join(kit, 'frame.html')} has no </body>` };

  const screenText = fs.readFileSync(screen, 'utf8');
  const scriptPattern = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  const scripts = (screenText.match(scriptPattern) || []).join('\n');
  const markup = screenText.replace(scriptPattern, '').trim();

  const at = slot.index + slot[0].length;
  let page = frame.slice(0, at) + '\n' + markup + '\n' + frame.slice(at);
  // The address can carry conditions and a state, so a page opened alone shows each of them: the conditions
  // reach the screen at once, the state opens once the page has loaded.
  const fromAddress = '<script>(function(){var m=/[#&]mockup-conditions=([^&]*)/.exec(location.hash);'
    + 'if(m&&window.onMockupConditions)window.onMockupConditions(JSON.parse(decodeURIComponent(m[1])));'
    + 'var s=/[#&]mockup-state=([^&]*)/.exec(location.hash);if(s)window.addEventListener("load",function(){'
    + 'var f=window.mockupStates&&window.mockupStates[decodeURIComponent(s[1])];'
    + 'if(f)f();else console.error("mockup: no state "+decodeURIComponent(s[1]));});})();</script>';
  let end = page.lastIndexOf('</body>');
  page = page.slice(0, end) + scripts + '\n' + fromAddress + '\n' + page.slice(end);
  if (pageOnly) {
    // A page wider than the screen scrolls sideways, which a shot does not show: the console says it, naming
    // the elements where the overflow starts.
    const overflow = '<script>window.addEventListener("load",function(){setTimeout(function(){var w=innerWidth,'
      + 'd=document.documentElement.scrollWidth;if(d<=w+1)return;var out=[];document.querySelectorAll("body *").forEach(function(e){'
      + 'var p=e.parentElement;if(e.getBoundingClientRect().right>w+1&&(!p||p.getBoundingClientRect().right<=w+1))'
      + 'out.push(e.tagName.toLowerCase()+(e.className&&e.className.baseVal===undefined?"."+String(e.className).trim().split(/\\s+/).join("."):""));});'
      + 'console.error("mockup: the page is "+d+"px wide on a "+w+"px screen; it starts at "+out.slice(0,3).join(", "));},300);});</script>';
    end = page.lastIndexOf('</body>');
    page = page.slice(0, end) + overflow + '\n' + page.slice(end);
  }
  return { text: page };
}

export function parseFormats(value) {
  const names = (value || '').split(',').map((f) => f.trim().toLowerCase()).filter(Boolean);
  const list = names.length ? names : ['desktop'];
  const unknown = list.find((f) => !FORMATS.includes(f));
  if (unknown) return { error: `unknown format: ${unknown} (desktop, tablet, mobile)` };
  // In the viewer's order, whatever order they were named in.
  return { formats: FORMATS.filter((f) => list.includes(f)) };
}

function main() {
  const { values: a } = parseArgs({
    options: {
      screen: { type: 'string' }, kit: { type: 'string' }, out: { type: 'string' }, title: { type: 'string' },
      question: { type: 'string' }, formats: { type: 'string' }, conditions: { type: 'string' }, 'page-only': { type: 'boolean' },
    },
  });
  if (!a.screen || !a.kit || !a.out) { console.log('give --screen, --kit and --out'); process.exit(1); }
  const page = composePage(a.screen, a.kit, a['page-only']);
  if (page.error) { console.log(page.error); process.exit(1); }
  fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
  if (a['page-only']) {
    fs.writeFileSync(a.out, page.text, 'utf8');
    console.log(`page: ${a.out}`);
    return;
  }
  if (!a.title || !a.question) { console.log('give --title and --question for the mockup'); process.exit(1); }
  const formats = parseFormats(a.formats);
  if (formats.error) { console.log(formats.error); process.exit(1); }
  const viewer = fs.readFileSync(path.join(here, '..', 'assets', 'viewer.html'), 'utf8');
  // A JSON string, with every "<" written as its escape, can sit inside a script without closing it.
  const pageJson = JSON.stringify(page.text).replace(/</g, '\\u003c');
  const conditionsJson = a.conditions ? fs.readFileSync(a.conditions, 'utf8').trim().replace(/</g, '\\u003c') : '[]';
  const html = viewer
    .split('{{TITLE}}').join(escapeHtml(a.title))
    .split('{{QUESTION}}').join(escapeHtml(a.question))
    .split('{{FORMATS}}').join(JSON.stringify(formats.formats))
    .split('{{CONDITIONS}}').join(conditionsJson)
    .split('{{PAGE}}').join(pageJson);
  fs.writeFileSync(a.out, html, 'utf8');
  console.log(`mockup: ${a.out} (${Math.round(html.length / 1024)} KB)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
