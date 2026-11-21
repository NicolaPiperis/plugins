#!/usr/bin/env node
/*
Prints an element of the product as the browser renders it: the built application, served the way the kit's
base was, opened at a route, and the outer HTML of the first element a selector matches - the attributes its
framework adds included.

  node render.mjs --kit <kit folder> --route <path> --selector <css selector> [--width 1600] [--height 900]

The route is the path after the application's root, such as /orders. A route behind a login answers with the
login screen: say so to the user, who can name a route that opens without one.
*/
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { launch, openPage } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';

async function main() {
  const { values: a } = parseArgs({
    options: {
      kit: { type: 'string' }, route: { type: 'string' }, selector: { type: 'string' },
      width: { type: 'string' }, height: { type: 'string' },
    },
  });
  if (!a.kit || !a.selector) { console.log('give --kit and --selector'); process.exit(1); }
  const meta = JSON.parse(fs.readFileSync(path.join(a.kit, 'kit.json'), 'utf8'));
  if (!meta.dist || !fs.existsSync(path.join(meta.dist, 'index.html'))) {
    console.log('no build: the kit\'s build folder is gone; rebuild the base');
    process.exit(1);
  }
  const server = await serve(meta.dist);
  const browser = await launch();
  if (!browser) { await server.close(); console.log('no browser: neither Chrome nor Edge is installed'); process.exit(2); }
  try {
    const route = (a.route || '/').startsWith('/') ? (a.route || '/') : '/' + a.route;
    const tab = await openPage(browser, server.url + route, Number(a.width || 1600), Number(a.height || 900), 2500);
    const html = await tab.evaluate(`(function(){ var e = document.querySelector(${JSON.stringify(a.selector)}); return e ? e.outerHTML : null; })()`);
    const at = await tab.evaluate('location.pathname');
    await tab.close();
    if (html === null) { console.log(`no element: ${a.selector} at ${at}`); process.exit(1); }
    console.log(`route: ${at}`);
    console.log(html);
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((e) => { console.log(`error: ${e.message}`); process.exit(1); });
