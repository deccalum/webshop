import { Link } from 'react-router-dom'
import { MdComputer, MdSearch, MdShoppingCart, MdAccountCircle } from 'react-icons/md'
import '../styles/header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">

        <Link className="header__logo" to="/">
          <span className="header__logo-icon"><MdComputer size={18} /></span>
          <span>BYTE.SHOP</span>
        </Link>

        <nav className="header__nav">
          <Link to="/new">New Drops</Link>
          <Link to="/laptops">Laptops</Link>
          <Link to="/peripherals">Peripherals</Link>
          <Link to="/sale">Sale</Link>
        </nav>

        <div className="header__actions">
          <div className="header__search">
            <MdSearch className="header__search-icon" size={14} />
            <input type="text" placeholder="Search" />
          </div>
          <button className="header__icon-btn" aria-label="Cart">
            <MdShoppingCart size={18} />
            <span className="header__cart-badge">0</span>
          </button>
          <button className="header__icon-btn" aria-label="Account">
            <MdAccountCircle size={18} />
          </button>
        </div>

      </div>
    </header>
  )
}
