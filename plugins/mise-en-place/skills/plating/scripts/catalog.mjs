#!/usr/bin/env node
/*
Reads and writes a kit's catalog: the HTML of the pieces screens are made of, one <template> per piece.

  node catalog.mjs --kit <kit folder> --list
  node catalog.mjs --kit <kit folder> --get <piece>
  node catalog.mjs --kit <kit folder> --add <piece> --source <file> [--html <file>] [--css <file>,<file>]
  node catalog.mjs --kit <kit folder> --missing

--list     every piece, with the file it is copied from.
--get      one piece: its source on the first line, then its HTML.
--add      adds the piece, or replaces it. --source is the repo file the HTML is copied from, or "none" for a piece
           the product does not have; --html is a file holding the piece's HTML, as the browser renders it; --css names
           the files holding the styles the piece needs beyond the base; they are kept in a <style> before the HTML.
--missing  the pieces of the catalog's base that are not there yet, one per line; nothing when it is complete.

A piece name is lowercase letters, digits and dashes: the base names, or the component's own name.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// The base every catalog holds; "grid" is met by grid-<component>, one per grid component the code uses.
const BASE = ['search-panel', 'button-row', 'grid', 'empty-grid', 'editable-row', 'tabs', 'dialog', 'form-fields'];

function catalogPath(kit) { return path.join(kit, 'catalog.html'); }

export function readPieces(kit) {
  const pieces = new Map();
  const file = catalogPath(kit);
  if (!fs.existsSync(file)) return pieces;
  const text = fs.readFileSync(file, 'utf8');
  const pattern = /<template data-piece="([^"]+)" data-source="([^"]*)">\r?\n?([\s\S]*?)\r?\n?<\/template>/g;
  for (const m of text.matchAll(pattern)) pieces.set(m[1], { source: m[2], html: m[3] });
  return pieces;
}

function writePieces(kit, pieces) {
  const lines = ['<!doctype html>', '<meta charset="utf-8">', '<title>Catalog</title>'];
  for (const [name, piece] of pieces) {
    lines.push(`<template data-piece="${name}" data-source="${piece.source}">`, piece.html, '</template>');
  }
  fs.mkdirSync(kit, { recursive: true });
  fs.writeFileSync(catalogPath(kit), lines.join('\n') + '\n', 'utf8');
}

export function missingPieces(kit) {
  const names = [...readPieces(kit).keys()];
  return BASE.filter((b) => (b === 'grid' ? !names.some((n) => /^grid(-|$)/.test(n)) : !names.includes(b)));
}

function main() {
  const { values: a } = parseArgs({
    options: {
      kit: { type: 'string' }, list: { type: 'boolean' }, get: { type: 'string' }, add: { type: 'string' },
      source: { type: 'string' }, html: { type: 'string' }, css: { type: 'string' }, missing: { type: 'boolean' },
    },
  });
  if (!a.kit) { console.log('give --kit'); process.exit(1); }
  const pieces = readPieces(a.kit);

  if (a.list) {
    for (const [name, piece] of pieces) console.log(`${name}\t${piece.source}`);
    return;
  }
  if (a.get) {
    if (!pieces.has(a.get)) { console.log(`no piece: ${a.get}`); process.exit(1); }
    console.log(`source: ${pieces.get(a.get).source}`);
    console.log(pieces.get(a.get).html);
    return;
  }
  if (a.add) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.add)) { console.log(`bad name: ${a.add} (lowercase letters, digits and dashes)`); process.exit(1); }
    if (!a.source || a.source.includes('"')) { console.log('bad source: give the repo file, or none'); process.exit(1); }
    let body = a.html ? fs.readFileSync(a.html, 'utf8').trim() : '';
    if (a.css) {
      const styles = a.css.split(',').map((f) => f.trim()).filter(Boolean).map((f) => fs.readFileSync(f, 'utf8').trim()).join('\n');
      body = `<style>\n${styles}\n</style>\n${body}`;
    }
    if (a.source !== 'none' && !body) { console.log('no html: give --html with the piece as the browser renders it'); process.exit(1); }
    if (/<\/?template/.test(body)) { console.log('bad html: a piece holds no <template> tag'); process.exit(1); }
    pieces.set(a.add, { source: a.source.replace(/\\/g, '/'), html: body });
    writePieces(a.kit, pieces);
    console.log(`added: ${a.add}`);
    return;
  }
  if (a.missing) {
    missingPieces(a.kit).forEach((m) => console.log(m));
    return;
  }
  console.log('give one of --list, --get, --add, --missing');
  process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
