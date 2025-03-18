import { MyContext } from "@/app/bot";

export type CategoryKeyboardDataTypes = {
  name: string;
  query: string;
};

export const allCategoriesKeyboardData = (
  ctx: MyContext
): CategoryKeyboardDataTypes[] => [
  { name: ctx.t("myAssets"), query: "category_mylist" },
  { name: ctx.t("allAssets"), query: "category_list" },
  { name: ctx.t("priceHistory"), query: "category_history" },
];

export const selectAssetsKeyboardData = (
  ctx: MyContext
): CategoryKeyboardDataTypes[] => [
  { name: ctx.t("crypto"), query: "select_crypto" },
  { name: ctx.t("fiat"), query: "select_fiat" },
  { name: ctx.t("gold"), query: "select_gold" },
  { name: ctx.t("removeAsset"), query: "category_remove" },
];

export const percentageKeyboardData: string[] = [
  "0.3",
  "0.5",
  "1",
  "2",
  "3",
  "5",
];
export const periodArray = (ctx: MyContext) => [
  { name: ctx.t("last24hours"), date: "day", range: 24 * 60 * 60 * 1000 },
  { name: ctx.t("lastWeek"), date: "week", range: 7 * 24 * 60 * 60 * 1000 },
  { name: ctx.t("lastMonth"), date: "month", range: 30 * 24 * 60 * 60 * 1000 },
  { name: ctx.t("lastYear"), date: "year", range: 365 * 24 * 60 * 60 * 1000 },
  { name: ctx.t("allTimes"), date: "all", range: null }, // No limit for "all"
];

export const priceHistoryKeyboardData = (
  ctx: MyContext
): CategoryKeyboardDataTypes[] => [
  { name: ctx.t("crypto"), query: "history_crypto" },
  { name: ctx.t("fiat"), query: "history_fiat" },
  { name: ctx.t("gold"), query: "history_gold" },
];

export const languageKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "English", query: "lang_en" },
  { name: "فارسی", query: "lang_fa" },
];
