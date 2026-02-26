// The top-level response from the products endpoint (search/browse)
export interface UniqloProductsResponse {
  result: {
    items: UniqloProduct[];
    pagination: {
      total: number;
      offset: number;
      limit: number;
    };
  };
  status: string;
}

// Individual product in search/browse results
export interface UniqloProduct {
  productId: string;
  name: string;
  prices: {
    base: {
      value: number;
      currency: { code: string };
    };
    promo?: {
      value: number;
    } | null;
  };
  colors: Array<{
    code: string;
    name: string;
    displayCode: string;
  }>;
  sizes: Array<{
    code: string;
    name: string;
    displayCode: string;
  }>;
  rating?: {
    average: number;
    count: number;
  };
  images: {
    main: Record<string, { image: string }>;
  };
}

// Response from the product detail endpoint
// Note: result IS the product directly, not wrapped in items[]
export interface UniqloProductDetailResponse {
  result: UniqloProductDetail;
  status: string;
}

// Full product detail (extends search product with additional fields)
export interface UniqloProductDetail extends UniqloProduct {
  longDescription?: string;
  composition?: string;
  washingInformation?: string;
  sizeChartUrl?: string;
  countriesOfOrigin?: Array<{ lid: string; code: string }>;
  l2s?: Array<{
    color: { code: string; name: string };
    size: { code: string; name: string };
    sales: boolean;
  }>;
}
