export type Category = "women" | "men" | "kids" | "baby";

export type SortOption = "relevance" | "price_low" | "price_high" | "new";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  colors: Array<{ code: string; name: string }>;
  sizes: Array<{ code: string; name: string }>;
  rating?: number;
  reviewCount?: number;
  thumbnail?: string;
  tags: string[];
}

export interface SizeAvailability {
  code: string;
  name: string;
  colorCode: string;
  colorName: string;
  inStock: boolean;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  composition?: string;
  careInstructions?: string;
  origin?: string;
  availableSizes: SizeAvailability[];
  images: string[];
  url: string;
}

export interface SearchResult {
  products: ProductSummary[];
  total: number;
  offset: number;
  limit: number;
  query?: string;
  sort?: string;
  region?: string;
}
