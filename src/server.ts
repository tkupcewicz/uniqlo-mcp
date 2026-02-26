import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSearchProducts } from './tools/search-products.js';
import { registerGetProduct } from './tools/get-product.js';
import { registerBrowseCategory } from './tools/browse-category.js';
import { registerNewArrivals } from './tools/new-arrivals.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'uniqlo',
    version: '1.0.0',
  });

  registerSearchProducts(server);
  registerGetProduct(server);
  registerBrowseCategory(server);
  registerNewArrivals(server);

  return server;
}
