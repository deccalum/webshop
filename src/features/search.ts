// search.ts - utility functions and types for implementing search functionality across the app

/**
 * Describes one field that can be searched.
 *
 * @typeParam T The item type being searched.
 */
interface SearchCriteria<T> {
  /**
   * A short label for the searchable field.
   */
  key: string;

  /**
   * Returns the text values that should be checked for matches.
   *
   * @param item The item being inspected.
   * @returns One value, many values, or nothing if this field should not match.
   */
  getValue: (item: T) => string | string[] | null | undefined;
}

/**
 * Configures how a search query should be matched against a list of items.
 *
 * @typeParam T The item type being searched.
 */
interface SearchConfig<T> {
  /**
   * The raw query typed by the user.
   */
  query: string;

  /**
   * The list of searchable fields to compare against.
   */
  criteria: SearchCriteria<T>[];
}

/**
 * Normalizes user input so search matching is consistent.
 *
 * @remarks
 * This helper lowercases the text, removes extra whitespace, and trims the ends.
 * That makes searches more forgiving, so "  Blue   Shirt " behaves like
 * "blue shirt".
 *
 * @param raw The text entered by the user.
 * @returns A cleaned-up version of the query.
 */
function sanitizeSearchQuery(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Splits a search query into individual tokens.
 *
 * @remarks
 * A query like "blue shirt" becomes two tokens: ["blue", "shirt"].
 * Each token must match somewhere in the candidate values for the item.
 *
 * @param query The raw search query.
 * @returns The normalized tokens, or an empty array when the query is blank.
 */
function toSearchTokens(query: string): string[] {
  const normalized = sanitizeSearchQuery(query);
  return normalized ? normalized.split(" ") : [];
}

/**
 * Converts a field value into a normalized list of candidate strings.
 *
 * @remarks
 * Search fields may return one string, several strings, or nothing at all.
 * This helper converts every supported shape into the same array format so the
 * matching logic can treat them uniformly.
 *
 * @param value A field value returned from a search criterion.
 * @returns Normalized candidate strings ready for matching.
 */
function toCandidateValues(value: string | string[] | null | undefined): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  return values
    .map((entry) => sanitizeSearchQuery(entry))
    .filter(Boolean);
}

/**
 * Checks whether one item matches all tokens in the current search query.
 *
 * @typeParam T The item type being searched.
 * @param item The item to inspect.
 * @param config The search query and the fields to compare.
 * @returns `true` when every token appears in at least one candidate value.
 */
function matchesByCriteria<T>(item: T, config: SearchConfig<T>): boolean {
  const tokens = toSearchTokens(config.query);

  if (tokens.length === 0) {
    return true;
  }

  const candidates = config.criteria.flatMap((criterion) =>
    toCandidateValues(criterion.getValue(item)),
  );

  if (candidates.length === 0) {
    return false;
  }

  return tokens.every((token) =>
    candidates.some((candidate) => candidate.includes(token)),
  );
}

/**
 * Filters a list of items using the supplied search configuration.
 *
 * @typeParam T The item type being filtered.
 * @param items The full list of items to search.
 * @param config The query and fields used to decide which items match.
 * @returns A filtered copy of the items. When the query is blank, all items are returned.
 */
function filterBySearch<T>(items: T[], config: SearchConfig<T>): T[] {
  const normalizedQuery = sanitizeSearchQuery(config.query);

  if (!normalizedQuery) {
    return [...items];
  }

  return items.filter((item) => matchesByCriteria(item, config));
}

/**
 * Creates a searchable field definition.
 *
 * @typeParam T The item type being searched.
 * @param key A label for the field.
 * @param getter A function that returns the field value for one item.
 * @returns A field descriptor that can be passed into search helpers.
 */
function createFieldCriteria<T>(
  key: string,
  getter: (item: T) => string | string[] | null | undefined,
): SearchCriteria<T> {
  return { key, getValue: getter };
}

export { createFieldCriteria, filterBySearch, matchesByCriteria, sanitizeSearchQuery, toSearchTokens };
export type { SearchConfig, SearchCriteria };
