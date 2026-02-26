export interface RegionConfig {
  country: string;
  apiVersion: string;
  lang: string;
  currency: string;
  baseUrl: string;
  categories: Record<string, string>;
}

export const REGIONS: Record<string, RegionConfig> = {
  us: {
    country: "us",
    apiVersion: "v5",
    lang: "en",
    currency: "USD",
    baseUrl: "https://www.uniqlo.com/us/api/commerce/v5/en/products",
    categories: {
      women: "22210",
      men: "22211",
      kids: "22212",
      baby: "22213",
    },
  },
  jp: {
    country: "jp",
    apiVersion: "v5",
    lang: "ja",
    currency: "JPY",
    baseUrl: "https://www.uniqlo.com/jp/api/commerce/v5/ja/products",
    categories: {
      women: "1071",
      men: "1072",
      kids: "1073",
      baby: "1074",
    },
  },
  sg: {
    country: "sg",
    apiVersion: "v3",
    lang: "en",
    currency: "SGD",
    baseUrl: "https://www.uniqlo.com/sg/api/commerce/v3/en/products",
    categories: {
      women: "5855",
      men: "5856",
      kids: "5857",
      baby: "5858",
    },
  },
};

export function getRegionConfig(region?: string): RegionConfig {
  const key = region ?? process.env.UNIQLO_REGION ?? "us";
  const config = REGIONS[key.toLowerCase()];
  if (!config) {
    throw new Error(
      `Invalid region "${key}". Supported regions: ${Object.keys(REGIONS).join(", ")}`
    );
  }
  return config;
}
