import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';

const app = createMcpExpressApp({ host: '0.0.0.0' });

// CORS — required for Claude.ai connector
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-protocol-version, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
  if (_req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Stateless POST — new server + transport per request
app.post('/mcp', async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => { transport.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Stateless — no SSE streams or sessions
app.get('/mcp', (_req, res) => { res.status(405).json({ error: 'SSE not supported in stateless mode' }); });
app.delete('/mcp', (_req, res) => { res.status(405).json({ error: 'Session management not supported in stateless mode' }); });

// Health check
app.get('/', (_req, res) => { res.json({ name: 'uniqlo-mcp', version: '1.0.0' }); });

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Uniqlo MCP server listening on http://0.0.0.0:${port}/mcp`);
});
