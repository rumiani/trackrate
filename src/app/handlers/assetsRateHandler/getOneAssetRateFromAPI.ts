import { CoinData } from "../../../types/coinDataTypes";
import { formatNumHandler } from "../general/formatNumbers";
import { brsapiCurrencyTypes } from "@/types/other";
import { capitalize } from "lodash";
import { getAsset } from "./getAsset";
import cryptoPrice from "./cryptoPrice";
import goldAndCurrencyPrice from "./goldAndCurrencyPrice";

export default async function getOneAssetRateFromAPI(asset: string) {
  try {
    const assetObject = await getAsset(asset);

    let price;
    let lastChange;
    if (assetObject!.type === "CRYPTO") {
      const resObj = await cryptoPrice();
      const resultCoin = resObj.find(
        (obj: CoinData) =>
          obj.symbol.toLowerCase() === assetObject!.code.toLowerCase()
      );
      price = resultCoin.current_price;
      lastChange = resultCoin.price_change_percentage_24h;
    } else {
      const goldAndCurrencyResult = await goldAndCurrencyPrice();
      if (goldAndCurrencyResult === undefined) return null;
      const assetArray =
        assetObject?.type === "FIAT"
          ? goldAndCurrencyResult!.currenciesRateArray
          : goldAndCurrencyResult!.goldsRateArray;
      const currency = assetArray.find(
        (asset: brsapiCurrencyTypes) =>
          assetObject?.enName.includes(asset.name.toLowerCase()) ||
          assetObject?.faName.includes(asset.name.toLowerCase())
      );
      price = currency!.price;
      lastChange = currency!.change_percent;
    }

    const bigChange = Math.abs(parseFloat(lastChange)) >= 1;

    const resultText = `- ${capitalize(
      assetObject!.enName[0]
    )}\nPrice: ${formatNumHandler(price)} ${
      assetObject!.type === "CRYPTO" ? "$" : "T"
    }\nSince yesterday: ${lastChange} % ${
      lastChange > 0 ? "⬆" : "⬇"
    }\n/assets\n/menu`;

    return {
      currencyName: assetObject!.enName[0],
      price: price,
      lastChange,
      bigChange,
      resultText,
    };
  } catch {
    return null;
  }
}
