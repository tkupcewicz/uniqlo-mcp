import { SearchResult, ProductDetail, ProductSummary } from '../types/domain.js';

export function formatSearchResults(result: SearchResult): string {
  if (result.products.length === 0) {
    return "No products found.";
  }

  const lines: string[] = [];
  lines.push(`**Found ${result.total} products** (showing ${result.offset + 1}-${result.offset + result.products.length})\n`);

  for (const product of result.products) {
    lines.push(formatProductSummary(product));
  }

  if (result.offset + result.products.length < result.total) {
    lines.push(`\n*Use offset=${result.offset + result.products.length} to see more results.*`);
  }

  return lines.join('\n');
}

function formatProductSummary(product: ProductSummary): string {
  const lines: string[] = [];
  lines.push(`### ${product.name}`);

  // Price line
  if (product.originalPrice) {
    lines.push(`**Price**: ~~${product.currency} ${product.originalPrice}~~ ${product.currency} ${product.price}`);
  } else {
    lines.push(`**Price**: ${product.currency} ${product.price}`);
  }

  // Colors
  if (product.colors.length > 0) {
    const colorNames = product.colors.map(c => c.name).join(', ');
    lines.push(`**Colors**: ${colorNames}`);
  }

  // Sizes
  if (product.sizes.length > 0) {
    const sizeNames = product.sizes.map(s => s.name).join(', ');
    lines.push(`**Sizes**: ${sizeNames}`);
  }

  // Rating
  if (product.rating !== undefined) {
    lines.push(`**Rating**: ${product.rating.toFixed(1)}/5 (${product.reviewCount ?? 0} reviews)`);
  }

  // Tags
  if (product.tags.length > 0) {
    lines.push(`**Tags**: ${product.tags.join(', ')}`);
  }

  lines.push(`**ID**: ${product.id}`);
  lines.push(''); // blank line between products

  return lines.join('\n');
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
