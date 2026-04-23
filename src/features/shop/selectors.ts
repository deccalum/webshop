// selectors.ts - pure functions to derive data for Shop page from products + filter state

import type { Product } from "../../data/mockproducts";
import { SHOP_PRICE_MAX, SORT_KEYS } from "./types";
import type { ShopFilterState, SortKey } from "./types";
import { createFieldCriteria, filterBySearch } from "../search";

/**
 * Sort choices exposed to the shop UI.
 *
 * @remarks
 * The empty value means "no sort override" and keeps the original product order.
 */
const SORT_OPTIONS = [
  { value: "", label: "None" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
] as const;

/**
 * Search fields used to match products in the shop listing.
 *
 * @remarks
 * A product matches when the query appears in any of these fields.
 */
const PRODUCT_SEARCH_CRITERIA = [
  createFieldCriteria<Product>("title", (item) => item.title),
  createFieldCriteria<Product>("category", (item) => item.category),
  createFieldCriteria<Product>("badge", (item) => item.badge),
];

/**
 * Checks whether a string is a supported sort key.
 *
 * @param value The raw string to validate.
 * @returns `true` when the value matches one of the known sort keys.
 */
function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.includes(value as SortKey);
}

/**
 * Converts an arbitrary string into a valid sort key.
 *
 * @param value The raw value from UI state or a URL parameter.
 * @returns A supported sort key, or an empty string when the value is invalid.
 */
function toSortKey(value: string): SortKey {
  return isSortKey(value) ? value : "";
}

/**
 * Collects every unique product category and sorts the result alphabetically.
 *
 * @param items The full product list.
 * @returns A sorted array of category names with duplicates removed.
 */
function selectAllCategories(items: Product[]): string[] {
  return Array.from(new Set(items.map((item) => item.category))).sort();
}

/**
 * Applies all shop filters to the product list.
 *
 * @remarks
 * The filtering steps are applied in this order:
 * - search query matching
 * - category selection
 * - price ceiling
 * - in-stock only
 * - price-drop only
 * - sorting
 *
 * @param items The full product list.
 * @param state The current filter state.
 * @returns The products that match the current search, filter, and sort settings.
 */
function selectVisibleProducts(items: Product[], state: ShopFilterState): Product[] {
  const searchFiltered = filterBySearch(items, {
    query: state.searchQuery,
    criteria: PRODUCT_SEARCH_CRITERIA,
  });

  const filtered = searchFiltered.filter((item) => {
    if (
      state.selectedCategories.length > 0 &&
      !state.selectedCategories.includes(item.category)
    ) {
      return false;
    }

    if (item.price > state.maxPrice) {
      return false;
    }

    if (state.inStockOnly && !item.inStock) {
      return false;
    }

    if (state.priceDropOnly && !(item.originalPrice && item.originalPrice > item.price)) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered];

  if (state.sortKey === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (state.sortKey === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (state.sortKey === "rating-desc") {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  return sorted;
}

/**
 * Counts how many shop filters are currently active.
 *
 * @param state The current filter state.
 * @returns The number of active filter controls.
 */
function selectActiveFilterCount(state: ShopFilterState): number {
  let count = 0;

  if (state.searchQuery.trim()) count += 1;
  if (state.selectedCategories.length > 0) count += 1;
  if (state.maxPrice < SHOP_PRICE_MAX) count += 1;
  if (state.inStockOnly) count += 1;
  if (state.priceDropOnly) count += 1;
  if (state.sortKey) count += 1;

  return count;
}

/**
 * Counts how many products belong to each category.
 *
 * @param items The full product list.
 * @returns A map of category name to product count.
 */
function selectCategoryCounts(items: Product[]): Map<string, number> {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  });

  return counts;
}

export {
  selectActiveFilterCount,
  selectAllCategories,
  selectCategoryCounts,
  selectVisibleProducts,
  toSortKey,
  SORT_OPTIONS,
};
export type { SortKey };