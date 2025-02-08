import { AssetType, AssetTypes } from "@/types/other";

export const goldAssets: AssetTypes[] = [
  {
    enName: ["seke emami", "seke_emami", "/seke_emami"],
    faName: ["سکه امامی", "سکه امام"],
    code: "seke_emami",
    type: AssetType.GOLD,
  },
  {
    enName: ["Seke Bahar Azadi", "seke_bahar_azadi", "/seke_bahar_azadi"],
    faName: ["سکه بهار آزادی", "سکه"],
    code: "seke_bahar_azadi",
    type: AssetType.GOLD,
  },
  {
    enName: ["nim seke", "nim_seke", "/nim_seke"],
    faName: ["نیم سکه", "نیم"],
    code: "nim_seke",
    type: AssetType.GOLD,
  },
  {
    enName: ["ons tala", "ons_tala", "/ons_tala"],
    faName: ["انس طلا", "انس"],
    code: "ons_tala",
    type: AssetType.GOLD,
  },
  {
    enName: ["tala 18 ayar", "tala_18_ayar", "/tala_18_ayar"],
    faName: ["طلای 18 عیار", "طلا"],
    code: "tala_18_ayar",
    type: AssetType.GOLD,
  },
];
export const fiatAssets: AssetTypes[] = [
  {
    enName: [
      "🇺🇸 united states dollar",
      "🇺🇸",
      "united states dollar",
      "dollar",
      "usd",
      "/usd",
    ],
    faName: ["دلار آمریکا", "دلار"],
    code: "usd",
    type: AssetType.FIAT,
  },
  {
    enName: ["🇨🇦 canadian dollar", "🇨🇦", "canadian dollar", "cad", "/cad"],
    faName: ["دلار کانادا"],
    code: "cad",
    type: AssetType.FIAT,
  },
  {
    enName: ["🇪🇺 euro", "🇪🇺", "euro", "eur", "/eur"],
    faName: ["یورو", "يورو"],
    code: "eur",
    type: AssetType.FIAT,
  },
  {
    enName: [
      "🇬🇧 british pound sterling",
      "🇬🇧",
      "british pound sterling",
      "pound sterling",
      "pound",
      "british pound",
      "gbp",
      "/gbp",
    ],
    faName: ["پوند بریتانیا", "پوند انگلیس", "پوند"],
    code: "gbp",
    type: AssetType.FIAT,
  },

  {
    enName: ["🇹🇷 turkish lira", "🇹🇷", "turkish lira", "lira", "try", "try"],
    faName: ["لیر ترکیه", "لیر"],
    code: "try",
    type: AssetType.FIAT,
  },
  {
    enName: ["🇯🇵 japanese yen", "🇯🇵", "japanese yen", "yen", "jpy", "/jpy"],
    faName: ["ین ژاپن", "ین"],
    code: "jpy",
    type: AssetType.FIAT,
  },
  {
    enName: ["🇨🇳 chinese yuan", "🇨🇳", "chinese yuan", "yuan", "cny", "/cny"],
    faName: ["یوان چین", "یوان"],
    code: "cny",
    type: AssetType.FIAT,
  },
  {
    enName: [
      "🇦🇪 united arab emirates dirham",
      "🇦🇪",
      "united arab emirates dirham",
      "dirham",
      "aed",
      "/aed",
    ],
    faName: ["درهم امارات متحده عربی", "درهم", "درهم امارات"],
    code: "aed",
    type: AssetType.FIAT,
  },
];
export const cryptoAssets: AssetTypes[] = [
  {
    enName: ["💵 tether (usdt)","💵","tether (usdt)", "tether", "usdt", "/usdt"],
    faName: ["تتر"],
    code: "usdt",
    type: AssetType.CRYPTO,
  },
  {
    enName: ["฿ bitcoin (btc)","฿","bitcoin (btc)", "bitcoin", "btc", "/btc"],
    faName: ["بیت‌کوین", "بیت کوین", "بیتکوین"],
    code: "btc",
    type: AssetType.CRYPTO,
  },
];
export const allAssets = [...fiatAssets, ...cryptoAssets, ...goldAssets];
