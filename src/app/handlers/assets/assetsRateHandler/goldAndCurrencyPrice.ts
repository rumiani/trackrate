import { brsapiCurrencyTypes } from "@/types/other";

export default async function goldAndCurrencyPrice() {
  try {
    const response = await fetch(
      "https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency_v2.json"
    );
    const goldAndCurrency = await response.json();
    const currenciesRateArray:brsapiCurrencyTypes[] = goldAndCurrency.currency;
    const goldsRateArray:brsapiCurrencyTypes[] = goldAndCurrency.gold;
    return { currenciesRateArray, goldsRateArray };
  } catch {
    return null
  }
}
