// Serves a built application from its folder on a free local port, the way a static host would:
// a path with no file behind it and no extension gets index.html, so the application's own router answers.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.map': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

export function serve(folder) {
  const root = path.resolve(folder);
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const wanted = decodeURIComponent(new URL(req.url, 'http://local').pathname);
      let file = path.resolve(root, '.' + wanted);
      if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) {
        if (path.extname(wanted)) { res.writeHead(404); res.end(); return; }
        file = path.join(root, 'index.html');
      }
      res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        root,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}
