// Drives a Chromium browser - Chrome or Edge - without a window, through the DevTools protocol on a pipe.
// Nothing to install, and the same on Windows, macOS and Linux: only where the browser lives changes.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ANSWER_MS = 60000;

function candidates() {
  if (process.platform === 'win32') {
    const pf = process.env['ProgramFiles'];
    const pf86 = process.env['ProgramFiles(x86)'];
    const local = process.env['LOCALAPPDATA'];
    return [
      pf86 && path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      pf && path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      pf && path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      pf86 && path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      local && path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    ];
  }
  if (process.platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
  }
  const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'microsoft-edge-stable'];
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  return names.flatMap((n) => dirs.map((d) => path.join(d, n)));
}

export function findBrowser() {
  return candidates().find((c) => c && fs.existsSync(c)) || null;
}

// The browser, or null when neither Chrome nor Edge is installed.
// A browser that does not answer at its first start often answers at the second.
export async function launch() {
  const exe = findBrowser();
  if (!exe) return null;
  try {
    return await start(exe);
  } catch {
    return await start(exe);
  }
}

async function start(exe) {
  // A profile of its own for each run, so runs side by side never share the browser.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'plating-'));
  const child = spawn(exe, [
    '--headless=new', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--remote-debugging-pipe', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const toBrowser = child.stdio[3];
  const fromBrowser = child.stdio[4];
  const pending = new Map();
  const listeners = new Set();
  let id = 0;
  let buffer = '';
  fromBrowser.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    let end;
    while ((end = buffer.indexOf('\0')) >= 0) {
      const message = JSON.parse(buffer.slice(0, end));
      buffer = buffer.slice(end + 1);
      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
      } else {
        listeners.forEach((listen) => listen(message));
      }
    }
  });
  // Every call has ANSWER_MS to be answered, and a browser that closes fails the calls still waiting:
  // a script then ends with its error instead of waiting forever.
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    if (child.exitCode !== null) return reject(new Error('the browser closed'));
    const message = { id: ++id, method, params };
    if (sessionId) message.sessionId = sessionId;
    const timer = setTimeout(() => {
      pending.delete(message.id);
      reject(new Error(`the browser did not answer ${method} within ${ANSWER_MS / 1000} seconds`));
    }, ANSWER_MS);
    pending.set(message.id, {
      resolve: (result) => { clearTimeout(timer); resolve(result); },
      reject: (error) => { clearTimeout(timer); reject(error); },
    });
    toBrowser.write(JSON.stringify(message) + '\0');
  });
  child.once('exit', () => {
    pending.forEach(({ reject }) => reject(new Error('the browser closed')));
    pending.clear();
  });
  const on = (listen) => { listeners.add(listen); return () => listeners.delete(listen); };
  const close = async () => {
    try { await send('Browser.close'); } catch { /* already gone */ }
    await new Promise((resolve) => {
      if (child.exitCode !== null) return resolve();
      child.once('exit', resolve);
      setTimeout(resolve, 5000);
    });
    if (child.exitCode === null) child.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold a file */ }
  };
  // The first call proves the browser answers.
  try {
    await send('Browser.getVersion');
  } catch (error) {
    child.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold a file */ }
    throw new Error(`the browser did not start: ${error.message}`);
  }
  return { send, on, close };
}

// Opens url in a tab of exactly width x height, waits for its load and then settle milliseconds,
// and collects what the page reports as errors: console errors and warnings, and uncaught exceptions.
export async function openPage(browser, url, width, height, settle = 1500) {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => browser.send(method, params, sessionId);
  const errors = [];
  let loaded;
  const onLoad = new Promise((resolve) => { loaded = resolve; });
  const stop = browser.on((message) => {
    if (message.sessionId !== sessionId) return;
    if (message.method === 'Page.loadEventFired') loaded();
    if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'assert'].includes(message.params.type)) {
      errors.push(message.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '));
    }
    if (message.method === 'Runtime.exceptionThrown') {
      const details = message.params.exceptionDetails;
      errors.push((details.exception && details.exception.description) || details.text);
    }
  });
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url });
  await Promise.race([onLoad, new Promise((resolve) => setTimeout(resolve, 30000))]);
  await new Promise((resolve) => setTimeout(resolve, settle));
  return {
    errors,
    evaluate: async (expression) => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value,
    screenshot: async (file) => {
      const { data } = await call('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } });
      fs.writeFileSync(file, Buffer.from(data, 'base64'));
    },
    close: async () => {
      stop();
      try { await browser.send('Target.closeTarget', { targetId }); } catch { /* already closed */ }
    },
  };
}
