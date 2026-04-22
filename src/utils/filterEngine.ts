type FilterFn<T> = (item: T) => boolean;
type SortFn<T> = (a: T, b: T) => number;

interface FilterEntry<T> {
  key: string;
  fn: FilterFn<T>;
}

type FilterMap<T> = Record<string, FilterFn<T> | undefined>;
type SortMap<T> = Record<string, SortFn<T> | undefined>;

interface FilterEngineConfig<T> {
  items: T[];
  filters?: FilterMap<T>;
  sortKey?: string;
  sorts?: SortMap<T>;
}

interface FilterEngineResult<T> {
  items: T[];
  activeCount: number;
}

function getFilterEntries<T>(filters: FilterMap<T> = {}): FilterEntry<T>[] {
  return Object.entries(filters)
    .filter(
      (entry): entry is [string, FilterFn<T>] => typeof entry[1] === "function",
    )
    .map(([key, fn]) => ({ key, fn }));
}

function applyFilters<T>(items: T[], filters: FilterEntry<T>[]): T[] {
  return items.filter((item) => filters.every((filter) => filter.fn(item)));
}

function applySort<T>(
  items: T[],
  sortKey: string,
  sorts: SortMap<T> = {},
): T[] {
  const sortFn = sorts[sortKey];

  if (!sortFn) {
    return items;
  }

  return [...items].sort(sortFn);
}

function countActiveFilters<T>(
  filters: FilterMap<T> = {},
  sortKey = "",
): number {
  return getFilterEntries(filters).length + (sortKey ? 1 : 0);
}

function applyFilterEngine<T>({
  items,
  filters = {},
  sortKey = "",
  sorts = {},
}: FilterEngineConfig<T>): FilterEngineResult<T> {
  const activeFilters = getFilterEntries(filters);
  const filteredItems = applyFilters(items, activeFilters);
  const sortedItems = applySort(filteredItems, sortKey, sorts);

  return {
    items: sortedItems,
    activeCount: countActiveFilters(filters, sortKey),
  };
}

function countCategory<T>(
  items: T[],
  getCategoryFn: (item: T) => string,
): Map<string, number> {
  const categoryCount = new Map<string, number>();
  items.forEach((item) => {
    const category = getCategoryFn(item);
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  });
  return categoryCount;
}

export {
  applyFilterEngine,
  applyFilters,
  applySort,
  countActiveFilters,
  countCategory,
  getFilterEntries,
};
export type {
  FilterEngineConfig,
  FilterEngineResult,
  FilterEntry,
  FilterFn,
  FilterMap,
  SortFn,
  SortMap,
};
