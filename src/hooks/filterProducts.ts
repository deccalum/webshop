import { useMemo } from "react";
import { applyFilterEngine } from "../utils/filterEngine";
import { countCategory } from "../utils/filterEngine";
import type { FilterEngineConfig } from "../utils/filterEngine";


interface UseFilterProductsConfig<T> extends FilterEngineConfig<T> { //try find a secondary use of the interface eg. buyplan
  getCategory?: (item: T) => string;
}

function useFilterProducts<T>({
  items,
  filters,
  sortKey,
  sorts,
  getCategory,
}: UseFilterProductsConfig<T>) {
  return useMemo(() => {
    const result = applyFilterEngine({ items, filters, sortKey, sorts });

    return {
      filteredItems: result.items,
      activeCount: result.activeCount,
      categoryCounts: getCategory
        ? countCategory(result.items, getCategory)
        : undefined,
    };
  }, [items, filters, sortKey, sorts, getCategory]);
}

export { useFilterProducts };
export type { UseFilterProductsConfig };
