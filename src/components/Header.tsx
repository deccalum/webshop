import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdComputer, MdSearch, MdShoppingCart, MdAccountCircle } from 'react-icons/md'
import { useShopFilters } from '../features/shop/state';
import { CART_STORAGE_KEY, CART_UPDATED_EVENT, createCart, loadCartFromStorage, saveCartToStorage } from '../features/cart';
import { MOCK_PRODUCTS } from '../data/mockproducts';
import '../styles/header.css'

export default function Header() {
  const { state, setSearchQuery } = useShopFilters();
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(CART_STORAGE_KEY))
  const cartContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const syncCart = () => {
      setCartItems(loadCartFromStorage(CART_STORAGE_KEY))
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (!cartContainerRef.current) return
      if (!cartContainerRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)
    document.addEventListener('mousedown', handleDocumentClick)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [])

  const cart = useMemo(() => createCart(cartItems), [cartItems])

  const cartLineItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
        if (!product) return null
        return {
          ...item,
          title: product.title,
          price: product.price,
          lineTotal: product.price * item.quantity,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [cartItems])

  const cartCount = cart.getCount()
  const cartTotal = cart.getTotal((productId) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    return product ? product.price : 0
  })

  const handleRemoveItem = (productId: number) => {
    const nextCart = createCart(loadCartFromStorage(CART_STORAGE_KEY))
    nextCart.removeItem(productId)
    saveCartToStorage(CART_STORAGE_KEY, nextCart.getItems())
  }

  const handleClearAll = () => {
    const nextCart = createCart(loadCartFromStorage(CART_STORAGE_KEY))
    nextCart.clear()
    saveCartToStorage(CART_STORAGE_KEY, nextCart.getItems())
  }

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
            <input
              type="text"
              placeholder="Search"
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header__cart" ref={cartContainerRef}>
            <button
              className="header__icon-btn"
              aria-label="Cart"
              aria-expanded={isCartOpen}
              onClick={() => setIsCartOpen((prev) => !prev)}
            >
            <MdShoppingCart size={18} />
            <span className={`header__cart-badge ${cartCount > 0 ? 'is-visible' : ''}`}>{cartCount}</span>
            </button>

            {isCartOpen && (
              <div className="header__cart-panel" role="dialog" aria-label="Cart preview">
                <div className="header__cart-panel-header">
                  <strong>Cart</strong>
                  <span>{cartCount} items</span>
                </div>

                {cartLineItems.length === 0 ? (
                  <p className="header__cart-empty">Your cart is empty.</p>
                ) : (
                  <ul className="header__cart-list">
                    {cartLineItems.map((item) => (
                      <li key={item.productId} className="header__cart-item">
                        <div>
                          <span className="header__cart-item-title">{item.title}</span>
                          <span className="header__cart-item-meta">{item.quantity} x {item.price} kr</span>
                        </div>
                        <button
                          type="button"
                          className="header__cart-remove"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="header__cart-footer">
                  <span>Total</span>
                  <strong>{cartTotal} kr</strong>
                </div>

                <div className="header__cart-actions">
                  <button
                    type="button"
                    className="header__cart-clear"
                    onClick={handleClearAll}
                    disabled={cartLineItems.length === 0}
                  >
                    Clear all
                  </button>
                  <Link className="header__cart-link" to="/cart" onClick={() => setIsCartOpen(false)}>
                    View cart &amp; checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
          <button className="header__icon-btn" aria-label="Account">
            <MdAccountCircle size={18} />
          </button>
        </div>

      </div>
    </header>
  )
}
