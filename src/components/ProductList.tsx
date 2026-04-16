import { ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react'
import Card from './Card'
import { MOCK_PRODUCTS } from '../data/mockproducts'
import '../styles/productlist.css'


export default function ProductList() {
  return (
    <div className="productlist">
      {/* Header: Title + Sort + View */}
      <div className="productlist__section-header">
        <h2 className="productlist__title">All Products</h2>

        <div className="productlist__controls">
          {/* View toggle (cosmetic) */}
          <div className="productlist__view-toggle">
            <button className="productlist__view-btn is-active" aria-label="Grid view">
              <Grid3X3 size={18} />
            </button>
            <button className="productlist__view-btn" aria-label="List view">
              <List size={18} />
            </button>
          </div>

          {/* Sort dropdown (cosmetic) */}
          <label className="productlist__sort">
            <span>Sort:</span>
            <select disabled>
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </label>
        </div>
      </div>

      <div className="productlist__divider" />

      {/* Product Grid */}
      <div className="productlist__grid productlist__grid--grid">
        {MOCK_PRODUCTS.map((product) => (
          <Card key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination (cosmetic) */}
      <nav className="productlist__pagination" aria-label="Pagination">
        <button className="productlist__pagination-btn" aria-label="Previous page">
          <ChevronLeft size={18} />
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
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  )
}
