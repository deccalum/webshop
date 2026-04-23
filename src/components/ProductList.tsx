import { MdChevronLeft, MdChevronRight, MdDashboard, MdList } from 'react-icons/md'
import Card from './Card'
import { MOCK_PRODUCTS } from '../data/mockproducts'
import { selectVisibleProducts, toSortKey, SORT_OPTIONS } from '../features/shop/selectors'
import { useShopFilters } from '../features/shop/state'
import '../styles/productlist.css'

export default function ProductMdList() {
  const { state, setSortKey } = useShopFilters()
  const visibleProducts = selectVisibleProducts(MOCK_PRODUCTS, state)

  return (
    <div className="productlist">
      {/* Header: Title + Sort + View */}
      <div className="productlist__section-header">
        <h2 className="productlist__title">All Products</h2>

        <div className="productlist__controls">
          {/* View toggle */}
          <div className="productlist__view-toggle">
            <button className="productlist__view-btn is-active" aria-label="Grid view">
              <MdDashboard size={18} />
            </button>
            <button className="productlist__view-btn" aria-label="MdList view">
              <MdList size={18} />
            </button>
          </div>

          {/* Sort dropdown */}
          <label className="productlist__sort">
            <span>Sort:</span>
            <select
              value={state.sortKey}
              onChange={(e) => setSortKey(toSortKey(e.target.value))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value || 'none'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="productlist__divider" />

      {/* Product Grid */}
      <div className="productlist__grid productlist__grid--grid">
        {visibleProducts.map((product) => (
          <Card key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination (cosmetic) */}
      <nav className="productlist__pagination" aria-label="Pagination">
        <button className="productlist__pagination-btn" aria-label="Previous page">
          <MdChevronLeft size={18} />
        </button>

        <div className="productlist__page-numbers">
          <button className="productlist__page-btn is-active" aria-current="page">
            1
          </button>
          <button className="productlist__page-btn">2</button>
          <button className="productlist__page-btn">3</button>
          <span className="productlist__page-dots">…</span>
        </div>

        <button className="productlist__pagination-btn" aria-label="Next page">
          <MdChevronRight size={18} />
        </button>
      </nav>
    </div>
  )
}
