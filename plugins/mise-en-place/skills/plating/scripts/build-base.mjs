#!/usr/bin/env node
/*
The base of a product's mockups: one HTML page holding every stylesheet the application has in the browser once
it has loaded - those its build emits, and those its framework and its component library inject while it runs -
in the order the browser applies them, and nothing in the body. It works for any web frontend that builds to a
folder with an index.html: it builds the project, serves the build, opens it in a browser and reads its styles.

  node build-base.mjs --project <repo> --key <project key> --root <mockup kits folder> [--app <name>] [--dist <build folder>] [--build "<command>"] [--check]
  node build-base.mjs --project <repo> --key <project key> --root <mockup kits folder> [--app <name>] --record [--shell <file>,<file>] [--library <package>,<package>]

--key is the project as the pantry's config/vocabulary/projects.yaml names it.
--app is the application to take when the build leaves more than one index.html.
--dist takes a build already made, instead of building; --build replaces the project's own build command.
The kit lives in <root>/<key>/, or <root>/<key>/<app>/. This script writes base.html, and kit.json with three
prints, one per part of the kit:
  styles   the project's stylesheets, style configuration and dependencies  -> base.html, rebuilt here;
  shell    the files the frame was copied from, as --record --shell names them -> frame.html, written by hand;
  library  the versions of the component libraries, as --record --library names them -> catalog.html, written by hand.

--check brings the kit up to the code and prints its state on the last line:
  same        every part matches the code and the kit is complete;
  missing     no kit, or one an older version of this script built: build it anew, without --check;
  incomplete  the kit lacks what it names: "frame" when frame.html is absent - its shell changed - or has no
              data-mockup-screen slot or no window.mockupFrame; then the catalog's missing base pieces.
  When only the styles changed, it rebuilds base.html itself first, keeping the frame and the catalog.
  When the shell or a library changed, it removes frame.html or catalog.html, which the verdict names.
--record writes into kit.json the shell files and the libraries, once the frame and the catalog are built.
Without --check or --record it builds the base anew and removes the frame and the catalog.
Exit 2: no browser. Exit 3: unsupported, with the reason. Exit 4: choose an app, with the applications listed.
*/
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { missingPieces } from './catalog.mjs';
import { launch, openPage } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';

const KIT_FORMAT = '1';
// Only the web font formats every current browser reads; the older ones would multiply the size.
const FONT_MIME = { '.woff2': 'font/woff2', '.woff': 'font/woff' };
const SKIP_DIRS = new Set(['node_modules', '.git', '.angular', '.next', '.nuxt', '.svelte-kit', '.turbo', '.cache', 'coverage']);
const STYLE_EXT = new Set(['.css', '.scss', '.sass', '.less', '.styl', '.pcss']);
const STYLE_FILES = new Set(['index.html', 'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'angular.json']);
const STYLE_CONFIG = /^(tailwind|postcss|vite|next|nuxt|svelte|webpack|astro|remix|uno)\.config\./;

const { values: a } = parseArgs({
  options: {
    project: { type: 'string' }, key: { type: 'string' }, root: { type: 'string' }, app: { type: 'string' },
    dist: { type: 'string' }, build: { type: 'string' }, shell: { type: 'string' }, library: { type: 'string' },
    record: { type: 'boolean' }, check: { type: 'boolean' },
  },
});
if (!a.project || !a.key || !a.root) { console.log('give --project, --key and --root'); process.exit(1); }
const project = path.resolve(a.project);
let kit = path.join(path.resolve(a.root), a.key.replace(/[\\/]/g, '.'));
if (a.app) kit = path.join(kit, a.app);
const kitJsonPath = path.join(kit, 'kit.json');
const basePath = path.join(kit, 'base.html');
const framePath = path.join(kit, 'frame.html');
const catalogPath = path.join(kit, 'catalog.html');
const rel = (f) => path.relative(project, f).replace(/\\/g, '/');
const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

function walk(dir, skip, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const f = path.join(dir, e.name);
    if (skip.some((s) => f === s)) continue;
    if (e.isDirectory()) walk(f, skip, out); else out.push(f);
  }
  return out;
}

function print(entries) {
  const hash = crypto.createHash('sha256');
  for (const [label, bytes] of entries) { hash.update(`\n${label}\n`); hash.update(bytes); }
  return hash.digest('hex');
}

function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } }

// ---- The three prints.
function stylesPrint(distRoot) {
  const skip = [distRoot, path.join(project, 'dist'), path.join(project, 'build'), path.join(project, 'out')].filter(Boolean);
  const files = walk(project, skip)
    .filter((f) => STYLE_EXT.has(path.extname(f).toLowerCase()) || STYLE_FILES.has(path.basename(f)) || STYLE_CONFIG.test(path.basename(f)))
    .sort();
  return print(files.map((f) => [rel(f), fs.readFileSync(f)]));
}

