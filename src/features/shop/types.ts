const SORT_KEYS = ["", "price-asc", "price-desc", "rating-desc"] as const;

type SortKey = (typeof SORT_KEYS)[number];

interface ShopFilterState {
  selectedCategories: string[];
  maxPrice: number;
  inStockOnly: boolean;
  priceDropOnly: boolean;
  sortKey: SortKey;
  searchQuery: string;
}

const SHOP_PRICE_MAX = 50000;
const SHOP_PRICE_DEFAULT = 25000;

export { SHOP_PRICE_DEFAULT, SHOP_PRICE_MAX, SORT_KEYS };
export type { ShopFilterState, SortKey };
