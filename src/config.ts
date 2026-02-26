export interface RegionConfig {
  country: string;
  apiVersion: string;
  lang: string;
  currency: string;
  baseUrl: string;
  clientId?: string;
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
  uk: {
    country: "uk",
    apiVersion: "v5",
    lang: "en",
    currency: "GBP",
    clientId: "uq.gb.web-spa",
    baseUrl: "https://www.uniqlo.com/uk/api/commerce/v5/en/products",
    categories: {
      women: "37267",
      men: "37268",
      kids: "37269",
      baby: "37270",
    },
  },
  de: {
    country: "de",
    apiVersion: "v5",
    lang: "de",
    currency: "EUR",
    clientId: "uq.de.web-spa",
    baseUrl: "https://www.uniqlo.com/de/api/commerce/v5/de/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  fr: {
    country: "fr",
    apiVersion: "v5",
    lang: "fr",
    currency: "EUR",
    clientId: "uq.fr.web-spa",
    baseUrl: "https://www.uniqlo.com/fr/api/commerce/v5/fr/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  it: {
    country: "it",
    apiVersion: "v5",
    lang: "it",
    currency: "EUR",
    clientId: "uq.it.web-spa",
    baseUrl: "https://www.uniqlo.com/it/api/commerce/v5/it/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  es: {
    country: "es",
    apiVersion: "v5",
    lang: "es",
    currency: "EUR",
    clientId: "uq.es.web-spa",
    baseUrl: "https://www.uniqlo.com/es/api/commerce/v5/es/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  nl: {
    country: "nl",
    apiVersion: "v5",
    lang: "en",
    currency: "EUR",
    clientId: "uq.nl.web-spa",
    baseUrl: "https://www.uniqlo.com/nl/api/commerce/v5/en/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  be: {
    country: "be",
    apiVersion: "v5",
    lang: "en",
    currency: "EUR",
    clientId: "uq.be.web-spa",
    baseUrl: "https://www.uniqlo.com/be/api/commerce/v5/en/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  se: {
    country: "se",
    apiVersion: "v5",
    lang: "en",
    currency: "SEK",
    clientId: "uq.se.web-spa",
    baseUrl: "https://www.uniqlo.com/se/api/commerce/v5/en/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
    },
  },
  dk: {
    country: "dk",
    apiVersion: "v5",
    lang: "en",
    currency: "DKK",
    clientId: "uq.dk.web-spa",
    baseUrl: "https://www.uniqlo.com/dk/api/commerce/v5/en/products",
    categories: {
      women: "37608",
      men: "37609",
      kids: "37610",
      baby: "37611",
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
