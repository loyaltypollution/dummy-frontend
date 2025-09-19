const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.map': 'application/json',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain'
};

const root = __dirname;
const echoRoot = path.resolve(__dirname, '..', 'echo-slang');

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url.startsWith('/echo-slang/')) {
    const rel = url.replace('/echo-slang/', '');
    const filePath = path.join(echoRoot, rel);
    return sendFile(res, filePath);
  }
  let filePath = path.join(root, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath += '.html';
  }
  return sendFile(res, filePath);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Dummy frontend running at http://localhost:${port}`);
});
