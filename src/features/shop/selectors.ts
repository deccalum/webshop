import type { Product } from "../../data/mockproducts";
import { SHOP_PRICE_MAX, SORT_KEYS } from "./types";
import type { ShopFilterState, SortKey } from "./types";
import { createFieldCriteria, filterBySearch } from "../search";

const SORT_OPTIONS = [
  { value: "", label: "None" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
] as const;

const PRODUCT_SEARCH_CRITERIA = [
  createFieldCriteria<Product>("title", (item) => item.title),
  createFieldCriteria<Product>("category", (item) => item.category),
  createFieldCriteria<Product>("badge", (item) => item.badge),
];

function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.includes(value as SortKey);
}

function toSortKey(value: string): SortKey {
  return isSortKey(value) ? value : "";
}

function selectAllCategories(items: Product[]): string[] {
  return Array.from(new Set(items.map((item) => item.category))).sort();
}

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