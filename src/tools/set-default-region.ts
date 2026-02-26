import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { REGIONS, setDefaultRegion, getDefaultRegion, getRegionConfig } from '../config.js';

export function registerSetDefaultRegion(server: McpServer): void {
  server.tool(
    'set_default_region',
    'Set the default Uniqlo region for all subsequent requests. Use country code (e.g., "pl", "de", "eu"). Unsupported countries auto-redirect to EU store.',
    {
      region: z.string().describe('Country code (e.g., "de", "pl", "eu", "uk", "us", "jp")'),
    },
    async (params) => {
      try {
        // Validate the region resolves (either directly or via fallback)
        const { config, fallbackNotice } = getRegionConfig(params.region);
        setDefaultRegion(params.region.toLowerCase());

        const current = getDefaultRegion();
        const availableRegions = Object.keys(REGIONS).join(', ');

        let text = `Default region set to "${current!.toUpperCase()}".\n`;
        text += `Store: uniqlo.com/${config.country} (${config.lang.toUpperCase()}), currency: ${config.currency}.\n`;
        if (fallbackNotice) {
          text += `\n> ${fallbackNotice}\n`;
        }
        text += `\nAll requests without an explicit region will now use this store.\nAvailable regions: ${availableRegions}, eu`;

        return { content: [{ type: 'text' as const, text }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: message }], isError: true };
      }
    }
  );
}
