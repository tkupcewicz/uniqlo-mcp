import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getRegionConfig } from '../config.js';
import { UniqloClient } from '../api/client.js';
import { ProductService } from '../services/products.js';
import { formatSearchResults, formatError } from '../services/formatters.js';
import { SortOption } from '../types/domain.js';

export function registerSearchProducts(server: McpServer): void {
  server.tool(
    'search_products',
    'Search Uniqlo products by keyword with optional filters',
    {
      query: z.string().describe('Search query (e.g., "heattech", "ultra light down")'),
      limit: z.number().min(1).max(100).default(20).describe('Number of results to return'),
      offset: z.number().min(0).default(0).describe('Offset for pagination'),
      color: z.string().optional().describe('Color code filter (e.g., "COL09")'),
      size: z.string().optional().describe('Size code filter (e.g., "SMA004")'),
      price_min: z.number().optional().describe('Minimum price filter'),
      price_max: z.number().optional().describe('Maximum price filter'),
      sort: z.enum(['relevance', 'price_low', 'price_high', 'new']).optional().describe('Sort order'),
      region: z.string().optional().describe('Region: us, jp, sg, uk, de, fr, it, es, nl, be, se, or dk (default: us or UNIQLO_REGION env)'),
    },
    async (params) => {
      try {
        const config = getRegionConfig(params.region);
        const client = new UniqloClient(config);
        const service = new ProductService(client, config);

        const result = await service.searchProducts(params.query, {
          limit: params.limit,
          offset: params.offset,
          color: params.color,
          size: params.size,
          priceMin: params.price_min,
          priceMax: params.price_max,
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
