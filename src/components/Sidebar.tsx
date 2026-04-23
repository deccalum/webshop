import AdBox from "./AdBox";
import { useMemo } from "react";
import { MOCK_PRODUCTS } from "../data/mockproducts";
import {
  selectActiveFilterCount,
  selectAllCategories,
  selectCategoryCounts,
  selectVisibleProducts,
  toSortKey,
  SORT_OPTIONS,
} from "../features/shop/selectors";
import { useShopFilters } from "../features/shop/state";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { state, toggleCategory, clearCategories, setMaxPrice, setInStockOnly, setPriceDropOnly, setSortKey } = useShopFilters();
  const filteredItems = useMemo(() => selectVisibleProducts(MOCK_PRODUCTS, state), [state]);
  const categoryCounts = useMemo(() => selectCategoryCounts(filteredItems), [filteredItems]);
  const activeCount = useMemo(() => selectActiveFilterCount(state), [state]);
  const categories = useMemo(() => selectAllCategories(MOCK_PRODUCTS), []);

  return (
    <aside className="sidebar">
      {/* Filter Summary */}
      <p>Active Filters: {activeCount}</p>
      <p>Match: {filteredItems.length}</p>

      {/* Category Filters */}
      <section className="sidebar__section">
        <h3 className="sidebar__title">Category</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={state.selectedCategories.length === 0}
              onChange={clearCategories}
            />
            All Products
          </label>
          {categories.map((cat) => (
            <label key={cat} className="sidebar__check">
              <input
                type="checkbox"
                checked={state.selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat} {categoryCounts ? `(${categoryCounts.get(cat) ?? 0})` : ""}
            </label>
          ))}
        </div>
      </section>

      <div className="sidebar__divider" />

      {/* Price Filter */}
      <section className="sidebar__section">
        <h3 className="sidebar__title">Price</h3>
        <div className="sidebar__price-range">
          <div className="sidebar__price-labels">
            <span>0 kr</span>
            <span>{state.maxPrice.toLocaleString("sv-SE")} kr</span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            value={state.maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </section>

      <div className="sidebar__divider" />

      {/* Availability Filters */}
      <section className="sidebar__section">
        <h3 className="sidebar__title">Availability</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={state.inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In Stock
          </label>
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={state.priceDropOnly}
              onChange={(e) => setPriceDropOnly(e.target.checked)}
            />
            Price Drop
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />

      {/* Sort Controls */}
      <section className="sidebar__section">
        <h3 className="sidebar__title">Sort</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <span>Order</span>
            <select
              value={state.sortKey}
              onChange={(e) => setSortKey(toSortKey(e.target.value))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value || "none"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />

      {/* Promo Content */}
      <AdBox />
    </aside>
  );
}
