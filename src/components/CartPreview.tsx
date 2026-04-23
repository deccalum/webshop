import { useEffect, useMemo, useRef, useState } from 'react'
import type { CartItem } from '../features/cart'
import { Link } from 'react-router-dom'
import { MdShoppingCart } from 'react-icons/md'
import { CART_STORAGE_KEY, CART_UPDATED_EVENT, createCart, loadCartFromStorage, saveCartToStorage } from '../features/cart'
import { MOCK_PRODUCTS } from '../data/mockproducts'
import '../styles/cartpreview.css'

/**
 * The shape used to render one line in the cart preview dropdown.
 */
interface CartLineItem extends CartItem {
  title: string
  price: number
  lineTotal: number
}

/**
 * Shows a compact cart preview and keeps it synced with saved cart data.
 *
 * @remarks
 * This component listens for both the custom `cart:updated` event and the
 * native `storage` event so the preview stays current when another part of the
 * app changes the saved cart.
 *
 * @returns The cart toggle button and, when open, the cart dropdown panel.
 */
export default function CartPreview() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartFromStorage(CART_STORAGE_KEY))
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    /**
     * Refreshes the preview state from local storage.
     *
     * @returns Nothing.
     */
    const syncCart = () => setCartItems(loadCartFromStorage(CART_STORAGE_KEY))

    /**
     * Closes the dropdown when the user clicks outside the preview container.
     *
     * @param event The mouse event received by the document listener.
     * @returns Nothing.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /**
   * Builds a cart helper from the current saved items.
   *
   * @remarks
   * The cart helper keeps quantity and total calculations in one place instead
   * of duplicating that logic inside the component.
   *
   * @returns A cart instance backed by the current preview state.
   */
  const cart = useMemo(() => createCart(cartItems), [cartItems])

  /**
   * Looks up product details for each saved cart item.
   *
   * @remarks
   * The cart only stores ids and quantities, so this step attaches the product
   * title, unit price, and line total needed for display.
   *
   * @returns A list of display-ready cart line items.
   */
  const cartLineItems = useMemo<CartLineItem[]>(() => {
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

  /**
   * Removes one product from the saved cart.
   *
   * @param productId The product to remove from the cart.
   * @returns Nothing.
   */
  const handleRemoveItem = (productId: number) => {
    const next = createCart(loadCartFromStorage(CART_STORAGE_KEY))
    next.removeItem(productId)
    saveCartToStorage(CART_STORAGE_KEY, next.getItems())
  }

  /**
   * Clears every item from the saved cart.
   *
   * @returns Nothing.
   */
  const handleClearAll = () => {
    const next = createCart(loadCartFromStorage(CART_STORAGE_KEY))
    next.clear()
    saveCartToStorage(CART_STORAGE_KEY, next.getItems())
  }

  return (
    <div className="cart-preview__section" ref={containerRef}>
      {/* Cart Toggle */}
      <button
        className="cart-preview__toggle-icon"
        aria-label="Cart"
        aria-expanded={isCartOpen}
        onClick={() => setIsCartOpen((open) => !open)}
      >
        <MdShoppingCart size={18} />
        <span className="cart-preview__badge">{cartCount > 0 ? cartCount : ''}</span>
      </button>

      {isCartOpen && (
        <div className="cart-preview__dropdown" role="dialog" aria-label="Cart preview">
          {/* Cart Header */}
          <div className="cart-preview__header">
            <strong>Cart</strong>
            <span>{cartCount} items</span>
          </div>

          {/* Cart Items */}
          {cartLineItems.length === 0 ? (
            <p className="cart-preview__empty">Your cart is empty.</p>
          ) : (
            <ul className="cart-preview__items">
              {cartLineItems.map((item) => (
                <li key={item.productId} className="cart-preview__item">
                  <div>
                    <span className="cart-preview__item-title">{item.title}</span>
                    <span className="cart-preview__item-quantity">x{item.quantity}</span>
                    <span className="cart-preview__item-price">{item.lineTotal} kr</span>
                  </div>
                  <button
                    type="button"
                    className="cart-preview__item-remove"
                    aria-label={`Remove ${item.title} from cart`}
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Cart Summary */}
          <div className="cart-preview__footer">
            <span>Total</span>
            <strong>{cartTotal} kr</strong>
          </div>

          {/* Cart Actions */}
          <div className="cart-preview__actions">
            <button
              type="button"
              className="cart-preview__clear"
              onClick={handleClearAll}
              disabled={cartLineItems.length === 0}
            >
              Clear all
            </button>
            <Link className="cart-preview__link" to="/cart" onClick={() => setIsCartOpen(false)}>
              View cart &amp; checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
