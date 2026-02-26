import { SearchResult, ProductDetail, ProductSummary } from '../types/domain.js';

export function formatSearchResults(result: SearchResult): string {
  if (result.products.length === 0) {
    return "No products found.";
  }

  const lines: string[] = [];
  const meta: string[] = [`${result.total} results`];
  if (result.query) meta.push(`"${result.query}"`);
  if (result.region) meta.push(result.region.toUpperCase());
  if (result.sort && result.sort !== 'relevance') meta.push(`sort: ${result.sort}`);
  meta.push(`${result.offset + 1}-${result.offset + result.products.length}`);
  lines.push(`**${meta.join(' · ')}**\n`);

  for (const product of result.products) {
    lines.push(formatProductSummary(product));
  }

  if (result.offset + result.products.length < result.total) {
    lines.push(`\n*Use offset=${result.offset + result.products.length} to see more results.*`);
  }

  return lines.join('\n');
}

function formatProductSummary(product: ProductSummary): string {
  const parts: string[] = [];

  // Price
  if (product.originalPrice) {
    parts.push(`~~${product.originalPrice}~~ **${product.price}** ${product.currency}`);
  } else {
    parts.push(`**${product.price}** ${product.currency}`);
  }

  // Rating
  if (product.rating !== undefined && product.reviewCount) {
    parts.push(`${product.rating.toFixed(1)}/5 (${product.reviewCount})`);
  }

  // Colors count
  if (product.colors.length > 0) {
    parts.push(`${product.colors.length} color${product.colors.length > 1 ? 's' : ''}`);
  }

  // Sizes
  if (product.sizes.length > 0) {
    parts.push(product.sizes.map(s => s.name).join(', '));
  }

  return `- **${product.name}** — ${parts.join(' · ')} \`${product.id}\``;
}

export function formatProductDetail(detail: ProductDetail): string {
  const lines: string[] = [];
  lines.push(`# ${detail.name}\n`);

  // Price
  if (detail.originalPrice) {
    lines.push(`**Price**: ~~${detail.currency} ${detail.originalPrice}~~ ${detail.currency} ${detail.price}`);
  } else {
    lines.push(`**Price**: ${detail.currency} ${detail.price}`);
  }

  // Rating
  if (detail.rating !== undefined) {
    lines.push(`**Rating**: ${detail.rating.toFixed(1)}/5 (${detail.reviewCount ?? 0} reviews)`);
  }

  lines.push(`**Product ID**: ${detail.id}`);
  lines.push(`**URL**: ${detail.url}\n`);

  // Description
  if (detail.description) {
    lines.push(`## Description\n${detail.description}\n`);
  }

  // Composition
  if (detail.composition) {
    lines.push(`## Composition\n${detail.composition}\n`);
  }

  // Care Instructions
  if (detail.careInstructions) {
    lines.push(`## Care Instructions\n${detail.careInstructions}\n`);
  }

  // Origin
  if (detail.origin) {
    lines.push(`**Origin**: ${detail.origin}\n`);
  }

  // Colors
  if (detail.colors.length > 0) {
    lines.push(`## Colors\n${detail.colors.map(c => `- ${c.name} (${c.code})`).join('\n')}\n`);
  }

  // Size Availability (group by color)
  if (detail.availableSizes.length > 0) {
    lines.push(`## Size Availability`);
    // Group by color
    const byColor = new Map<string, typeof detail.availableSizes>();
    for (const s of detail.availableSizes) {
      const key = s.colorName;
      if (!byColor.has(key)) byColor.set(key, []);
      byColor.get(key)!.push(s);
    }
    for (const [colorName, sizes] of byColor) {
      lines.push(`\n**${colorName}**:`);
      for (const s of sizes) {
        const status = s.inStock ? 'In Stock' : 'Out of Stock';
        lines.push(`- ${s.name}: ${status}`);
      }
    }
    lines.push('');
  }

  // Images (just first few)
  if (detail.images.length > 0) {
    lines.push(`## Images`);
    const imageCount = Math.min(detail.images.length, 5);
    for (let i = 0; i < imageCount; i++) {
      lines.push(`- ${detail.images[i]}`);
    }
    if (detail.images.length > 5) {
      lines.push(`- *(${detail.images.length - 5} more images)*`);
    }
    lines.push('');
  }

  // Tags
  if (detail.tags.length > 0) {
    lines.push(`**Tags**: ${detail.tags.join(', ')}`);
  }

  return lines.join('\n');
}

export function formatError(message: string): string {
  return `**Error**: ${message}`;
}
