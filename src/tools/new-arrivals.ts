import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getRegionConfig } from '../config.js';
import { UniqloClient } from '../api/client.js';
import { ProductService } from '../services/products.js';
import { formatSearchResults, formatError } from '../services/formatters.js';
import { Category } from '../types/domain.js';

export function registerNewArrivals(server: McpServer): void {
  server.tool(
    'new_arrivals',
    'Get latest new arrivals from Uniqlo',
    {
      category: z.enum(['women', 'men', 'kids', 'baby']).optional().describe('Filter by category'),
      limit: z.number().min(1).max(100).default(20).describe('Number of results to return'),
      region: z.string().optional().describe('Region: us, jp, or sg (default: us or UNIQLO_REGION env)'),
    },
    async (params) => {
      try {
        const config = getRegionConfig(params.region);
        const client = new UniqloClient(config);
        const service = new ProductService(client, config);

        const result = await service.getNewArrivals(params.category as Category | undefined, {
          limit: params.limit,
        });

        return { content: [{ type: 'text' as const, text: formatSearchResults(result) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: formatError(message) }], isError: true };
      }
    }
  );
}
