// import * as cheerio from "cheerio";
import { CoinData } from "../../../../types/coinDataTypes";
import { formatNumHandler } from "../../general/formatNumbers/formatNumbers";
import { round, startCase } from "lodash";
import { percentageDifference } from "../../general/percentageDifference/percentageDifference";
import { UserAssetTrack } from "@prisma/client";
import {
  AssetDBTypes,
  BigAssetsDataObjectTypes,
  brsapiCurrencyTypes,
} from "@/types/other";
import { i18n } from "@/app/bot";

export default function oneAssetRateFromTheBigObject(
  userLang: string,
  allAssetsPriceResult: BigAssetsDataObjectTypes,
  userAssetTrack: UserAssetTrack,
  asset: AssetDBTypes
) {
  try {

    const { type, code, enName, faName, currentPrice } = asset;
    let newPrice;
    let lastChange;

    if (type === "CRYPTO") {
      const resultCoin = allAssetsPriceResult.cryptoRateArray.find(
        (obj: CoinData) => obj.symbol.toLowerCase() === code.toLowerCase()
      );
      newPrice = resultCoin!.current_price;
      lastChange = resultCoin!.price_change_percentage_24h;
    } else {
      const assetArray =
        type === "FIAT"
          ? allAssetsPriceResult.currenciesRateArray
          : allAssetsPriceResult.goldsRateArray;
      const currency = assetArray.find(
        (item: brsapiCurrencyTypes) =>
          enName.includes(item.name.toLowerCase()) ||
          faName.includes(item.name.toLowerCase())
      );
      newPrice = currency!.price;
      lastChange = currency!.change_percent;
    }

    const percentage = percentageDifference(newPrice, currentPrice);
    const bigChange = percentage >= userAssetTrack.threshold;
    const enLang = userLang === "en";
    const toman = enLang ? "T" : "تومان";
    const dollar = enLang ? "$" : "دلار";
    const moneySign = type === "CRYPTO" ? dollar : toman;
    const direction = newPrice > currentPrice ? "⬆" : "⬇";

    const resultText = `🚨🚨🚨🚨🚨🚨🚨
    - ${startCase(enLang ? enName[0] : faName[0])}
    📌 ${i18n.fluent.translate(userLang, "price") || "Price"}: ${formatNumHandler(newPrice)} ${moneySign}
    📉 ${i18n.fluent.translate(userLang, "lastPrice") || "Last Price"}: ${formatNumHandler(currentPrice)} ${moneySign}
    📊 ${i18n.fluent.translate(userLang, "recentChange") || "Recent Change"}: ${round(percentage, 2)}% ${direction}
    🗓 ${i18n.fluent.translate(userLang, "sinceYesterday") || "Since Yesterday"}: ${round(lastChange, 2)}% ${lastChange > 0 ? "⬆" : "⬇"}
    
    🔗 /assets
    📜 /menu`;

    return {
      currencyName: enName[0],
      price: newPrice,
      lastChange,
      bigChange,
      resultText,
    };
  } catch {
    return null;
  }
}