function shellPrint(shellFiles) {
  return print((shellFiles || []).map((f) => {
    const full = path.join(project, f);
    return [f, fs.existsSync(full) ? fs.readFileSync(full) : Buffer.from('missing')];
  }));
}

function version(name) {
  const lock = readJson(path.join(project, 'package-lock.json'));
  const locked = lock && lock.packages && lock.packages[`node_modules/${name}`];
  if (locked && locked.version) return locked.version;
  const pkg = readJson(path.join(project, 'package.json')) || {};
  const spec = (pkg.dependencies && pkg.dependencies[name]) || (pkg.devDependencies && pkg.devDependencies[name]);
  return spec ? spec.replace(/^[\^~>=<\s]+/, '') : 'absent';
}

function libraryPrint(libraries) {
  return print((libraries || []).map((n) => [n, Buffer.from(`${n}@${version(n)}`)]));
}

function verdict() {
  const lacking = [];
  // The frame offers the screen its slot and the shell's services: a frame without them is not finished.
  const frame = fs.existsSync(framePath) ? fs.readFileSync(framePath, 'utf8') : '';
  if (!/\sdata-mockup-screen(\s|=|>)/.test(frame) || !/window\.mockupFrame\s*=/.test(frame)) lacking.push('frame');
  lacking.push(...missingPieces(kit));
  return lacking.length ? `incomplete: ${lacking.join(', ')}` : 'same';
}

