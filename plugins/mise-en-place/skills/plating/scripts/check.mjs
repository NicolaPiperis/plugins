#!/usr/bin/env node
/*
Checks a screen in its frame with Chrome or Edge, without a window: a screenshot in every format, and the page's
console errors.

  node check.mjs --screen <screen.html> --kit <kit folder> --out <check folder> [--formats desktop,tablet,mobile] [--conditions <conditions.json>] [--states <state>,<state>]

--formats names the formats the mockup is designed in; desktop when none is named.
<check folder> is emptied and filled with one PNG per shot, each exactly the format's size:
  each format named, tablet and mobile upright and on their side, with the conditions at their first option;
  the first format once more for every other option of every condition;
  each format named, upright, for every state - a name in the screen's window.mockupStates, whose function
  opens what a click opens: a dialog, a menu, a row in edit.
It prints each shot's file, then the console errors, or "console: clear".
*/
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { composePage, parseFormats } from './compose.mjs';
import { launch, openPage } from './lib/browser.mjs';

const SIZES = {
  desktop: [['desktop', 1600, 900]],
  tablet: [['tablet-upright', 768, 1024], ['tablet-side', 1024, 768]],
  mobile: [['mobile-upright', 390, 844], ['mobile-side', 844, 390]],
};

function hashFor(values, state) {
  const parts = [];
  if (Object.keys(values).length) parts.push('mockup-conditions=' + encodeURIComponent(JSON.stringify(values)));
  if (state) parts.push('mockup-state=' + encodeURIComponent(state));
  return parts.length ? '#' + parts.join('&') : '';
}

async function main() {
  const { values: a } = parseArgs({
    options: {
      screen: { type: 'string' }, kit: { type: 'string' }, out: { type: 'string' },
      formats: { type: 'string' }, conditions: { type: 'string' }, states: { type: 'string' },
    },
  });
  if (!a.screen || !a.kit || !a.out) { console.log('give --screen, --kit and --out'); process.exit(1); }
  const formats = parseFormats(a.formats);
  if (formats.error) { console.log(formats.error); process.exit(1); }

  const out = path.resolve(a.out);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const page = composePage(a.screen, a.kit, true);
  if (page.error) { console.log(page.error); process.exit(1); }
  const pagePath = path.join(out, 'page.html');
  fs.writeFileSync(pagePath, page.text, 'utf8');
  const pageUrl = pathToFileURL(pagePath).href;

  // ---- The shots.
  const first = {};
  const options = [];
  if (a.conditions) {
    const list = JSON.parse(fs.readFileSync(a.conditions, 'utf8'));
    for (const c of list) first[String(c.id)] = String(c.options[0].value);
    for (const c of list) for (const o of c.options.slice(1)) options.push({ id: String(c.id), value: String(o.value) });
  }
  const states = (a.states || '').split(',').map((s) => s.trim()).filter(Boolean);
  const main = SIZES[formats.formats[0]][0];
  const shots = [];
  const addShot = (name, w, h, hash) => shots.push({ name: name.replace(/[^\w-]/g, '_'), w, h, hash });
  for (const f of formats.formats) for (const [name, w, h] of SIZES[f]) addShot(name, w, h, hashFor(first, null));
  for (const o of options) addShot(`${main[0]}-${o.id}-${o.value}`, main[1], main[2], hashFor({ ...first, [o.id]: o.value }, null));
  for (const st of states) for (const f of formats.formats) { const [name, w, h] = SIZES[f][0]; addShot(`${name}-${st}`, w, h, hashFor(first, st)); }

  const browser = await launch();
  if (!browser) { console.log('no browser: neither Chrome nor Edge is installed'); process.exit(2); }
  const errors = new Set();
  try {
    for (const s of shots) {
      const png = path.join(out, `${s.name}.png`);
      const tab = await openPage(browser, pageUrl + s.hash, s.w, s.h, 1500);
      await tab.screenshot(png);
      tab.errors.forEach((e) => errors.add(`${s.name}: ${e}`));
      await tab.close();
      console.log(`shot: ${png}`);
    }
  } finally {
    await browser.close();
  }
  if (errors.size) { console.log('console:'); errors.forEach((e) => console.log(`  ${e}`)); } else { console.log('console: clear'); }
}

main().catch((e) => { console.log(`error: ${e.message}`); process.exit(1); });
