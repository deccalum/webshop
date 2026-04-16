import AdBox from './AdBox'
import '../styles/sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <section className="sidebar__section">
        <h3 className="sidebar__title">Category</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input type="checkbox" defaultChecked /> All Products
          </label>
          <label className="sidebar__check">
            <input type="checkbox" /> Laptops
          </label>
          <label className="sidebar__check">
            <input type="checkbox" /> Peripherals
          </label>
          <label className="sidebar__check">
            <input type="checkbox" /> Monitors
          </label>
          <label className="sidebar__check">
            <input type="checkbox" /> Components
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />

      <section className="sidebar__section">
        <h3 className="sidebar__title">Price</h3>
        {/* basic range placeholder — replace with min/max + snap */}
        <div className="sidebar__price-range">
          <div className="sidebar__price-labels">
            <span>0 kr</span>
            <span>50 000 kr</span>
          </div>
          <input type="range" min="0" max="50000" defaultValue="25000" />
        </div>
      </section>

      <div className="sidebar__divider" />

      <section className="sidebar__section">
        <h3 className="sidebar__title">Availability</h3>
        <div className="sidebar__filters">
          <label className="sidebar__check">
            <input type="checkbox" /> In Stock
          </label>
          <label className="sidebar__check">
            <input type="checkbox" /> Price Drop
          </label>
        </div>
      </section>

      <div className="sidebar__divider" />
      <AdBox />

    </aside>
  )
}
