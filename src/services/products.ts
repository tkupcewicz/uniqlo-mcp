import { UniqloClient } from '../api/client.js';
import { RegionConfig } from '../config.js';
import { UniqloProduct, UniqloProductDetail } from '../api/types.js';
import { ProductSummary, ProductDetail, SearchResult, SizeAvailability, Category, SortOption } from '../types/domain.js';

// Map sort option strings to API sort numbers
const SORT_MAP: Record<string, number> = {
  price_low: 2,
  price_high: 3,
  new: 1,
};

export class ProductService {
  private client: UniqloClient;
  private config: RegionConfig;

  constructor(client: UniqloClient, config: RegionConfig) {
    this.client = client;
    this.config = config;
  }

  async searchProducts(query: string, options?: {
    limit?: number;
    offset?: number;
    color?: string;
    size?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: SortOption;
  }): Promise<SearchResult> {
    const priceRange = (options?.priceMin !== undefined || options?.priceMax !== undefined)
      ? `${options?.priceMin ?? 0}-${options?.priceMax ?? 999999}`
      : undefined;

    const response = await this.client.searchProducts({
      q: query,
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      colorCodes: options?.color,
      sizeCodes: options?.size,
      priceRange,
      sort: options?.sort ? SORT_MAP[options.sort] : undefined,
    });

    return {
      products: (response.result?.items ?? []).map(item => this.mapToSummary(item)),
      total: response.result?.pagination?.total ?? 0,
      offset: response.result?.pagination?.offset ?? 0,
      limit: response.result?.pagination?.limit ?? 20,
    };
  }

  async getProductDetail(productId: string): Promise<ProductDetail> {
    const response = await this.client.getProductDetail(productId);
    const item = response.result;
    if (!item) {
      throw new Error(`Product not found: ${productId}`);
    }
    return this.mapToDetail(item, productId);
  }

  async browseCategory(category: Category, options?: {
    limit?: number;
    offset?: number;
    sort?: SortOption;
  }): Promise<SearchResult> {
    const categoryId = this.config.categories[category];
    if (!categoryId) {
      throw new Error(`Unknown category "${category}" for region "${this.config.country}"`);
    }

    const response = await this.client.searchProducts({
      path: categoryId,
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      sort: options?.sort ? SORT_MAP[options.sort] : undefined,
    });

    return {
      products: (response.result?.items ?? []).map(item => this.mapToSummary(item)),
      total: response.result?.pagination?.total ?? 0,
      offset: response.result?.pagination?.offset ?? 0,
      limit: response.result?.pagination?.limit ?? 20,
    };
  }

  async getNewArrivals(category?: Category, options?: {
    limit?: number;
  }): Promise<SearchResult> {
    // SG uses flagCodes, US/JP use sort=1 (new)
    const isSG = this.config.country === "sg";
    const categoryId = category ? this.config.categories[category] : undefined;

    const response = await this.client.searchProducts({
      path: categoryId,
      limit: options?.limit ?? 20,
      offset: 0,
      sort: isSG ? undefined : 1,
      flagCodes: isSG ? "salesStart newSKU" : undefined,
    });

    return {
      products: (response.result?.items ?? []).map(item => this.mapToSummary(item)),
      total: response.result?.pagination?.total ?? 0,
      offset: response.result?.pagination?.offset ?? 0,
      limit: response.result?.pagination?.limit ?? 20,
    };
  }

  private mapToSummary(raw: UniqloProduct): ProductSummary {
    const mainImage = raw.images?.main;
    const firstImageKey = mainImage ? Object.keys(mainImage)[0] : undefined;
    const thumbnail = firstImageKey ? mainImage[firstImageKey]?.image : undefined;

    return {
      id: raw.productId,
      name: raw.name,
      price: raw.prices?.promo?.value ?? raw.prices?.base?.value ?? 0,
      originalPrice: (raw.prices?.promo?.value && raw.prices.promo.value !== raw.prices.base.value)
        ? raw.prices.base.value : undefined,
      currency: raw.prices?.base?.currency?.code ?? this.config.currency,
      colors: (raw.colors ?? []).map(c => ({ code: c.code, name: c.name })),
      sizes: (raw.sizes ?? []).map(s => ({ code: s.code, name: s.name })),
      rating: raw.rating?.average,
      reviewCount: raw.rating?.count,
      thumbnail,
      tags: [],
    };
  }

  private mapToDetail(raw: UniqloProductDetail, productId: string): ProductDetail {
    const summary = this.mapToSummary(raw);

    // Extract all image URLs from images.main
    const images: string[] = [];
    if (raw.images?.main) {
      for (const key of Object.keys(raw.images.main)) {
        const url = raw.images.main[key]?.image;
        if (url) images.push(url);
      }
    }

    // Map l2s to SizeAvailability
    const availableSizes: SizeAvailability[] = (raw.l2s ?? []).map(l2 => ({
      code: l2.size.code,
      name: l2.size.name,
      colorCode: l2.color.code,
      colorName: l2.color.name,
      inStock: l2.sales,
    }));

    const productUrl = `https://www.uniqlo.com/${this.config.country}/en/products/${productId}`;

    // Extract origin from countriesOfOrigin array
    const origin = raw.countriesOfOrigin?.map(c => c.code).join(', ');

    return {
      ...summary,
      description: raw.longDescription,
      composition: raw.composition,
      careInstructions: raw.washingInformation,
      origin,
      availableSizes,
      images,
      url: productUrl,
    };
  }
}
