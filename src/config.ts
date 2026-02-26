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

// In-memory default region, changeable via set_default_region tool.
let defaultRegion: string | undefined;

export function setDefaultRegion(region: string): void {
  defaultRegion = region;
}

export function getDefaultRegion(): string | undefined {
  return defaultRegion;
}

// European country codes that don't have their own Uniqlo store.
// These fall back to the EU (English) store.
const EU_FALLBACK_COUNTRIES = new Set([
  "pl", "at", "ch", "pt", "ie", "fi", "no", "cz", "hu", "ro",
  "bg", "hr", "sk", "si", "lt", "lv", "ee", "lu", "gr", "cy", "mt",
]);

export interface RegionResult {
  config: RegionConfig;
  fallbackNotice?: string;
}

export function getRegionConfig(region?: string): RegionResult {
  const key = (region ?? defaultRegion ?? process.env.UNIQLO_REGION ?? "us").toLowerCase();

  // Direct match
  const config = REGIONS[key];
  if (config) {
    return { config };
  }

  // "eu" alias → UK store (English, ships across Europe)
  if (key === "eu") {
    return {
      config: REGIONS.uk,
      fallbackNotice: "Using the Uniqlo EU store (uniqlo.com/uk) — English language, ships across Europe. Prices in GBP.",
    };
  }

  // European country without its own store → fall back to EU
  if (EU_FALLBACK_COUNTRIES.has(key)) {
    return {
      config: REGIONS.uk,
      fallbackNotice: `Uniqlo does not have a dedicated store for "${key.toUpperCase()}". Using the EU store (uniqlo.com/uk) instead — English language, ships across Europe. Prices in GBP. Available EU stores: ${Object.keys(REGIONS).filter(r => !["us", "jp", "sg"].includes(r)).join(", ").toUpperCase()}.`,
    };
  }

  throw new Error(
    `Invalid region "${key}". Supported regions: ${Object.keys(REGIONS).join(", ")}, eu (European fallback)`
  );
}
