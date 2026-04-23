// types.ts - defines types and constants for shop filters and sorting

/**
 * All supported sort keys for the shop page.
 *
 * @remarks
 * The empty string means "no explicit sort".
 */
const SORT_KEYS = ["", "price-asc", "price-desc", "rating-desc"] as const;

/**
 * A valid sort key value used by the shop filter state.
 */
type SortKey = (typeof SORT_KEYS)[number];

/**
 * The complete set of filter values used by the shop page.
 */
interface ShopFilterState {
  /**
   * The categories currently selected by the user.
   */
  selectedCategories: string[];

  /**
   * The highest price allowed by the price filter.
   */
  maxPrice: number;

  /**
   * When `true`, only products that are in stock should be shown.
   */
  inStockOnly: boolean;

  /**
   * When `true`, only products with a price drop should be shown.
   */
  priceDropOnly: boolean;

  /**
   * The currently selected sort option.
   */
  sortKey: SortKey;

  /**
   * The raw search string typed by the user.
   */
  searchQuery: string;
}

/**
 * The maximum price available in the shop filter slider.
 */
const SHOP_PRICE_MAX = 50000;

/**
 * The default price filter used on first load and when the filters reset.
 */
const SHOP_PRICE_DEFAULT = 25000;

export { SHOP_PRICE_DEFAULT, SHOP_PRICE_MAX, SORT_KEYS };
export type { ShopFilterState, SortKey };
