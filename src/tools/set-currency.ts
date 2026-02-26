import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { setCurrencyOverride, getSupportedCurrencies } from '../config.js';

export function registerSetCurrency(server: McpServer): void {
  server.tool(
    'set_currency',
    'Set the display currency for Uniqlo results. Switches to the best store for that currency. Supported: EUR, GBP, USD, JPY, SGD, SEK, DKK.',
    {
      currency: z.string().describe('Currency code (e.g., "EUR", "GBP", "USD", "PLN")'),
    },
    async (params) => {
      const result = setCurrencyOverride(params.currency);
      if (!result) {
        const supported = getSupportedCurrencies().join(', ');
        return {
          content: [{ type: 'text' as const, text: `Unknown currency "${params.currency.toUpperCase()}". Supported: ${supported}.` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: `Currency set to ${result.currency}. Using ${result.region.toUpperCase()} store. All subsequent requests will show prices in ${result.currency}.`,
        }],
      };
    }
  );
}
