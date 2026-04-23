interface SearchCriteria<T> {
  key: string;
  getValue: (item: T) => string | string[] | null | undefined;
}

interface SearchConfig<T> {
  query: string;
  criteria: SearchCriteria<T>[];
}

function sanitizeSearchQuery(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, " ");
}

function toSearchTokens(query: string): string[] {
  const normalized = sanitizeSearchQuery(query);
  return normalized ? normalized.split(" ") : [];
}

function toCandidateValues(value: string | string[] | null | undefined): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  return values
    .map((entry) => sanitizeSearchQuery(entry))
    .filter(Boolean);
}

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

function filterBySearch<T>(items: T[], config: SearchConfig<T>): T[] {
  const normalizedQuery = sanitizeSearchQuery(config.query);

  if (!normalizedQuery) {
    return [...items];
  }

  return items.filter((item) => matchesByCriteria(item, config));
}

function createFieldCriteria<T>(
  key: string,
  getter: (item: T) => string | string[] | null | undefined,
): SearchCriteria<T> {
  return { key, getValue: getter };
}

export { createFieldCriteria, filterBySearch, matchesByCriteria, sanitizeSearchQuery, toSearchTokens };
export type { SearchConfig, SearchCriteria };
