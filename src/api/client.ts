import { RegionConfig } from '../config.js';
import { UniqloProductsResponse, UniqloProductDetailResponse } from './types.js';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export class UniqloClient {
  private config: RegionConfig;

  constructor(config: RegionConfig) {
    this.config = config;
  }

  /**
   * Fetch with retry on 5xx errors.
   * Exponential backoff: 1s, 2s, 4s.
   */
  private async fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const headers: Record<string, string> = {
        'User-Agent': USER_AGENT,
      };
      if (this.config.clientId) {
        headers['x-fr-clientid'] = this.config.clientId;
      }

      const response = await fetch(url, { headers });

      if (response.ok) {
        return response;
      }

      if (response.status >= 500 && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // This should never be reached, but satisfies the type checker
    throw new Error('Max retries exceeded');
  }

  /**
   * Search or browse products.
   */
  async searchProducts(params: {
    q?: string;
    limit?: number;
    offset?: number;
    colorCodes?: string;
    sizeCodes?: string;
    priceRange?: string;
    sort?: number;
    path?: string;
    flagCodes?: string;
  }): Promise<UniqloProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params.q !== undefined) searchParams.set('q', params.q);
    if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
    if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
    if (params.colorCodes !== undefined) searchParams.set('colorCodes', params.colorCodes);
    if (params.sizeCodes !== undefined) searchParams.set('sizeCodes', params.sizeCodes);
    if (params.priceRange !== undefined) searchParams.set('priceRange', params.priceRange);
    if (params.sort !== undefined) searchParams.set('sort', String(params.sort));
    if (params.path !== undefined) searchParams.set('path', params.path);
    if (params.flagCodes !== undefined) searchParams.set('flagCodes', params.flagCodes);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${this.config.baseUrl}?${queryString}`
      : this.config.baseUrl;

    const response = await this.fetchWithRetry(url);
    return (await response.json()) as UniqloProductsResponse;
  }

  /**
   * Get product detail by product ID.
   */
  async getProductDetail(productId: string): Promise<UniqloProductDetailResponse> {
    const url = `${this.config.baseUrl}/${productId}/price-groups/00`;
    const response = await this.fetchWithRetry(url);
    return (await response.json()) as UniqloProductDetailResponse;
  }
}
