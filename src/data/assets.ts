import { AssetTypes } from "@/types/other";
import { AssetType, TableStatus } from "@prisma/client";

export const goldAssets: AssetTypes[] = [
  {
    enName: ["🇮🇷 seke emami","seke emami", "sekeemami", "/sekeemami"],
    faName: ["سکه امامی", "سکه امام"],
    code: "sekeemami",
    status: TableStatus.ACTIVE,
    type: AssetType.GOLD,
  },
  {
    enName: ["🇮🇷 seke Bahar Azadi","seke Bahar Azadi", "sekebaharazadi", "/sekebaharazadi"],
    faName: ["سکه بهار آزادی", "سکه"],
    code: "sekebaharazadi",
    status: TableStatus.ACTIVE,
    type: AssetType.GOLD,
  },
  {
    enName: ["🇮🇷 nim seke","nim seke", "nimseke", "/nimseke"],
    faName: ["نیم سکه", "نیم"],
    code: "nimseke",
    status: TableStatus.ACTIVE,
    type: AssetType.GOLD,
  },
  {
    enName: ["🇮🇷 ons tala","ons tala","onstala","onse tala", "onsetala", "/onstala"],
    faName: ["انس طلا", "انس"],
    code: "onstala",
    status: TableStatus.ACTIVE,
    type: AssetType.GOLD,
  },
  {
    enName: ["🇮🇷 tala 18 ayar","tala 18 ayar","18 ayar","18","tala", "tala18ayar", "/tala18ayar"],
    faName: ["طلای 18 عیار", "طلا"],
    code: "tala18ayar",
    status: TableStatus.ACTIVE,
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
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },
  {
    enName: ["🇨🇦 canadian dollar", "🇨🇦", "canadian dollar", "cad", "/cad"],
    faName: ["دلار کانادا"],
    code: "cad",
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },
  {
    enName: ["🇪🇺 euro", "🇪🇺", "euro", "eur", "/eur"],
    faName: ["یورو", "يورو"],
    code: "eur",
    status: TableStatus.ACTIVE,
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
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },

  {
    enName: ["🇹🇷 turkish lira", "🇹🇷", "turkish lira", "lira", "try", "try"],
    faName: ["لیر ترکیه", "لیر"],
    code: "try",
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },
  {
    enName: ["🇯🇵 japanese yen", "🇯🇵", "japanese yen", "yen", "jpy", "/jpy"],
    faName: ["ین ژاپن", "ین"],
    code: "jpy",
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },
  {
    enName: ["🇨🇳 chinese yuan", "🇨🇳", "chinese yuan", "yuan", "cny", "/cny"],
    faName: ["یوان چین", "یوان"],
    code: "cny",
    status: TableStatus.ACTIVE,
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
    status: TableStatus.ACTIVE,
    type: AssetType.FIAT,
  },
];
export const cryptoAssets: AssetTypes[] = [
  {
    enName: [
      "💵 tether (USDT)",
      "💵",
      "tether (usdt)",
      "tether",
      "usdt",
      "/usdt",
    ],
    faName: ["تتر"],
    code: "usdt",
    status: TableStatus.ACTIVE,
    type: AssetType.CRYPTO,
  },
  {
    enName: ["฿ bitcoin (BTC)", "฿", "bitcoin (btc)", "bitcoin", "btc", "/btc"],
    faName: ["بیت‌کوین", "بیت کوین", "بیتکوین"],
    code: "btc",
    status: TableStatus.ACTIVE,
    type: AssetType.CRYPTO,
  },
];
export const allAssets = [...fiatAssets, ...cryptoAssets, ...goldAssets];
