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

export default function oneAssetRateFromTheBigObject(
  bigAssetsDataObject: BigAssetsDataObjectTypes,
  userAssetTrack: UserAssetTrack,
  asset: AssetDBTypes
) {
  try {
    if (!asset) throw new Error("Invalid asset data");
    const { type, code, enName, faName, currentPrice } = asset;
    let newPrice;
    let lastChange;

    if (type === "CRYPTO") {
      const resultCoin = bigAssetsDataObject.cryptoRateArray.find(
        (obj: CoinData) => obj.symbol.toLowerCase() === code.toLowerCase()
      );
      newPrice = resultCoin!.current_price;
      lastChange = resultCoin!.price_change_percentage_24h;
    } else {
      const assetArray =
        type === "FIAT"
          ? bigAssetsDataObject.currenciesRateArray
          : bigAssetsDataObject.goldsRateArray;
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
    const moneySign = type === "CRYPTO" ? "$" : "T";
    const direction = newPrice > currentPrice ? "⬆" : "⬇";
    const resultText = `🚨🚨🚨🚨🚨🚨🚨
    - ${startCase(enName[0])}
    📌 Price: ${formatNumHandler(newPrice)} ${moneySign}
    📉 Last Price: ${currentPrice} ${moneySign}
    📊 Recent Change: ${round(percentage, 2)}% ${direction}
    🗓 Since Yesterday: ${lastChange}% ${lastChange > 0 ? "⬆" : "⬇"}
    
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
