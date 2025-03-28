import { CoinData } from "@/types/coinDataTypes";
import cryptoPrice from "./cryptoPrice";
import goldAndCurrencyPrice from "./goldAndCurrencyPrice";

export async function allAssetsPrice() {
  const cryptoRateArray: CoinData[] = await cryptoPrice();
  const goldAndCurrencyResult = await goldAndCurrencyPrice();
  const currenciesRateArray = goldAndCurrencyResult?.currenciesRateArray;
  const goldsRateArray = goldAndCurrencyResult?.goldsRateArray;
  if (cryptoRateArray && currenciesRateArray && goldsRateArray) {
    return { cryptoRateArray, currenciesRateArray, goldsRateArray };
  } else {
    return null;
  }
}
