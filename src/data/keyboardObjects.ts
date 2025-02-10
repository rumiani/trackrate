export type CategoryKeyboardDataTypes = {
  name: string;
  query: string;
};
export const allCategoriesKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "Add crypto", query: "category_add-crypto" },
  { name: "Add fiat", query: "category_add-fiat" },
  { name: "Add gold", query: "category_add-gold" },
  { name: "My assets", query: "category_see-list" },
  { name: "Remove asset", query: "category_remove-assets" },
  { name: "Assets List", query: "category_assets-list" },

];
export const watchingAssetsListKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "Add crypto", query: "category_add-crypto" },
  { name: "Add fiat", query: "category_add-fiat" },
  { name: "Add gold", query: "category_add-gold" },
  { name: "Remove asset", query: "category_remove-assets" },
];

export const addCategoryKeyboardData: CategoryKeyboardDataTypes[] = [
  { name: "Add crypto", query: "category_add-crypto" },
  { name: "Add fiat", query: "category_add-fiat" },
  { name: "Add gold", query: "category_add-gold" },

];
export const percentageKeyboardData: string[] = ["0.3","0.5","1", "2", "3","5"];
