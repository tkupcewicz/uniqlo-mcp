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
      currency: { currencyCode: string };
    };
    promo?: {
      value: number;
    };
  };
  colors: Array<{
    code: string;
    name: string;
    displayCode: string;
    chipUrl?: string;
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
    main: Record<string, { url: string }>;
  };
  flagList?: string[];
  representativeSKU?: {
    salePrice?: number;
  };
}

// Response from the product detail endpoint
export interface UniqloProductDetailResponse {
  result: {
    items: UniqloProductDetail[];
  };
  status: string;
}

// Full product detail (extends search product with additional fields)
export interface UniqloProductDetail extends UniqloProduct {
  longDescription?: string;
  composition?: string;
  washingDescription?: string;
  sizeChartUrl?: string;
  originCountry?: string;
  l2s?: Array<{
    color: { code: string; name: string };
    size: { code: string; name: string };
    stock?: { statusCode: string }; // "IN_STOCK", "OUT_OF_STOCK"
  }>;
}
