import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

// Simple proxy configuration without complex path patterns
const apiProxy = createProxyMiddleware({
  target: 'http://backend:8000/api',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Backend proxy error:', err.message);
    if (res && !res.headersSent) {
      res.status(500).json({ error: 'Backend service unavailable' });
    }
  },
});

const wsProxy = createProxyMiddleware({
  target: 'ws://rabbitmq:15675',
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => {
    console.error('WebSocket proxy error:', err.message);
  },
});

// Apply proxies
app.use('/api', apiProxy);
app.use('/ws', wsProxy);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
  console.log('Proxy routes configured:');
  console.log('  /api/* -> http://backend:8000/api/*');
  console.log('  /ws -> ws://rabbitmq:15675/ws');
});