function saveMeta(meta) {
  fs.mkdirSync(kit, { recursive: true });
  fs.writeFileSync(kitJsonPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
}

// ---- The build: the folder holding the application's index.html.
const OUTPUT_DIRS = new Set(['dist', 'build', 'out', 'www']);

function findIndexes(dir) {
  return walk(dir, [path.join(project, 'src'), path.join(project, 'public')])
    .filter((f) => path.basename(f) === 'index.html');
}

function pickIndex(indexes) {
  if (indexes.length === 1) return indexes[0];
  const named = a.app ? indexes.filter((f) => rel(f).split('/').includes(a.app)) : [];
  if (named.length === 1) return named[0];
  console.log(`choose an app: ${indexes.map((f) => rel(path.dirname(f))).join(', ')}`);
  process.exit(4);
}

function buildFolder() {
  if (a.dist) {
    const dist = path.resolve(a.dist);
    const indexes = fs.existsSync(path.join(dist, 'index.html')) ? [path.join(dist, 'index.html')] : findIndexes(dist);
    if (!indexes.length) { console.log(`unsupported: ${dist} holds no index.html`); process.exit(3); }
    return path.dirname(pickIndex(indexes));
  }
  const pkg = readJson(path.join(project, 'package.json'));
  if (!a.build && !(pkg && pkg.scripts && pkg.scripts.build)) {
    console.log('unsupported: the project has no build script in package.json; give --build or --dist');
    process.exit(3);
  }
  const manager = fs.existsSync(path.join(project, 'pnpm-lock.yaml')) ? 'pnpm' : fs.existsSync(path.join(project, 'yarn.lock')) ? 'yarn' : 'npm';
  const command = a.build || `${manager} run build`;
  const before = new Map(findIndexes(project).map((f) => [f, fs.statSync(f).mtimeMs]));
  const run = spawnSync(command, { cwd: project, shell: true, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (run.status !== 0) {
    console.log(`build failed: ${command}`);
    console.log(`${run.stdout || ''}${run.stderr || ''}`.trim().split('\n').slice(-20).join('\n'));
    process.exit(1);
  }
  // What the build wrote: an index.html that is new or changed. A build that copies its files may keep their dates,
  // so the usual output folders count too.
  const after = findIndexes(project);
  let indexes = after.filter((f) => before.get(f) !== fs.statSync(f).mtimeMs);
  if (!indexes.length) indexes = after.filter((f) => OUTPUT_DIRS.has(rel(f).split('/')[0]));
  if (!indexes.length) {
    console.log('unsupported: the build left no index.html; give --dist with the folder of a static build, or build the frame by hand');
    process.exit(3);
  }
  return path.dirname(pickIndex(indexes));
}

// ---- The styles the application has once loaded, read from the browser.
async function readStyles(distRoot) {
  const server = await serve(distRoot);
  const browser = await launch();
  if (!browser) { await server.close(); console.log('no browser: neither Chrome nor Edge is installed'); process.exit(2); }
  try {
    const tab = await openPage(browser, server.url + '/', 1600, 900, 2500);
    const sheets = JSON.parse(await tab.evaluate(`JSON.stringify(Array.from(document.styleSheets).map(function(s){
      var css = null; try { css = Array.from(s.cssRules).map(function(r){ return r.cssText; }).join('\\n'); } catch (e) {}
      return { href: s.href, css: css };
    }))`));
    await tab.close();
    return { sheets, origin: server.url };
  } finally {
    await browser.close();
    await server.close();
  }
}

function fixUrls(css, baseUrl, origin, distRoot) {
  return css.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g, (whole, quote, u) => {
    if (/^(data:|#)/.test(u)) return whole;
    let target;
    try { target = new URL(u, baseUrl); } catch { return "url('data:,')"; }
    if (target.origin !== origin) return `url('${target.href}')`;
    const file = path.join(distRoot, decodeURIComponent(target.pathname));
    const mime = FONT_MIME[path.extname(file).toLowerCase()];
    if (mime && fs.existsSync(file)) return `url('data:${mime};base64,${fs.readFileSync(file).toString('base64')}')`;
    return "url('data:,')";
  });
}

async function buildBase(meta) {
  const distRoot = buildFolder();
  const { sheets, origin } = await readStyles(distRoot);
  const links = [];
  const blocks = [];
  const included = [];
  const skipped = [];
  for (const s of sheets) {
    const label = s.href ? (s.href.startsWith(origin) ? s.href.slice(origin.length) : s.href) : 'inline';
    if (s.css === null) {
      if (s.href) { links.push(`<link rel="stylesheet" href="${s.href}">`); included.push(`${label} (linked)`); } else skipped.push(`${label} (unreadable)`);
      continue;
    }
    blocks.push(`/* ---- ${label} ---- */\n${fixUrls(s.css, s.href || origin + '/', origin, distRoot)}`);
    included.push(label);
  }
  const html = [
    '<!doctype html>', '<html>', '<head>', '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">', '<title>Mockup</title>',
    ...links, '<style>', blocks.join('\n').replace(/<\/style/gi, '<\\/style'), '</style>', '</head>', '<body>',
    '<!-- mockup: page frame and screen -->', '</body>', '</html>', '',
  ].join('\n');
  fs.mkdirSync(kit, { recursive: true });
  fs.writeFileSync(basePath, html, 'utf8');
  const git = spawnSync('git', ['-C', project, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  saveMeta({
    ...meta, key: a.key, app: a.app || null, kitFormat: KIT_FORMAT, project, dist: distRoot,
    version: git.status === 0 ? git.stdout.trim() : null,
    stylesPrint: stylesPrint(distRoot), built: new Date().toISOString(), included, skipped,
  });
  return { html, skipped };
}

async function mainRun() {
  const meta = readJson(kitJsonPath);

  if (a.record) {
    if (!meta) { console.log('missing'); return; }
    if (a.shell !== undefined) { meta.shellFiles = list(a.shell).map((f) => rel(path.resolve(project, f))); meta.shellPrint = shellPrint(meta.shellFiles); }
    if (a.library !== undefined) { meta.libraries = list(a.library); meta.libraryPrint = libraryPrint(meta.libraries); }
    saveMeta(meta);
    console.log('recorded');
    console.log(verdict());
    return;
  }

  if (a.check) {
    if (!meta || meta.kitFormat !== KIT_FORMAT || !fs.existsSync(basePath)) { console.log('missing'); return; }
    // A part whose print moved is cleared, so the verdict names it for rebuilding; the others stay.
    if ((meta.shellFiles || []).length && meta.shellPrint !== shellPrint(meta.shellFiles)) {
      fs.rmSync(framePath, { force: true });
      meta.shellPrint = shellPrint(meta.shellFiles);
    }
    if ((meta.libraries || []).length && meta.libraryPrint !== libraryPrint(meta.libraries)) {
      fs.rmSync(catalogPath, { force: true });
      meta.libraryPrint = libraryPrint(meta.libraries);
    }
    if (meta.stylesPrint === stylesPrint(meta.dist)) { saveMeta(meta); console.log(verdict()); return; }
    // Only the styles moved: rebuild the base, keep the frame and the catalog.
    await buildBase(meta);
    console.log('base: refreshed, the styles changed');
    console.log(verdict());
    return;
  }

  // A kit built anew starts with no frame and no catalog.
  fs.rmSync(framePath, { force: true });
  fs.rmSync(catalogPath, { force: true });
  const { html, skipped } = await buildBase({ shellFiles: [], shellPrint: shellPrint([]), libraries: [], libraryPrint: libraryPrint([]) });
  console.log(`base: ${basePath} (${Math.round(html.length / 1024)} KB)`);
  if (skipped.length) { console.log('skipped:'); skipped.forEach((s) => console.log(`  ${s}`)); }
}

mainRun().catch((e) => { console.log(`error: ${e.message}`); process.exit(1); });
