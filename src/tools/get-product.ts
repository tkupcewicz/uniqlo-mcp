import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getRegionConfig } from '../config.js';
import { UniqloClient } from '../api/client.js';
import { ProductService } from '../services/products.js';
import { formatProductDetail, formatError } from '../services/formatters.js';

export function registerGetProduct(server: McpServer): void {
  server.tool(
    'get_product',
    'Get detailed information about a specific Uniqlo product',
    {
      product_id: z.string().describe('Uniqlo product ID (e.g., "E470988-000")'),
      region: z.string().optional().describe('Region: us, jp, sg, uk, de, fr, it, es, nl, be, se, or dk (default: us or UNIQLO_REGION env)'),
    },
    async (params) => {
      try {
        const config = getRegionConfig(params.region);
        const client = new UniqloClient(config);
        const service = new ProductService(client, config);

        const detail = await service.getProductDetail(params.product_id);

        return { content: [{ type: 'text' as const, text: formatProductDetail(detail) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: formatError(message) }], isError: true };
      }
    }
  );
}
