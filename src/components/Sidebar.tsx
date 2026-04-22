import { useMemo, useState } from "react";
import AdBox from "./AdBox";
import { MOCK_PRODUCTS, type Product } from "../data/mockproducts";
import { useFilterProducts } from "../hooks/filterProducts";
import type { FilterMap, SortMap } from "../utils/filterEngine";
import "../styles/sidebar.css";

const MOCK_CATEGORIES = ["Laptops", "Peripherals", "Monitors", "Components"];

export default function Sidebar() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceDropOnly, setPriceDropOnly] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<string>("");

  /**
   * Toggles a category in the selected categories list.
   * Adds category if not present; removes if already selected.
   *
   * @param {string} category - Category name to toggle (e.g., "Laptops", "Peripherals")
   * @returns {void}
   */
  function toggleCategory(category: string) {
    setSelectedCategories((prev) => {
      return prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
    });
  }

  /**
   * Builds filter predicates from UI state. Memoized to stabilize across renders.
   * Undefined entries are treated as inactive by the engine.
   *
   * @type {FilterMap<Product>} Record<string, FilterFn<Product> | undefined>
   * @field category  - Active only if selections exist; filters by selected categories
   * @field maxPrice  - Always active; excludes products exceeding this price point
   * @field inStock   - Active when inStockOnly is true; filters by availability
   * @field priceDrop - Active when priceDropOnly is true; filters by sale status
   * @param {string[]} selectedCategories - Dependency for category filter
   * @param {number} maxPrice             - Dependency for price filter
   * @param {boolean} inStockOnly         - Dependency for stock filter
   * @param {boolean} priceDropOnly       - Dependency for price-drop filter
   * @returns {FilterMap<Product>} Object with filter functions or undefined
   */
  const filters = useMemo<FilterMap<Product>>(
    () => ({
      category:
        selectedCategories.length > 0
          ? (p) => selectedCategories.includes(p.category)
          : undefined,
      maxPrice: (p) => p.price <= maxPrice,
      inStock: inStockOnly ? (p) => p.inStock : undefined,
      priceDrop: priceDropOnly
        ? (p) => p.originalPrice !== undefined && p.originalPrice > p.price
        : undefined,
    }),
    [selectedCategories, maxPrice, inStockOnly, priceDropOnly],
  );

  /**
   * Defines available sort strategies. Memoized with empty deps as sorts never change.
   *
   * @type {SortMap<Product>} Record<string, SortFn<Product>>
   * @field price-asc   - Sorts products by price ascending (cheapest first)
   * @field price-desc  - Sorts products by price descending (most expensive first)
   * @field rating-desc - Sorts products by rating descending (highest rated first)
   * @returns {SortMap<Product>} Object mapping sort keys to comparator functions
   */
  const sort = useMemo<SortMap<Product>>(
    () => ({
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "rating-desc": (a, b) => b.rating - a.rating,
    }),
    [],
  );

  /**
   * Computes filtered and sorted products based on current filter and sort state.
   * Returns filtered items, active filter count, and category distribution.
   *
   * @type {UseFilterProductsConfig<Product>} Configuration object for the hook
   * @param {Product[]} items                       - Source product array (MOCK_PRODUCTS)
   * @param {FilterMap<Product>} filters            - Active filter predicates
   * @param {string} sortKey                        - Selected sort strategy key
   * @param {SortMap<Product>} sorts                - Available sort functions
   * @param {(item: Product) => string} getCategory - Extractor for category field
   * @returns {object} Object with filteredItems, activeCount, and categoryCounts (Map)
   * @returns {Product[]} returns.filteredItems     - Products after filters and sort
   * @returns {number} returns.activeCount          - Total active filters + sort (if any)
   * @returns {Map<string, number>|undefined} returns.categoryCounts - Product count per category in filtered set
   */
  const { filteredItems, activeCount, categoryCounts } = useFilterProducts({
    items: MOCK_PRODUCTS,
    filters,
    sortKey,
    sorts: sort,
    getCategory: (p) => p.category,
  });

  return (
    <aside className="sidebar">
      <p>Active Filters: {activeCount}</p>
      <p>Match: {filteredItems.length}</p>

      <section className="sidebar__section">
        <h3 className="sidebar__title">Category</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={selectedCategories.length === 0}
              onChange={() => setSelectedCategories([])}
            />
            All Products
          </label>
          {MOCK_CATEGORIES.map((cat) => (
            <label key={cat} className="sidebar__check">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat} {categoryCounts ? `(${categoryCounts.get(cat) ?? 0})` : ""}
            </label>
          ))}
        </div>
      </section>

      <div className="sidebar__divider" />

      <section className="sidebar__section">
        <h3 className="sidebar__title">Price</h3>
        <div className="sidebar__price-range">
          <div className="sidebar__price-labels">
            <span>0 kr</span>
            <span>{maxPrice.toLocaleString("sv-SE")} kr</span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </section>

      <div className="sidebar__divider" />

      <section className="sidebar__section">
        <h3 className="sidebar__title">Availability</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In Stock
          </label>
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={priceDropOnly}
              onChange={(e) => setPriceDropOnly(e.target.checked)}
            />
            Price Drop
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />

      <section className="sidebar__section">
        <h3 className="sidebar__title">Sort</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <span>Order</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="">None</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />

      <AdBox />
    </aside>
  );
}
