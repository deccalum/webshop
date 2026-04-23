import { Link } from 'react-router-dom'
import { MdComputer, MdSearch, MdAccountCircle } from 'react-icons/md'
import { useShopFilters } from '../features/shop/state'
import CartPreview from './CartPreview'
import '../styles/header.css'

export default function Header() {
  const { state, setSearchQuery } = useShopFilters()

  return (
    <header className="header">
      <div className="header__container">

        {/* Brand Column */}
        <Link className="header__logo" to="/">
          <span className="header__logo-icon"><MdComputer size={18} /></span>
          <span>BYTE.SHOP</span>
        </Link>

        {/* Primary Navigation */}
        <nav className="header__nav">
          <Link to="/new">New Drops</Link>
          <Link to="/laptops">Laptops</Link>
          <Link to="/peripherals">Peripherals</Link>
          <Link to="/sale">Sale</Link>
        </nav>

        {/* Utility Actions */}
        <div className="header__actions">
          <div className="header__search">
            <MdSearch className="header__search-icon" size={14} />
            <input
              type="text"
              placeholder="Search"
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CartPreview />
          <button className="header__icon-btn" aria-label="Account">
            <MdAccountCircle size={18} />
          </button>
        </div>

      </div>
    </header>
  )
}
