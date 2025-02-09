export default async function cryptoPrice() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    const cryptosRateArray = await res.json();
    return cryptosRateArray;
  } catch {
    return null;
  }
}
