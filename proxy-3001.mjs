import http from 'http';
import net from 'net';

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:3000'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Forward headers with no-cache hints for HTML to ensure instant updates
    const headers = { ...proxyRes.headers };
    if (req.url && (req.url === '/' || req.url.startsWith('/es') || req.url.startsWith('/en'))) {
      headers['cache-control'] = 'no-store, no-cache, must-revalidate';
    }
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway (Next.js port 3000 not responding): ' + err.message);
  });

  req.pipe(proxyReq);
});

// Full WebSocket upgrade support for Next.js HMR (Hot Module Replacement)
server.on('upgrade', (req, socket, head) => {
  const proxySocket = net.connect(3000, '127.0.0.1', () => {
    proxySocket.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`);
    for (const [key, val] of Object.entries(req.headers)) {
      if (key.toLowerCase() === 'host') {
        proxySocket.write(`Host: 127.0.0.1:3000\r\n`);
      } else if (Array.isArray(val)) {
        for (const v of val) {
          proxySocket.write(`${key}: ${v}\r\n`);
        }
      } else if (val !== undefined) {
        proxySocket.write(`${key}: ${val}\r\n`);
      }
    }
    proxySocket.write('\r\n');
    if (head && head.length > 0) {
      proxySocket.write(head);
    }
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxySocket.on('error', () => {
    socket.destroy();
  });
  socket.on('error', () => {
    proxySocket.destroy();
  });
});

server.listen(3001, '0.0.0.0', () => {
  console.log('✓ Proxy running on 0.0.0.0:3001 -> 127.0.0.1:3000 (with WebSocket/HMR support)');
});
