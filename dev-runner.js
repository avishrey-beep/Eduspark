const http = require('http');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

const FRONTEND_DIR = path.resolve(__dirname, 'files (3)');
const BACKEND_DIR = path.resolve(__dirname, 'parakh_backend_code (2)/parakh_backend_code (1)/parakh_backend');
const FRONTEND_PORT = 5500;
const BACKEND_PORT = 4000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 1. Frontend Static Server
const frontendServer = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(FRONTEND_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

frontendServer.listen(FRONTEND_PORT, () => {
  console.log(`[Frontend] Running at http://localhost:${FRONTEND_PORT}`);
});

// 2. Backend Server
const backendProcess = fork(path.join(BACKEND_DIR, 'server.js'), [], {
  cwd: BACKEND_DIR,
  env: { ...process.env, PORT: BACKEND_PORT }
});

backendProcess.on('error', (err) => {
  console.error('[Backend] Error:', err);
});

backendProcess.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`[Backend] Exited with code ${code}`);
  }
});

process.on('SIGINT', () => {
  frontendServer.close();
  backendProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  frontendServer.close();
  backendProcess.kill();
  process.exit();
});
