import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2);
const portArgument = args.find((argument) => argument.startsWith('--port='));
const portIndex = args.indexOf('--port');
const requestedPort = portArgument?.slice(7) ?? (portIndex >= 0 ? args[portIndex + 1] : undefined) ?? process.env.PORT ?? '4173';
const port = Number(requestedPort);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Invalid port. Use PORT=4173 or --port 4173 (1–65535).');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return reply(405, 'Method not allowed');
  }

  try {
    const pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
    if (!pathname.startsWith('/') || /[\\\0]/.test(pathname)) return reply(400, 'Invalid path');
    const segments = pathname.split('/');
    if (segments.some((segment) => segment === '..' || segment === '.' || segment.startsWith('.'))) {
      return reply(404, 'Not found');
    }

    const requestedFile = pathname === '/' ? '/index.html' : pathname;
    const isAsset = requestedFile.startsWith('/assets/') && Boolean(types[path.extname(requestedFile).toLowerCase()]);
    if (!['/index.html', '/styles.css', '/script.js'].includes(requestedFile) && !isAsset) {
      return reply(404, 'Not found');
    }

    const file = await realpath(path.join(root, requestedFile.slice(1)));
    const permittedRoot = isAsset ? path.join(root, 'assets') : root;
    if (!file.startsWith(permittedRoot + path.sep)) return reply(404, 'Not found');
    const details = await stat(file);
    if (!details.isFile()) return reply(404, 'Not found');

    response.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': details.size,
      'Cache-Control': 'no-cache',
    });
    if (request.method === 'HEAD') return response.end();
    const stream = createReadStream(file);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    if (error instanceof URIError) return reply(400, 'Invalid path');
    if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) return reply(404, 'Not found');
    console.error('Unable to serve request:', error.message);
    if (!response.headersSent) reply(500, 'Internal server error');
    else response.destroy();
  }
});

server.on('error', (error) => {
  console.error(`Unable to start preview: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`PCL Re preview: http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
