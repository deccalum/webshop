import { MdFavoriteBorder, MdVisibility, MdAdd } from 'react-icons/md'
import { CART_STORAGE_KEY, createCart, loadCartFromStorage, saveCartToStorage } from '../features/cart'
import '../styles/card.css'

interface CardProps {
  id: number
  title: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  badge?: string
  inStock: boolean
}

export default function Card({
  id,
  title,
  category,
  price,
  originalPrice,
  rating,
  image,
  badge,
  inStock,

}: CardProps) {
  const handleAddToCart = () => {
    if (!inStock) return
    const cart = createCart(loadCartFromStorage(CART_STORAGE_KEY))
    cart.addItem(id, 1)
    saveCartToStorage(CART_STORAGE_KEY, cart.getItems())
  }

  return (
    <article className="card">
      <div className="card__image-wrapper">
        <img src={image} alt={title} className="card__image" />

        {badge && <span className="card__badge">{badge}</span>}

        <button className="card__favorite" aria-label="Add to favorites">
          <MdFavoriteBorder size={18} />
        </button>

        {inStock && (
          <div className="card__actions">
            <button className="card__action-btn" aria-label="Quick view">
              <MdVisibility size={18} />
            </button>
            <button className="card__action-btn" aria-label="Add to cart" onClick={handleAddToCart}>
              <MdAdd size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="card__content">
        <div className="card__meta">
          <span className="card__category">{category}</span>
          <div className="card__rating">
            <span className="card__star">★</span>
            <span>{rating}</span>
          </div>
        </div>

        <h3 className="card__title">{title}</h3>

        <div className="card__footer">
          <div className="card__prices">
            {originalPrice && <span className="card__original-price">{originalPrice} kr</span>}
            <span className="card__price">{price} kr</span>
          </div>
          <button className="card__add-btn" disabled={!inStock} onClick={handleAddToCart}>
            {inStock ? 'Add to cart' : 'Notify me'}
          </button>
        </div>
      </div>
    </article>
  )
}
