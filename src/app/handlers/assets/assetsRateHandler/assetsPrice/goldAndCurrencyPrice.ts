import { brsapiCurrencyTypes } from "@/types/other";

export default async function goldAndCurrencyPrice() {
  try {
    const response = await fetch(
      `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${process.env!.BRS_API_KEY}`
    );
    const goldAndCurrency = await response.json();
    const currenciesRateArray: brsapiCurrencyTypes[] = goldAndCurrency.currency;
    const goldsRateArray: brsapiCurrencyTypes[] = goldAndCurrency.gold;
    return { currenciesRateArray, goldsRateArray };
  } catch {
    return null;
  }
}
