export interface CoinData {
    id: string; // Coin identifier
    symbol: string; // Coin symbol
    name: string; // Coin name
    image: string; // URL to the coin's image
    current_price: number; // Current price of the coin
    market_cap: number; // Market capitalization
    market_cap_rank: number; // Rank by market capitalization
    fully_diluted_valuation: number; // Fully diluted market capitalization
    total_volume: number; // Total trading volume
    high_24h: number; // Highest price in the last 24 hours
    low_24h: number; // Lowest price in the last 24 hours
    price_change_24h: number; // Price change in the last 24 hours
    price_change_percentage_24h: number; // Price change percentage in the last 24 hours
    market_cap_change_24h: number; // Market cap change in the last 24 hours
    market_cap_change_percentage_24h: number; // Market cap change percentage in the last 24 hours
    circulating_supply: number; // Circulating supply
    total_supply: number; // Total supply
    max_supply: number; // Maximum supply
    ath: number; // All-time high price
    ath_change_percentage: number; // Percentage change from all-time high
    ath_date: string; // Date of all-time high
    atl: number; // All-time low price
    atl_change_percentage: number; // Percentage change from all-time low
    atl_date: string; // Date of all-time low
    roi: null; // Return on investment (null if not applicable)
    last_updated: string; // Last updated timestamp
  }
  