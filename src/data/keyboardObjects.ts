export type CategoryKeyboardDataTypes = {
  name: string;
  query: string;
};
export const allCategoriesKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "My assets", query: "category_mylist" },
  { name: "All Assets", query: "category_list" },
  { name: "Price History", query: "category_history" },
];

export const selectAssetsKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "Add Crypto", query: "select_crypto" },
  { name: "Add Fiat", query: "select_fiat" },
  { name: "Add Gold", query: "select_gold" },
  { name: "Remove asset", query: "category_remove" },
];

export const percentageKeyboardData: string[] = [
  "0.3",
  "0.5",
  "1",
  "2",
  "3",
  "5",
];
export const dateRangeArray = [
  {name:"Last 24 hours", date: "24h", range: 24 * 60 * 60 * 1000 },
  {name:"Last Week", date: "week", range: 7 * 24 * 60 * 60 * 1000 },
  {name:"Last Month", date: "month", range: 30 * 24 * 60 * 60 * 1000 },
  {name:"Last Year", date: "year", range: 365 * 24 * 60 * 60 * 1000 },
  {name:"All Times", date: "all", range: null }, // No limit for "all"
];
export const priceHistoryKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "Crypto", query: "history_crypto" },
  { name: "Fiat", query: "history_fiat" },
  { name: "Gold", query: "history_gold" },
];
