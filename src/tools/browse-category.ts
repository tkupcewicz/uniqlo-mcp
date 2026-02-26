import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getRegionConfig } from '../config.js';
import { UniqloClient } from '../api/client.js';
import { ProductService } from '../services/products.js';
import { formatSearchResults, formatError } from '../services/formatters.js';
import { Category, SortOption } from '../types/domain.js';

export function registerBrowseCategory(server: McpServer): void {
  server.tool(
    'browse_category',
    'Browse Uniqlo products by category',
    {
      category: z.enum(['women', 'men', 'kids', 'baby']).describe('Product category'),
      limit: z.number().min(1).max(100).default(20).describe('Number of results to return'),
      offset: z.number().min(0).default(0).describe('Offset for pagination'),
      sort: z.enum(['relevance', 'price_low', 'price_high', 'new']).optional().describe('Sort order'),
      region: z.string().optional().describe('Region: us, jp, sg, uk, de, fr, it, es, nl, be, se, or dk (default: us or UNIQLO_REGION env)'),
    },
    async (params) => {
      try {
        const config = getRegionConfig(params.region);
        const client = new UniqloClient(config);
        const service = new ProductService(client, config);

        const result = await service.browseCategory(params.category as Category, {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort as SortOption,
        });

        return { content: [{ type: 'text' as const, text: formatSearchResults(result) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: formatError(message) }], isError: true };
      }
    }
  );
}
